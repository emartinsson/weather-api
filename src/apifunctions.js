const WEATHER_API_KEY = "4cc8824003df3e4e77c9849cabb23c5b";
const GIPHY_API_KEY = "tPctTVW9LQGZhKCy9fHhM1kJI4IA24WB";

const fetchGif = async (gifName) => {
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${gifName}`;
    let response = await fetch(url);

    if (response.status == 200){
        return response.json();
    }else{
        throw new HttpError(response);
    }
}


//Httperror class.
class HttpError extends Error {
    constructor(response) {
      super(`${response.status} for ${response.url}`);
      this.name = 'HttpError';
      this.response = response;
    }
  }

//Retrieves coordinates from openweatherapi based on the locationinput (City/ post code)
const fetchCoordinates = async (locationInput) => {
    let location = locationInput.trim();
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${WEATHER_API_KEY}`;
    
    let response = await fetch(url);
    if (response.status == 200){
        return response.json();
    }else{
        throw new HttpError(response);
    }
}

//Retrieves current weather information from openweatherapi based on coordinates. Standard unit is metric.
const fetchCurrentWeather = async (coordinate) => {
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.long}&units=${unit}&appid=${WEATHER_API_KEY}`;
    
    let response = await fetch(url);
    if (response.status == 200){
        return response.json();
    }else{
        throw new HttpError(response);
    }

}


export{fetchCoordinates, fetchCurrentWeather, HttpError, fetchGif}