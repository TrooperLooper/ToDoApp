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
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) {
          console.error("Weather API key not found in environment variables");
          setCondition("standard");
          setLoading(false);
          return;
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        setTemp(Math.round(data.main.temp));
        setCondition(data.weather[0].main); // e.g. "Clear", "Rain", "Clouds"
      } catch (error) {
        console.error("Weather fetch error:", error);
        setTemp(null);
        setCondition("standard");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Geolocation enabled:", position.coords);
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied or unavailable:", error.message);
          // If user denies location, fallback to a default (e.g. Helsingborg)
          fetchWeather(56.0465, 12.6945);
        },
      );
    } else {
      console.warn("Geolocation not available, using fallback location");
      // If geolocation not available, fallback to a default
      fetchWeather(56.0465, 12.6945);
    }
  }, []);

  let img = weatherStandard;
  let message = "Clear skies today";
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    img = weatherSun;
    message = "Remember your sunglasses today";
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    img = weatherRain;
    message = "Remember your umbrella today";
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <span>Loading weather...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-2 gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold">
          {temp !== null ? `${temp}°` : "--"}
        </span>
        <img
          src={img}
          alt="weather"
          className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24"
        />
      </div>
      <span className="text-center text-xs sm:text-sm md:text-base">
        {message}
      </span>
    </div>
  );
}
