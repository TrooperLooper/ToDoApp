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
        setCondition(data.weather[0].main); // e.g. "Clear", "Rain", "Clouds"
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
          // If user denies location, fallback to a default (e.g. Helsingborg)
          fetchWeather(56.0465, 12.6945);
        }
      );
    } else {
      // If geolocation not available, fallback to a default
      fetchWeather(56.0465, 12.6945);
    }
  }, []);

  let img = weatherStandard;
  let message = "Clear skies today";
  if (condition.toLowerCase().includes("sun")) {
    img = weatherSun;
    message = "Remember your sunglasses today";
  } else if (condition.toLowerCase().includes("rain")) {
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
      <div className="flex items-center mb-2">
        <span className="text-2xl font-bold mr-2">
          {temp !== null ? `${temp}°` : "--"}
        </span>
        <img src={img} alt="weather" className="w-12 h-12" />
      </div>
      <span className="text-center">{message}</span>
    </div>
  );
}
