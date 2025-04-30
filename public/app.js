const patterns = ['pattern-circles', 'pattern-triangles', 'pattern-stripes'];
const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
document.getElementById('background-pattern').classList.add(randomPattern);

navigator.geolocation.getCurrentPosition(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const apiUrl = `/api/weather?lat=${lat}&lon=${lon}`; // Request your backend
  const response = await fetch(apiUrl);              // Backend fetches weather data
  const data = await response.json();                // Frontend receives data from backend

  const iconMap = {
    'clear': '☀️',
    'clouds': '☁️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️'
  };

  const condition = data.weather[0].main.toLowerCase();
  const icon = iconMap[condition] || '🌈';

  document.getElementById('location').textContent = `📍 ${data.name}, ${data.sys.country}`;
  document.getElementById('date').textContent = `📅 ${new Date().toLocaleDateString()}`;
  document.getElementById('time').textContent = `🕒 ${new Date().toLocaleTimeString()}`;
  document.getElementById('timezone').textContent = `🌍 ${timezone}`;
  document.getElementById('temperature').textContent = `🌡️ ${data.main.temp}°C`;
  document.getElementById('weather-condition').textContent = `${icon} ${data.weather[0].description}`;
});