import { getCoordinates, getCurrentWeather } from "./apifunctions";
import { kelvinToCelsius, convertDay } from "./helpFunctions";
const getDataFromForm = () => {
    const input = document.querySelector(".search-bar");
    const locationName = input.value;

    if (locationName){
        return locationName.trim().replace(/\s+/g, '+');
    }

    return "";
}



const renderWeatherData = (weatherData) => {
    //Selecting DOM
    console.log(weatherData);
    const precip = document.querySelector("#precip");
    const humid = document.querySelector("#humid");
    const wind = document.querySelector("#wind");
    const temp = document.querySelector(".weather-temp");
    const time = document.querySelector("#time");
    const description = document.querySelector("#description");
    const location = document.querySelector(".weather-location span");
    const currentTime = new Date();
    
    if (weatherData.rain === null){
        precip.textContent = "0 mm";
    }else{
        //precip.textContent = weatherData.rain.1h + " mm";
    }
    humid.textContent = weatherData.main.humidity + "%";
    wind.textContent = weatherData.wind.speed + "m/s";
    temp.textContent = kelvinToCelsius(weatherData.main.temp) + " " +String.fromCharCode(176) + "C";
    description.textContent = weatherData.weather[0].main;
    location.textContent = weatherData.name;
    time.textContent = convertDay(currentTime.getDay()) + " " + currentTime.getHours() + ":" + currentTime.getMinutes();
}



const initialRender = () => {
    const addWeatherBtn = document.querySelector("#addWeatherButton");
    addWeatherBtn.addEventListener("click", async () => {
    const locationName = getDataFromForm();
    const coordinates = await getCoordinates(locationName);
    const weatherData = await getCurrentWeather(coordinates);
    renderWeatherData(weatherData);
})
}


export {initialRender}
