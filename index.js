var cityInput = document.querySelector(".city-input");
var searchButton = document.querySelector(".search-btn");
var locationButton = document.querySelector(".location-btn");
var currentWeatherDiv = document.querySelector(".current-weather");
var weatherCardsDiv = document.querySelector(".weather-cards");
var savedCities = JSON.parse(localStorage.getItem("savedCities")) || []
var savedCitieselms = document.querySelector(".saved-city")

var API_KEY = "23619bc95d00af5e6dcf21d2b1ebdf46"; 

var createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${weatherItem.main.temp}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${weatherItem.main.temp}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

var getWeatherDetails = (cityName, latitude, longitude) => {
    var WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        var uniqueForecastDays = [];
        var fiveDaysForecast = data.list.filter(forecast => {
            var forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            var html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
    
}

var getCityCoordinates = (cityName) => {
    var API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        var { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

function getHistory(){
    var listContainer = document.querySelector('#history');
    var ulElement = document.createElement('ul');
    listContainer.innerHTML = '' 
    var cities = JSON.parse(localStorage.getItem("savedCities")) || []
    cities = cities.reverse()
    console.log (cities)
    if (cities.length){
        for(var i = 0; i < cities.length && i< 5; i++){
            if (listContainer.childElementCount>5){
                ulElement.children[0].remove()
            }
            var liElement = document.createElement('li');
            liElement.setAttribute("data-city", cities[i].citySearchTerm)
            liElement.setAttribute("class", "saved-city")
            liElement.textContent = cities[i].citySearchTerm;
            ulElement.appendChild(liElement);
            liElement.addEventListener('click', function(){
                cityName = liElement.textContent
                weatherURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_KEY + "&units=imperial";
                getCityCoordinates(cityName)
            })
        };
        listContainer.appendChild(ulElement);
        console.log (ulElement)
    }
    savedCitieselms = document.querySelectorAll(".saved-city")
    for(var i=0; i<savedCitieselms.length;i++) {
        savedCitieselms[i].addEventListener("click", function(event){
            console.log (event.target)
            getCityCoordinates(event.target.getAttribute("data-city"))
        })
    }  
}

searchButton.addEventListener("click", function() {
    var cityName = cityInput.value.trim(); 
    if (cityName === "") return;
    getCityCoordinates(cityName)
    var cityObject = {
        "citySearchTerm" : cityName
    }


savedCities.push(cityObject)
localStorage.setItem("savedCities", JSON.stringify(savedCities))
getHistory()
});

window.addEventListener("load",getHistory)
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
