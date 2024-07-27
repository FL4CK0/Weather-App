const weatherForm = document.querySelector('.weatherForm');
const locationInput = document.querySelector('.locationInput');
const card = document.querySelector('.card');


weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const location = locationInput.value;

    if (location) {
        try {
            const {coordinates, cityName} = await getCoordinates(location);
            const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude);
            displayWeatherData(weatherData, cityName);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a location");
    }
});

async function getCoordinates(location) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        const { latitude, longitude, name } = data.results[0];
        return { 
            coordinates: {latitude, longitude },
            cityName:  name
        };
    } else {
        throw new Error("Location not found");
    }
}

async function getWeatherData(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=ms`);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    console.log(data);
    return data;
}

function displayWeatherData(data, location) { 
    Array.from(card.children).forEach(child => {
        if (child !== weatherForm) {
            child.remove();
        }
    });


    const locationDisplay = document.createElement('h1');
    locationDisplay.textContent = ` ${location}`;
    card.appendChild(locationDisplay);

   const {
        current: {
        temperature_2m,
        wind_speed_10m,
        weather_code}} = data;
    
    
    const tempDisplay = document.createElement('p');
    const windDisplay = document.createElement('p');
    const weatherDisplay = document.createElement('p');
    const emojiDisplay = document.createElement('p');


    tempDisplay.textContent = ` ${temperature_2m}°C`;
    windDisplay.textContent = ` ${wind_speed_10m} m/s`;

    const weatherDesc= getWeatherDescription(weather_code);

    weatherDisplay.textContent = ` ${weatherDesc}`;

    locationDisplay.classList.add('locationDisplay');
    tempDisplay.classList.add('tempDisplay');
    windDisplay.classList.add('windDisplay');
    weatherDisplay.classList.add('weatherDisplay');
    emojiDisplay.classList.add('emojiDisplay');

    card.appendChild(tempDisplay);
    card.appendChild(windDisplay);
    card.appendChild(weatherDisplay);   

    
    
}
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Slight or moderate thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown weather condition';
}

function displayError(message) {
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');

    Array.from(card.children).forEach(child => {
        if (child !== weatherForm) {
            child.remove();
        }
    });
    card.style.display = 'flex';

    card.appendChild(errorDisplay);
}