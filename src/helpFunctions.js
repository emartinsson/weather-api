//Converts weeknumber to weekday (0 is sunday, 6 is saturday)
const getCurrentDayAndTime = () => {
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let currentTime = new Date();
    return `${days[currentTime.getDay()]} ${currentTime.getHours()}:${currentTime.getMinutes()}`
}


//Returns celsius from fahrenheit, rounded up
const kelvinToCelsius = (temp) => {
    return (temp-273.15);
}


const celsiusToFahrenheit = (temp) => {
    return (temp*9/5)+32;
}

const fahrenheitToCelsius = (temp) => {
    return (temp-32)*5/9;
}

export {getCurrentDayAndTime, kelvinToCelsius, celsiusToFahrenheit, fahrenheitToCelsius}