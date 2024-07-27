const weatherForm = document.querySelector('.weatherForm');
const locationInput = document.querySelector('.locationInput');
const card = document.querySelector('.card');

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const location = locationInput.value;

    if (location) {
        try {
            const coordinates = await getCoordinates(location);
            const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude);
            displayWeatherData(weatherData);
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
        const { latitude, longitude } = data.results[0];
        return { latitude, longitude };
    } else {
        throw new Error("Location not found");
    }
}

async function getWeatherData(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&wind_speed_unit=ms`);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    console.log(data);
    return data;
}

function displayWeatherData(data) {
    Array.from(card.children).forEach(child => {
        if (child !== weatherForm) {
            child.remove();
        }
    });
    card.style.display = 'flex';
    const temperatureData = data.hourly.temperature_2m;
    const temperatureDisplay = document.createElement('p');
    temperatureDisplay.textContent = `Temperature: ${temperatureData[0]}°C`;
    card.appendChild(temperatureDisplay);
    
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