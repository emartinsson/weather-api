import './style.css';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { initialRender, renderWeatherData, renderGif, getDataFromForm, toggleWeatherFunctions} from './view';
import { fetchCoordinates, fetchCurrentWeather, fetchGif} from './apifunctions';
import { Coordinate } from './logic';


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

        //Get gif name
        const gifName  = getGifName(weatherData);

        //Fetch gif from giphy
        const gifResponse = await fetchGif(gifName);

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

//Retrieving location name form and calling getweather
const data = async () => {
    const locationName = getDataFromForm();
    if (locationName === ""){
        return;
    }
    await getWeather(locationName)
}


const startFunctionality =  (async() =>{
    initialRender(data);
    const startLocation = "Luleå";
    await getWeather(startLocation)
})();




