function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
         <div class="col">
        <div class="weekday">${formatDay(forecastDay.time)}</div>
        <div class="weekday-weather">
          <span class="weekday-maximum"><strong>${Math.round(
            forecastDay.temperature.maximum
          )}°</strong></span> |
          <span class="weekday-minimum">${Math.round(
            forecastDay.temperature.minimum
          )}°</span>
        </div>
        <div class="weekday-weather-emoji">
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png"
          alt=""
        />
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "0o4cee02faabb46ata501b17c3ac5535";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
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
  windspeed.innerHTML = `${Math.round(response.data.wind.speed)}m/s`;
  weatherCondition.innerHTML = response.data.condition.description;
  currentWeatherIcon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  currentWeatherIconAlt.setAttribute(
    "alt",
    response.data.condition.description
  );

  getForecast(response.data.coordinates);
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

searchCity("Pretoria");
