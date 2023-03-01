import { fetchCoordinates, fetchCurrentWeather, HttpError, fetchGif} from "./apifunctions";
import { kelvinToCelsius, getCurrentDayAndTime, celsiusToFahrenheit } from "./helpFunctions";
import { Coordinate } from "./logic";
import { getCountry } from "./countries";

//BRYT UT CONTROLLER FRÅN DENNA...


//Retrieves data from form
const getDataFromForm = () => {
    const input = document.querySelector(".search-bar");
    const locationName = input.value;

    //Replaces spaces between words with "+" to enable API searches
    if (locationName){
        return locationName.trim().replace(/\s+/g, '+');
    }

    return "";
}


const renderGif = async (weatherData) => {
    const gifDivImg = document.querySelector(".gif-div img");
    try{
        const gifName  = getGifName(weatherData);
        const gifResponse = await fetchGif(gifName);
        gifDivImg.src = gifResponse.data.images.original.url;
    }
    catch(error){
        console.error(error);
    }
}

//Renders weather data
const renderWeatherData = (weatherData) => {
    const location = `${weatherData.name}, ${getCountry(weatherData.sys.country)}`
    const humidity = weatherData.main.humidity;
    const precipitation = getPrecipitation(weatherData);
    const wind = Math.round(weatherData.wind.speed);
    const tempC = Math.round(weatherData.main.temp);
    const tempF = Math.round(celsiusToFahrenheit(weatherData.main.temp));
    const description = weatherData.weather[0].main;
    const currentTime = getCurrentDayAndTime();
    const icon = weatherData.weather[0].icon;
    const imgSrc = "https://openweathermap.org/img/w/";
    const imgFormat = ".png";


    document.querySelector("#precip").innerText = `${precipitation} mm`;
    document.querySelector("#humid").innerText = `${humidity}%`;
    document.querySelector("#wind").innerText = `${wind} m/s`;
    document.querySelector(".temp-c").innerText = `${tempC}`;
    document.querySelector(".temp-f").innerText = `${tempF}`;
    document.querySelector("#time").innerText = currentTime;
    document.querySelector("#description").innerText = description;
    document.querySelector(".weather-location span").innerText = location;
    document.getElementById("weather-logo").src = imgSrc + icon + imgFormat;
}

//Retrieve precipitation from rain or snow from weatherdata json
const getPrecipitation = (weatherData) => {
    let precipitation = 0;
    if (weatherData.hasOwnProperty("rain")){
        precipitation = weatherData.rain["1h"];
    } else if (weatherData.hasOwnProperty("snow")){
        precipitation = weatherData.snow["1h"];
    }
    return precipitation;
}

//Help function to display/remove loading and error text
const toggleWeatherFunctions = (() => {
    const weatherLocation = document.querySelector(".weather-location");
    const weatherMain = document.querySelector(".weather-main");
    const loadingClassName = "loading";
    const searchError = document.querySelector(".search-error p");

    const loadingWeather = () => {
        weatherLocation.classList.add(loadingClassName);
        weatherMain.classList.add(loadingClassName);
    }

    const removeLoadingWeather = () => {
        weatherLocation.classList.remove(loadingClassName);
        weatherMain.classList.remove(loadingClassName);
    }

    const displayError = () => {
        searchError.innerText = "Could not find location";
    }

    const clearErrorMsg =  ()  => {
        searchError.innerText = "";
    }

    return{loadingWeather,removeLoadingWeather, displayError, clearErrorMsg}
})();


//Get gif name from weatherdata code
const getGifName = (weatherData) => {
    const weatherCode = weatherData.weather[0].id;
    let gifName = "weather";
    if (weatherCode < 300) gifName = "Thunderstorm";
    else if (weatherCode < 400 ) gifName = "Drizzle";
    else if (weatherCode < 600 ) gifName = "Rain";
    else if (weatherCode < 700 ) gifName = "Snow";
    else if (weatherCode < 800 ) gifName = "Weather";
    else if (weatherCode === 800) gifName = "Sunny";
    else if (weatherCode < 900) gifName = "Cloudy"
    return gifName
}


//Logic of getting weather.
const getWeather = async (locationName) => {
    //Add loading text
    toggleWeatherFunctions.loadingWeather();
    try{
        //Fetch coordinate from location name using geolocation api
        const geodata = await fetchCoordinates(locationName);
        //Use built in coordinate to store lat and longitude
        let coordinate = Coordinate(geodata[0].lat, geodata[0].lon);
        //Fetch weatherdata from coordinates using openweather api
        const weatherData = await fetchCurrentWeather(coordinate);

        //Render retrieved weather data
        renderWeatherData(weatherData); 
        renderGif(weatherData)

        //Clear error msg if there is one
        toggleWeatherFunctions.clearErrorMsg();
    } catch(error) {
        if (error instanceof HttpError && error.response.status == 404){
            alert("Error 404");
        }else{
            //Display error text if error occured
            toggleWeatherFunctions.displayError();
        }
    }
    //Remove loading text
    toggleWeatherFunctions.removeLoadingWeather();
}

//Retrieving locantion name form and calling getweather
const data = async () => {
    const locationName = getDataFromForm();
    if (locationName === ""){
        return;
    }
    await getWeather(locationName)
}

//Initial weather location that isu sed
const startWeather = async () => {
    const startLocation = "Luleå";
    await getWeather(startLocation);
}


//Function to toggle display state for fahrenheit / celsius
const temperatureSwitcher = (() => {
    const celsius = document.querySelector("#celsius");
    const fahrenheit = document.querySelector("#fahrenheit");
    const tempC = document.querySelector(".temp-c");
    const tempF = document.querySelector(".temp-f");
    let isCelsius = true;

    const toggleTemperature = (e) => {
        if (e.target.id === "fahrenheit" && isCelsius === true){
            tempC.style.display = "none";
            tempF.style.display = "inline";
            celsius.classList.add("gray-text");
            fahrenheit.classList.remove("gray-text");
            isCelsius = false;
        }
        if (e.target.id === "celsius" && isCelsius === false){
            tempF.style.display = "none";
            tempC.style.display = "inline";
            celsius.classList.remove("gray-text");
            fahrenheit.classList.add("gray-text");
            isCelsius = true;
        }
    }

    return{toggleTemperature}
})();



//Eventlistener
const initialRender = async() => {
    const addWeatherBtn = document.querySelector("#addWeatherButton");
    const input = document.querySelector(".search-bar");
    const tempDiv = document.querySelector(".temp");

    addWeatherBtn.addEventListener("click", async () => {
        await data();
    })
    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter"){
            await data();
        }
    });

    tempDiv.addEventListener("click", (e) => {
        temperatureSwitcher.toggleTemperature(e);
    })
    

    await startWeather();
}




export {initialRender}
