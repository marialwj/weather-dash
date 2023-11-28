var cityInput = document.querySelector(".city-input");
var searchbutton = document.querySelector(".search-btn");



var getCityCoordinates = () => {
    var cityName = cityInput.value.trim(); // Provides entered city name 
    if(!cityName) return; 

    console.log(cityName)
}
searchbutton.addEventListener("click", getCityCoordinates);