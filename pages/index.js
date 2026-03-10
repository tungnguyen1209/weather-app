import React, { useState, useEffect } from 'react';
import { Search, Cloud, Sun, CloudRain, Wind, Droplets, MapPin, Navigation, Thermometer, Eye, Gauge } from 'lucide-react';

const API_KEY = '62f7cfb453e6839b55ab9044ae548196';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bgGradient, setBgGradient] = useState('linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)');

  useEffect(() => {
    // Tự động lấy vị trí khi vào trang
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  const updateBackground = (weatherMain) => {
    const themes = {
      Clear: 'linear-gradient(to bottom, #f7971e, #ffd200)',
      Clouds: 'linear-gradient(to bottom, #bdc3c7, #2c3e50)',
      Rain: 'linear-gradient(to bottom, #4b6cb7, #182848)',
      Snow: 'linear-gradient(to bottom, #83a4d4, #b6fbff)',
      Thunderstorm: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
      Default: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)'
    };
    setBgGradient(themes[weatherMain] || themes.Default);
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=vi`);
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        updateBackground(data.weather[0].main);
        fetchForecast(data.name);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=vi`);
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        updateBackground(data.weather[0].main);
        fetchForecast(city);
      } else { alert("Không tìm thấy thành phố!"); }
    } catch (err) { alert("Lỗi kết nối!"); }
    setLoading(false);
  };

  const fetchForecast = async (cityName) => {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}&lang=vi`);
      const data = await res.json();
      // Lấy dữ liệu mỗi 24h (API trả về mỗi 3h)
      const daily = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
      setForecast(daily);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: bgGradient, 
      fontFamily: 'Segoe UI, Roboto, sans-serif', 
      padding: '40px 20px', 
      transition: 'background 1s ease',
      color: '#fff' 
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Search Bar */}
        <form onSubmit={fetchWeather} style={{ 
          display: 'flex', gap: '10px', marginBottom: '30px', 
          background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50px', backdropFilter: 'blur(10px)' 
        }}>
          <MapPin style={{ marginLeft: '10px', alignSelf: 'center' }} />
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="Tìm kiếm thành phố..." 
            style={{ 
              flex: 1, background: 'transparent', border: 'none', outline: 'none', 
              color: 'white', fontSize: '1.1rem', padding: '5px' 
            }}
          />
          <button type="submit" style={{ 
            background: '#fff', color: '#333', border: 'none', 
            borderRadius: '50px', width: '45px', height: '45px', cursor: 'pointer' 
          }}>
            <Search size={20} />
          </button>
        </form>

        {loading && <div style={{ textAlign: 'center' }}>Đang cập nhật dữ liệu...</div>}

        {weather && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Main Weather Card */}
            <div style={{ 
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', 
              padding: '30px', borderRadius: '30px', textAlign: 'center' 
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0' }}>{weather.name}</h2>
              <p style={{ opacity: 0.8, marginTop: '5px' }}>Hôm nay, {new Date().toLocaleDateString('vi-VN')}</p>
              <div style={{ fontSize: '5rem', fontWeight: 'bold', margin: '20px 0' }}>{Math.round(weather.main.temp)}°C</div>
              <p style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>{weather.weather[0].description}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                <span>Cảm giác như: {Math.round(weather.main.feels_like)}°C</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {[
                { icon: <Droplets />, label: 'Độ ẩm', value: `${weather.main.humidity}%` },
                { icon: <Wind />, label: 'Tốc độ gió', value: `${weather.wind.speed} m/s` },
                { icon: <Eye />, label: 'Tầm nhìn', value: `${(weather.visibility / 1000).toFixed(1)} km` },
                { icon: <Gauge />, label: 'Áp suất', value: `${weather.main.pressure} hPa` },
              ].map((item, i) => (
                <div key={i} style={{ 
                  background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '20px', 
                  textAlign: 'center', backdropFilter: 'blur(10px)' 
                }}>
                  <div style={{ marginBottom: '10px', opacity: 0.7 }}>{item.icon}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.value}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Forecast Row */}
            <div style={{ gridColumn: '1 / span 2', marginTop: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Dự báo 5 ngày tới (12:00 PM)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                {forecast.map((day, i) => (
                  <div key={i} style={{ 
                    flex: 1, background: 'rgba(255,255,255,0.1)', padding: '15px', 
                    borderRadius: '20px', textAlign: 'center', backdropFilter: 'blur(5px)' 
                  }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                      {new Date(day.dt * 1000).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.round(day.main.temp)}°C</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '5px', textTransform: 'capitalize' }}>{day.weather[0].description}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
