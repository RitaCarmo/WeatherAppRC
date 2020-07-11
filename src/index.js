var app = {
  apiKey: "bdba0ebff82207db7458c1987a1d52e6",

  h5: document.querySelector("h5"),

  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],

  months: [
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
  ],

  updateCurrentTime: function() {
    app.h5.innerHTML = app.formatHours(Date.now(), true);
  },

  formatHours: function(timestamp, extraFormat) {
    let now = new Date(timestamp);
    let today = app.days[now.getDay()];
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let month = app.months[now.getMonth()];
    let date = now.getDate();
    let seconds = now.getSeconds();
    if (seconds === 0) {
      seconds = "00";
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return (
      `${today}, ${month} ${date}  ${hour}:${minutes}` +
      (extraFormat ? ":" + seconds : "")
    );
  },

  searchInfo: function(response) {
    app.updateCurrentTime();
    app.updateTemp(response.data.main.temp);
    app.updateCurrentCity(response.data.name);
    app.getDescription(response.data.weather[0].description);
    app.getIcon(response.data.weather[0].icon);
  },

  updateTemp: function(temp) {
    let showTemp = document.querySelector("#current-degrees");
    let temperature = Math.round(temp);
    showTemp.innerHTML = `${temperature}ºC`;
  },

  updateCurrentCity: function(currentCity) {
    let cityHeader = document.querySelector("#currentCity");
    cityHeader.innerHTML = currentCity;
  },

  getDescription: function(description) {
    let seeDescription = document.querySelector("#temperatureDescription");
    seeDescription.innerHTML = description;
  },

  getIcon: function(icon) {
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${icon}@2x.png`
    );
  },

  searchCity: function(event) {
    event.preventDefault();

    let city = document.querySelector("#lookForCity");

    let apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${app.apiKey}&units=metric`;
    axios
      .get(apiUrl1)
      .then(app.searchInfo)
      .catch(function(err) {
        console.log(err);
      });

    apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&appid=${app.apiKey}&units=metric`;
    axios
      .get(apiUrl2)
      .then(displayForecast)
      .catch(function(err) {
        console.log(err);
      })
      .finally(function() {
        document.getElementById("forecast").style.visibility = "visible";
      });
  },

  showTemperature: function(response) {
    let showTemp = document.querySelector("#current-degrees");
    let temperature = Math.round(response.data.main.temp);
    let currentLocCity = response.data.name;
    let cityHeader = document.querySelector("#currentCity");
    let description = document.querySelector("#temperatureDescription");
    description.innerHTML = response.data.weather[0].description;
    cityHeader.innerHTML = currentLocCity;
    showTemp.innerHTML = `${temperature}ºC`;

    apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?q=${response.data.name}&appid=${app.apiKey}&units=metric`;
    axios
      .get(apiUrl2)
      .then(displayForecast)
      .catch(function(err) {
        console.log(err);
      })
      .finally(function() {
        document.getElementById("forecast").style.visibility = "visible";
      });
  },

  showPosition: function(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${app.apiKey}`;
    axios.get(url).then(app.showTemperature);
  },

  findCurrentLocation: function() {
    navigator.geolocation.getCurrentPosition(app.showPosition);
  },

  runFirst: function() {
    let searchBar = document.querySelector("#search-bar");
    let currentLocation = document.querySelector("#current-location");

    searchBar.addEventListener("submit", app.searchCity);
    currentLocation.addEventListener("click", app.findCurrentLocation);

    app.updateCurrentTime();
  }
};

app.runFirst();

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
  <div class="card mb-3">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img
                  src="http://openweathermap.org/img/wn/${
                    forecast.weather[0].icon
                  }@2x.png"
                  class="card-img"
                  alt="cloud and sun image"
                  id="icon1"
                />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${app.formatHours(
                    forecast.dt * 1000
                  )}</h5>

                  <p class="card-text">
                    <i class="far fa-arrow-alt-circle-up">${Math.round(
                      forecast.main.temp_max
                    )}º</i>
                    <i class="far fa-arrow-alt-circle-down">${Math.round(
                      forecast.main.temp_min
                    )}º</i><br />
                    
                  </p>
                </div>
              </div>
            </div>
          </div>`;
  }
}
