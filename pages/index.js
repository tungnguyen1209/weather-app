import React, { useState } from 'react';
import { Search, Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    try {
      // Sử dụng API mẫu hoặc OpenWeatherMap
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_API_KEY_HERE`);
      const data = await res.json();
      if (data.cod === 200) setWeather(data);
      else alert("Không tìm thấy thành phố!");
    } catch (err) {
      alert("Lỗi kết nối!");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center', background: '#f0f4f8', borderRadius: '15px' }}>
      <h2>Dự báo Thời tiết</h2>
      <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Nhập tên thành phố..." 
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          <Search size={20} />
        </button>
      </form>

      {loading && <p>Đang tải...</p>}

      {weather && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>{weather.name}, {weather.sys.country}</h3>
          <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>{Math.round(weather.main.temp)}°C</h1>
          <p>{weather.weather[0].description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div><Droplets size={20} /> <br/> {weather.main.humidity}%</div>
            <div><Wind size={20} /> <br/> {weather.wind.speed} m/s</div>
          </div>
        </div>
      )}
    </div>
  );
}
