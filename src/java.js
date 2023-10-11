function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

function displayForecast() {
  let forecastElement = document.querySelector("#forecast");

  let days = ["Wed", "Thur", "Fri", "Sat", "Sun"];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col">
          <div class="weekday">${day}</div>
          <div class="weekday-weather">
            <span class="weeday-maximum">31&deg</span> /
            <span class="weekday-minimum">12&deg</span>
          </div>
          <div class="weekday-weather-emoji">
            <img
              src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/broken-clouds-day.png"
            />
          </div>
        </div>
      `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 2;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  temperature.innerHTML = Math.round(celsiusTemperature);
}

function displayWeatherCondition(response) {
  console.log(response);
  let city = document.querySelector("#city");
  let currentTemp = document.querySelector("#current-temperature");
  let humidity = document.querySelector("#humidity");
  let windspeed = document.querySelector("#wind");
  let weatherCondition = document.querySelector("#weather");
  let currentWeatherIcon = document.querySelector("#current-weather-icon");

  let currentWeatherIconAlt = document.querySelector("#current-weather-icon");

  celsiusTemperature = response.data.temperature.current;

  city.innerHTML = response.data.city;
  currentTemp.innerHTML = Math.round(celsiusTemperature);
  humidity.innerHTML = `${response.data.temperature.humidity}%`;
  windspeed.innerHTML = `${Math.round(response.data.wind.speed)}km/h`;
  weatherCondition.innerHTML = response.data.condition.description;
  currentWeatherIcon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  currentWeatherIconAlt.setAttribute(
    "alt",
    response.data.condition.description
  );
}

function searchCity(city) {
  let apiKey = "0o4cee02faabb46ata501b17c3ac5535";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "0o4cee02faabb46ata501b17c3ac5535";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#city-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertToCelsius);

let celsiusTemperature = null;

searchCity("Pretoria");
displayForecast();
