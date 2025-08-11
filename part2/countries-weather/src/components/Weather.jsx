import { useState, useEffect } from 'react';
import axios from 'axios';

const api_key = import.meta.env.VITE_WEATHER_API_KEY;

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!capital) return;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
      )
      .then(response => setWeather(response.data))
      .catch(error => console.error('Error fetching weather:', error));
  }, [capital]);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
