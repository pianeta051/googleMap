const DateTime = luxon.DateTime;
const map = L.map('mapa').setView([33.42, -0.09], 15);
const startNavigationButton = document.getElementById('comenzar-ruta');
const endNavigationButton = document.getElementById('finalizar-ruta');
const midPointButton = document.getElementById('punto-intermedio');
const divDistance = document.getElementById('distancia');
const divTime = document.getElementById('tiempo');
const divVelocidad = document.getElementById('velocidad');
const places = [];
let longitude = 0;
let latitude = 0;
let initialTime = 0;
let distance = 0;
let finalTime = 0;
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    id: 'mapbox/streets-v11',
}).addTo(map);
startNavigationButton.classList.add('visible');


const startRoute = ({ coords, timestamp }) => {
    startNavigationButton.classList.remove('visible');
    endNavigationButton.classList.add('visible');
    midPointButton.classList.add('visible');
    setPoint(coords, timestamp);
    initialTime = timestamp;
};

const midPoint = ({ coords, timestamp }) => {
    setPoint(coords, timestamp);
};

const endRoute = ({ coords, timestamp }) => {
    setPoint(coords, timestamp);
    displayDistance();
    drawLine();
    finalTime = timestamp;
    displayAverageSpeed();
};

startNavigationButton.addEventListener('click', () => getPosition(startRoute));
endNavigationButton.addEventListener('click', () => getPosition(endRoute));
midPointButton.addEventListener('click', () => getPosition(midPoint));


/* Helper functions */

const degreesToRadians = (degrees) => {
    return degrees * Math.PI / 180;
};

const displayDistance = () => {

    for (let i = 1; i < places.length; i++) {
        distance = distance + distanceInKmBetweenEarthCoordinates(
            places[i - 1][0],
            places[i - 1][1],
            places[i][0],
            places[i][1]
        );
    }

    divDistance.classList.add('visible');
    divDistance.innerHTML = `${distance} Kms`;
};

const displayAverageSpeed = () => {
    //v=d/t  m/s

    const startDate = new Date(initialTime);
    const finalDate = new Date(finalTime);
    var end = DateTime.fromISO(finalDate);
    var start = DateTime.fromISO(startDate);

    var diffInMonths = end.diff(start, 'months');
    diffInMonths.as('days');

    console.log(finalTime);
    console.log(initialTime);
    console.log(diffInMonths.as('days'));
    //const speed = 
};

const distanceInKmBetweenEarthCoordinates = (lat1, lon1, lat2, lon2) => {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

const drawLine = () => {
    const polyline = L.polyline(places, { color: 'red' }).addTo(map);
    map.fitBounds(polyline.getBounds());
};

const getPosition = (callback) => navigator.geolocation.getCurrentPosition(callback);

const setPoint = (coords, timestamp) => {
    const { latitude, longitude } = coords;
    places.push([latitude, longitude]);
    map.setView([latitude, longitude], 95);
    L.marker([latitude, longitude]).addTo(map);
    const date = new Date(timestamp);
    console.log(`Ha pasado por la posicion ${latitude +' '+ longitude} la fecha: ${date}`);
};