
# Weather Web App

This project is a simple weather web application that fetches and displays the current weather for a user's location. The app includes the following features:

- Auto-detects the user's location and timezone using the browser's geolocation API.
- Fetches the current weather and temperature from the OpenWeatherMap API.
- Displays today's date, time, timezone, weather, and temperature in a clean, vibrant layout.
- Backgrounds that change shapes and colors randomly with animation for a dynamic user experience.

## Technologies Used

- **Frontend**: HTML, CSS (including animated geometric patterns for the background), JavaScript.
- **Backend**: Node.js, Express.js.
- **API**: OpenWeatherMap for fetching weather data.
- **Docker**: Used for containerization to run the app in a local Docker image.

## Features

1. **Weather Information**:
   - Displays the current temperature and weather condition.
   - Weather data fetched via the OpenWeatherMap API.
  
2. **Geolocation**:
   - Automatically detects the user's location using the browser's geolocation feature.

3. **Animated Background**:
   - Geometric patterns that are randomly generated and animated for a dynamic visual effect.

4. **Responsive Design**:
   - Mobile-friendly interface to ensure a smooth experience across different devices.

## How to Run the Project Locally

### Prerequisites

1. Install Node.js (which includes npm) from [https://nodejs.org/](https://nodejs.org/).
2. Install Docker on your machine.

### Steps to Run Without Docker

1. Clone or download the repository.
2. In the project folder, run the following commands:
   
   ```bash
   npm install
   npm start
   ```

3. The app will be available at `http://localhost:5000`.

### Steps to Run With Docker

1. Clone or download the repository.
2. In the project folder, run the following command to build the Docker image:

   ```bash
   docker build -t dynamicweatherapp .
   ```

3. After building the image, run it:

   ```bash
   docker run -p 9999:5000 -e OPENWEATHER_API_KEY=your_api_key_here dynamicweatherapp:latest
   ```

4. The app will be available at `http://localhost:9999`.

## Known Issues

- The app depends on the browser's geolocation feature, so users need to allow location access for it to work properly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

