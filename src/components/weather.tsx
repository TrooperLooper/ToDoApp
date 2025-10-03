import { useEffect, useState } from "react";
import weatherSun from "../assets/weather_sun.png";
import weatherRain from "../assets/weather_rain.png";
import weatherStandard from "../assets/weather_standard.png";

export default function Weather() {
  const [temp, setTemp] = useState<number | null>(null);
  const [condition, setCondition] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const apiKey = "350817c71258db050226dd69255c5ee7";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        setTemp(Math.round(data.main.temp));
        setCondition(data.weather[0].main);
      } catch (error) {
        setTemp(null);
        setCondition("standard");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to Helsingborg coordinates if geolocation is denied
          fetchWeather(56.0465, 12.6945);
        }
      );
    } else {
      fetchWeather(56.0465, 12.6945);
    }
  }, []);

  // Determine weather image and message based on condition
  let img = weatherStandard;
  let imgAlt = "Partly cloudy weather";
  let message = "Clear skies today";

  if (condition.toLowerCase().includes("sun")) {
    img = weatherSun;
    imgAlt = "Sunny weather";
    message = "Remember your sunglasses today";
  } else if (condition.toLowerCase().includes("rain")) {
    img = weatherRain;
    imgAlt = "Rainy weather";
    message = "Remember your umbrella today";
  }

  // Loading state with accessibility
  if (loading) {
    return (
      <div
        className="flex flex-col items-center"
        role="status"
        aria-live="polite"
      >
        <span>Loading weather...</span>
        <span className="sr-only">
          Please wait while we fetch the weather information
        </span>
      </div>
    );
  }

  // More descriptive alt text based on actual weather conditions
  return (
    <section
      className="flex flex-col items-center"
      aria-labelledby="weather-heading"
    >
      <h2 id="weather-heading" className="sr-only">
        Current Weather
      </h2>
      <div className="flex items-center" aria-live="polite">
        <span
          className="text-2xl font-bold mr-4"
          aria-label={`Temperature: ${temp} degrees celsius`}
        >
          {temp}°
        </span>
        <img src={img} alt={imgAlt} className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>
      <p className="text-center mt-2" aria-label={`Weather tip: ${message}`}>
        {message}
      </p>
    </section>
  );
}
