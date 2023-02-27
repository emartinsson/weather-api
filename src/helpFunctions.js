//Converts weeknumber to weekday (0 is sunday, 6 is saturday)
const convertDay = (number) => {
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    if (number < days.length){
        return days[number];
    }
    return "";
}


//Returns celsius from fahrenheit, rounded up
const kelvinToCelsius = (temp) => {
    return Math.round((temp-273.15));
}


export {convertDay, kelvinToCelsius}