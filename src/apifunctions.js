import { Coordinate } from "./logic";
const WEATHER_API_KEY = "4cc8824003df3e4e77c9849cabb23c5b";
const ENDPOINT = "api.openweathermap.org";



//Retrieves coordinates from openweatherapi based on the locationinput (City/ post code)
const getCoordinates = async (locationInput) => {
    let location = locationInput.trim();
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&appid=${WEATHER_API_KEY}`;
    try{
        let response = await fetch(url);
        let json = await response.json();
        let coordinate = Coordinate(json[0].lat, json[0].lon);
        return coordinate;
    }catch (error){
        console.log(error);
    }    
}

//Retrieves current weather information from openweatherapi based on coordinates
const getCurrentWeather = async (coordinate) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.getLatitude()}&lon=${coordinate.getLongitude()}&appid=${WEATHER_API_KEY}`;

    try{
        let response = await fetch(url);
        let json = await response.json();
        return json;
    }catch (error){
        console.log(error);
    }
}


export{getCoordinates, getCurrentWeather}