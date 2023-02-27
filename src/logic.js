//Storing coordinate.
const Coordinate = (lat, long) => {
    const getLatitude = () => lat;
    const getLongitude = () => long;
    return {getLatitude, getLongitude}
}





export {Coordinate}

