function updateCurrentTime() {
  let now = new Date();
  let h5 = document.querySelector("h5");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let today = days[now.getDay()];
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();
  h5.innerHTML = `${today}, ${month} ${date} -  ${hour}:${minutes}h`;
}

updateCurrentTime();

//get weather API

function searchInfo(response) {
  let showTemp = document.querySelector("#current-degrees");
  let temperature = Math.round(response.data.main.temp);
  let currentCity = response.data.name;
  let cityHeader = document.querySelector("#currentCity");
  let description = document.querySelector("#temperatureDescription");
  description.innerHTML = response.data.weather[0].description;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  cityHeader.innerHTML = currentCity;
  showTemp.innerHTML = `${temperature}ºC`;
}

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#lookForCity");
  let apiKey = "bdba0ebff82207db7458c1987a1d52e6";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric`;
  axios.get(url).then(searchInfo);
}
let searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("submit", searchCity);

//actual position - ok

function showTemperature(response) {
  let showTemp = document.querySelector("#current-degrees");
  let temperature = Math.round(response.data.main.temp);
  let currentLocCity = response.data.name;
  let cityHeader = document.querySelector("#currentCity");
  let description = document.querySelector("#temperatureDescription");
  description.innerHTML = response.data.weather[0].description;
  cityHeader.innerHTML = currentLocCity;
  showTemp.innerHTML = `${temperature}ºC`;
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "4be82d0a22a54cdd07913883dd7c82c4";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTemperature);
}
function findCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", findCurrentLocation);
