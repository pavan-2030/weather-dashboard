let currentUnit = 'celsius'; // 'celsius' or 'fahrenheit'
let currentWeatherData = null;
let isDarkMode = false;

// Weather API Configuration
// TODO: Replace with your actual API key from OpenWeatherMap or similar service
const API_KEY = '787f36db3d393853f09f7171686e26d3';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Sample data for demonstration (remove when implementing real API)
/*const sampleWeatherData = {
    'new york': {
        city: 'New York',
        country: 'US',
        temperature: 22,
        description: 'Partly Cloudy',
        icon: '⛅',
        humidity: 65,
        windSpeed: 12,
        pressure: 1013,
        forecast: [
            { day: 'Today', icon: '⛅', high: 24, low: 18, desc: 'Partly Cloudy' },
            { day: 'Tomorrow', icon: '🌧️', high: 19, low: 15, desc: 'Light Rain' },
            { day: 'Wednesday', icon: '☀️', high: 26, low: 20, desc: 'Sunny' },
            { day: 'Thursday', icon: '🌤️', high: 23, low: 17, desc: 'Mostly Sunny' },
            { day: 'Friday', icon: '⛈️', high: 21, low: 16, desc: 'Thunderstorm' }
        ]
    },
    'london': {
        city: 'London',
        country: 'UK',
        temperature: 15,
        description: 'Rainy',
        icon: '🌧️',
        humidity: 78,
        windSpeed: 8,
        pressure: 1008,
        forecast: [
            { day: 'Today', icon: '🌧️', high: 17, low: 12, desc: 'Rainy' },
            { day: 'Tomorrow', icon: '⛅', high: 19, low: 14, desc: 'Partly Cloudy' },
            { day: 'Wednesday', icon: '☁️', high: 16, low: 11, desc: 'Cloudy' },
            { day: 'Thursday', icon: '🌧️', high: 18, low: 13, desc: 'Light Rain' },
            { day: 'Friday', icon: '🌤️', high: 20, low: 15, desc: 'Mostly Sunny' }
        ]
    }
};*/

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const tempToggle = document.getElementById('tempToggle');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const mainWeather = document.getElementById('mainWeather');
const forecastSection = document.getElementById('forecastSection');

// Weather Display Elements
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const tempUnit = document.getElementById('tempUnit');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecastContainer');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', handleEnterKey);
// themeToggle.addEventListener('click', toggleTheme);
tempToggle.addEventListener('click', toggleTemperatureUnit);

// Initialize Application
function initializeApp() {
    console.log('Weather Dashboard initialized');
    loadDefaultWeather();
    setCurrentDate();
}

// Set current date display
function setCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Add date element if it doesn't exist
    const dateElement = document.createElement('div');
    dateElement.className = 'current-date';
    dateElement.textContent = dateString;
    dateElement.style.color = '#636e72';
    dateElement.style.marginBottom = '10px';
    
    const weatherInfo = document.querySelector('.weather-info');
    const cityNameElement = document.getElementById('cityName');
    weatherInfo.insertBefore(dateElement, cityNameElement.nextSibling);
}

// Load default weather (New York)
function loadDefaultWeather() {
    showLoading();
    // Simulate API delay
    setTimeout(() => {
        displayWeatherData(sampleWeatherData['new york']);
        hideLoading();
    }, 3000);
}

// Handle search button click
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        searchWeather(city);
    } else {
        showError('Please enter a city name');
    }
}

// Handle Enter key press in search input
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

// Main weather search function
async function searchWeather(city) {
    showLoading();
    hideError();

    try {
        // Call the real API function
        const weatherData = await fetchWeatherFromAPI(city);

        displayWeatherData(weatherData);
        hideLoading();
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Failed to fetch weather data. Please try again.');
        hideLoading();
    }
}

// TODO: Implement actual API call function
async function fetchWeatherFromAPI(city) {

    // Example implementation with OpenWeatherMap API:
    
    try {
        // Current weather API call
        const currentResponse = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        if (!currentResponse.ok) {
            throw new Error('City not found');
        }
        
        const currentData = await currentResponse.json();
        
        // 5-day forecast API call
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        const forecastData = await forecastResponse.json();
        
        // Process and return formatted data
        return processAPIData(currentData, forecastData);
        
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }

}

// TODO: Process API response data
function processAPIData(currentData, forecastData) {

    // Example of processing OpenWeatherMap API response:
    
    return {
        city: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        icon: getWeatherIcon(currentData.weather[0].main),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        pressure: currentData.main.pressure,
        forecast: processForecastData(forecastData.list)
    };

}

// TODO: Process 5-day forecast data
function processForecastData(forecastList) {

    // Example of processing forecast data:
    
    const dailyForecasts = [];
    const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
    
    for (let i = 0; i < 5; i++) {
        const dayData = forecastList[i * 8]; // Every 8th item (24 hours)
        dailyForecasts.push({
            day: days[i],
            icon: getWeatherIcon(dayData.weather[0].main),
            high: Math.round(dayData.main.temp_max),
            low: Math.round(dayData.main.temp_min),
            desc: dayData.weather[0].description
        });
    }
    
    return dailyForecasts;

}

// Convert weather condition to emoji icon
function getWeatherIcon(condition, description = '', time = 'day') {
    const lowerCondition = condition.toLowerCase();
    const lowerDescription = description.toLowerCase();
    
    // Time-based icons (day/night variations)
    const isNight = time === 'night' || new Date().getHours() > 18 || new Date().getHours() < 6;
    
    // Detailed weather condition mapping
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
        return isNight ? '🌙' : '☀️';
    }
    
    if (lowerCondition.includes('cloud')) {
        if (lowerDescription.includes('few') || lowerDescription.includes('scattered')) {
            return isNight ? '⭐' : '🌤️';
        }
        if (lowerDescription.includes('broken') || lowerDescription.includes('overcast')) {
            return '☁️';
        }
        return '⛅'; // partly cloudy
    }
    
    if (lowerCondition.includes('rain')) {
        if (lowerDescription.includes('heavy') || lowerDescription.includes('intense')) {
            return '🌧️';
        }
        if (lowerDescription.includes('light') || lowerDescription.includes('drizzle')) {
            return '🌦️';
        }
        if (lowerDescription.includes('shower')) {
            return '🌧️';
        }
        return '🌧️'; // default rain
    }
    
    if (lowerCondition.includes('drizzle')) {
        return '🌦️';
    }
    
    if (lowerCondition.includes('thunderstorm') || lowerCondition.includes('storm')) {
        if (lowerDescription.includes('heavy')) {
            return '⛈️';
        }
        return '🌩️';
    }
    
    if (lowerCondition.includes('snow')) {
        if (lowerDescription.includes('heavy') || lowerDescription.includes('blizzard')) {
            return '🌨️';
        }
        if (lowerDescription.includes('light')) {
            return '🌨️';
        }
        return '❄️';
    }
    
    if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) {
        return '🌫️';
    }
    
    if (lowerCondition.includes('haze') || lowerCondition.includes('smoke')) {
        return '😶‍🌫️';
    }
    
    if (lowerCondition.includes('dust') || lowerCondition.includes('sand')) {
        return '🌪️';
    }
    
    if (lowerCondition.includes('tornado')) {
        return '🌪️';
    }
    
    if (lowerCondition.includes('hurricane') || lowerCondition.includes('typhoon')) {
        return '🌀';
    }
    
    // Default fallback
    return '⛅';
}

// Display weather data on the page
function displayWeatherData(data) {
    currentWeatherData = data;
    
    // Update current weather display
    cityName.textContent = `${data.city}, ${data.country}`;
    updateTemperatureDisplay(data.temperature);
    weatherDescription.textContent = data.description;
    weatherIcon.textContent = data.icon;
    
    // Add appropriate animation class to weather icon
    weatherIcon.className = 'weather-icon ' + getIconAnimationClass(data.icon);
    
    // Update weather details
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} km/h`;
    pressure.textContent = `${data.pressure} hPa`;
    
    // Update forecast
    displayForecast(data.forecast);
    
    // Update background based on weather
    updateBackgroundTheme(data.description);
    
    // Show weather sections with animations
    showWeatherSections();
    
    // Clear search input
    cityInput.value = '';
}

// Update temperature display with current unit
function updateTemperatureDisplay(temp) {
    const displayTemp = currentUnit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp;
    temperature.textContent = Math.round(displayTemp);
    tempUnit.textContent = currentUnit === 'fahrenheit' ? '°F' : '°C';
}

// Display 5-day forecast
function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    
    forecastData.forEach((day, index) => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card slide-in';
        forecastCard.style.animationDelay = `${index * 0.1}s`;
        
        const highTemp = currentUnit === 'fahrenheit' ? 
            Math.round(celsiusToFahrenheit(day.high)) : day.high;
        const lowTemp = currentUnit === 'fahrenheit' ? 
            Math.round(celsiusToFahrenheit(day.low)) : day.low;
        const unit = currentUnit === 'fahrenheit' ? '°F' : '°C';
        
        const dynamicIcon = getWeatherIcon(day.condition || day.desc, day.desc);

        forecastCard.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-icon">${dynamicIcon}</div>
            <div class="forecast-temps">
                <span class="forecast-high">${highTemp}${unit}</span>
                <span class="forecast-low">${lowTemp}${unit}</span>
            </div>
            <div class="forecast-desc">${day.desc}</div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Get animation class based on weather icon
function getIconAnimationClass(icon) {
    const animationMap = {
        '☀️': 'sun',
        '☁️': 'cloud',
        '⛅': 'cloud',
        '🌧️': 'rain',
        '🌦️': 'rain',
        '⛈️': 'thunder',
        '❄️': 'snow',
        '🌫️': 'cloud'
    };
    return animationMap[icon] || '';
}

// Update background theme based on weather condition
function updateBackgroundTheme(description) {
    const body = document.body;
    
    // Remove existing weather classes
    body.classList.remove('sunny', 'cloudy', 'rainy', 'default');
    
    // Add appropriate class based on weather
    if (description.toLowerCase().includes('sun') || description.toLowerCase().includes('clear')) {
        body.classList.add('sunny');
    } else if (description.toLowerCase().includes('rain') || description.toLowerCase().includes('storm')) {
        body.classList.add('rainy');
    } else if (description.toLowerCase().includes('cloud')) {
        body.classList.add('cloudy');
    } else {
        body.classList.add('default');
    }
}

// Temperature conversion functions
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

// Toggle temperature unit
function toggleTemperatureUnit() {
    tempToggle.classList.add('flipping');
    
    setTimeout(() => {
        currentUnit = currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        
        if (currentWeatherData) {
            updateTemperatureDisplay(currentWeatherData.temperature);
            displayForecast(currentWeatherData.forecast);
        }
        
        // Update toggle button text
        tempToggle.textContent = currentUnit === 'celsius' ? '°F' : '°C';
        
        tempToggle.classList.remove('flipping');
    }, 300);
}

// Theme toggle functionality
function toggleTheme() {
    // isDarkMode = !isDarkMode;
    // document.body.classList.toggle('dark-mode');
    
    // const themeIcon = document.querySelector('.theme-icon');
    // themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save theme preference
    localStorage.setItem('darkMode', isDarkMode);
}

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        toggleTheme();
    }
}

// Loading state functions
function showLoading() {
    loading.style.display = 'block';
    mainWeather.style.display = 'none';
    forecastSection.style.display = 'none';
    hideError();
}

function hideLoading() {
    loading.style.display = 'none';
}

// Error handling functions
function showError(message) {
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.classList.add('shake');
    
    setTimeout(() => {
        errorMessage.classList.remove('shake');
    }, 500);
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Show weather sections with animations
function showWeatherSections() {
    mainWeather.style.display = 'block';
    forecastSection.style.display = 'block';
    
    // Add entrance animations
    const weatherCard = document.querySelector('.weather-card');
    const forecastContainerEl = document.querySelector('.forecast-container');
    
    weatherCard.classList.add('animate-entrance');
    forecastContainerEl.classList.add('animate-entrance');
    
    // Remove animation classes after animation completes
    setTimeout(() => {
        weatherCard.classList.remove('animate-entrance');
        forecastContainerEl.classList.remove('animate-entrance');
    }, 1000);
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Format wind speed based on unit preference
function formatWindSpeed(speed) {
    // speed is in km/h by default
    return `${speed} km/h`;
}

// Geolocation-based weather (bonus feature)
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoordinates(lat, lon);
            },
            (error) => {
                console.error('Geolocation error:', error);
                showError('Unable to get your location');
            }
        );
    } else {
        showError('Geolocation is not supported by this browser');
    }
}

// TODO: Fetch weather by coordinates
async function fetchWeatherByCoordinates(lat, lon) {
    /*
    // Example implementation:
    
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        const processedData = processAPIData(data, forecastData);
        displayWeatherData(processedData);
        
    } catch (error) {
        showError('Failed to fetch weather for your location');
    }
    */
}

// Advanced search with suggestions (bonus feature)
function setupSearchSuggestions() {
    const suggestions = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Mumbai', 'Cairo'];
    
    cityInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length > 2) {
            const matches = suggestions.filter(city => 
                city.toLowerCase().includes(value)
            );
            // TODO: Display suggestions dropdown
        }
    });
}

// Weather data validation
function validateWeatherData(data) {
    const required = ['city', 'country', 'temperature', 'description', 'humidity', 'windSpeed', 'pressure'];
    return required.every(field => data.hasOwnProperty(field) && data[field] !== null);
}

// Local storage for favorite cities (bonus feature)
function saveFavoriteCity(cityData) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
    const cityKey = `${cityData.city}, ${cityData.country}`;
    
    if (!favorites.includes(cityKey)) {
        favorites.push(cityKey);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }
}

function loadFavoriteCities() {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
    // TODO: Display favorite cities in UI
    return favorites;
}

// Weather alerts handling (bonus feature)
function checkWeatherAlerts(data) {
    const alerts = [];
    
    if (data.temperature > 35) {
        alerts.push('⚠️ High temperature alert');
    }
    if (data.temperature < 0) {
        alerts.push('🧊 Freezing temperature alert');
    }
    if (data.windSpeed > 50) {
        alerts.push('💨 High wind speed alert');
    }
    
    displayAlerts(alerts);
}

function displayAlerts(alerts) {
    // TODO: Create and display alert notifications
    alerts.forEach(alert => {
        console.log('Weather Alert:', alert);
    });
}

// Data export functionality (bonus feature)
function exportWeatherData() {
    if (currentWeatherData) {
        const dataToExport = {
            exportDate: new Date().toISOString(),
            weatherData: currentWeatherData,
            unit: currentUnit
        };
        
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `weather-data-${currentWeatherData.city}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Responsive image handling for weather icons
function updateWeatherIcon(iconCode) {
    // TODO: If using actual weather API, implement icon URL handling
    /*
    // Example for OpenWeatherMap icons:
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.innerHTML = `<img src="${iconUrl}" alt="Weather Icon" style="width: 120px; height: 120px;">`;
    */
}

// Performance optimization: Debounce search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to search function
// const debouncedSearch = debounce((city) => {
//     if (city.length > 2) {
//         searchWeather(city);
//     }
// }, 500);

// Auto-complete functionality
cityInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value.trim());
});

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
});

// API Error handling with retry mechanism
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// Network status handling
window.addEventListener('online', () => {
    console.log('Network connection restored');
    hideError();
});

window.addEventListener('offline', () => {
    showError('No internet connection. Please check your network.');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        cityInput.focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        cityInput.blur();
        cityInput.value = '';
    }
});

// Touch gestures for mobile (bonus feature)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    const swipeThreshold = 100;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - could switch to previous city or toggle unit
            toggleTemperatureUnit();
        } else {
            // Swipe left - could switch to next city or toggle theme
            toggleTheme();
        }
    }
}

// Console logging for debugging
function logWeatherData(data) {
    console.group('Weather Data Loaded');
    console.log('City:', data.city);
    console.log('Temperature:', data.temperature + '°C');
    console.log('Condition:', data.description);
    console.log('Humidity:', data.humidity + '%');
    console.log('Wind Speed:', data.windSpeed + ' km/h');
    console.groupEnd();
}

// Print current weather information
function printWeatherReport() {
    if (currentWeatherData) {
        window.print();
    } else {
        showError('No weather data to print');
    }
}

/* 
TODO: Additional API Integration Notes

1. Sign up for a weather API service:
   - OpenWeatherMap (free tier available)
   - WeatherAPI
   - AccuWeather API

2. Replace the API_KEY variable with your actual API key

3. Implement the fetchWeatherFromAPI function using your chosen API

4. Update the processAPIData function to match your API's response format

5. Handle API rate limits and error responses appropriately

6. Consider implementing caching to reduce API calls

7. Add proper error handling for different HTTP status codes

8. Implement retry logic for failed API requests

Example API endpoints for OpenWeatherMap:
- Current weather: https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
- 5-day forecast: https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric
*/
    