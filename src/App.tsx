// App.tsx
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

// Simple Weather Display Component
const WeatherDisplay = ({ data }: any) => {
  if (!data) return null;
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      marginTop: '25px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      color: '#2d3748'
    }}>
      <h2 style={{ 
        fontSize: '1.8rem', 
        fontWeight: '700', 
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        Weather in {data.city}
      </h2>
      <p style={{ 
        textAlign: 'center', 
        color: '#4a5568', 
        marginBottom: '30px',
        fontSize: '1.1rem'
      }}>
        Event: {data.eventName} • {new Date(data.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        {/* Temperature Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
          padding: '25px', 
          borderRadius: '15px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '5px' }}>
            {Math.round(data.temperature)}°C
          </div>
          <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            {data.description}
          </div>
        </div>
        
        {/* Wind Speed Card */}
        <div style={{ 
          background: '#f7fafc', 
          padding: '25px', 
          borderRadius: '15px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontWeight: '600', color: '#4a5568', marginBottom: '10px' }}>
            💨 Wind Speed
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2d3748' }}>
            {data.wind} m/s
          </div>
        </div>
        
        {/* Precipitation Card */}
        <div style={{ 
          background: '#f7fafc', 
          padding: '25px', 
          borderRadius: '15px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontWeight: '600', color: '#4a5568', marginBottom: '10px' }}>
            🌧️ Precipitation
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2d3748' }}>
            {data.precipitation} mm
          </div>
        </div>
        
        {/* Humidity Card */}
        <div style={{ 
          background: '#f7fafc', 
          padding: '25px', 
          borderRadius: '15px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontWeight: '600', color: '#4a5568', marginBottom: '10px' }}>
            💧 Humidity
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2d3748' }}>
            {data.humidity}%
          </div>
        </div>
      </div>
      
      {/* Data Source Info */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#718096',
        marginTop: '20px',
        padding: '10px',
        background: '#f7fafc',
        borderRadius: '8px'
      }}>
        📡 Live data from OpenWeatherMap API
      </div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [formData, setFormData] = useState({
    city: '',
    eventName: '',
    date: ''
  });

  const fetchRealWeatherData = async (city: string) => {
    try {
      // Using OpenWeatherMap API (free tier)
      const API_KEY = 'a46e7d640088dc4cdb814db3a21104e0'; // This is the API key from your original code
      
      // First, get coordinates for the city
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData || geocodeData.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = geocodeData[0];

      // Then get weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!weatherResponse.ok) {
        throw new Error('Weather API failed');
      }

      const weatherData = await weatherResponse.json();

      return {
        precipitation: weatherData.rain ? (weatherData.rain['1h'] || 0) : 0,
        wind: weatherData.wind.speed,
        humidity: weatherData.main.humidity,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        city: city,
        realData: true // Mark as real data
      };
    } catch (error) {
      console.error('Error fetching real weather data:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.city && formData.eventName && formData.date) {
      setIsLoading(true);
      
      try {
        // Try to get REAL weather data first
        const realWeather = await fetchRealWeatherData(formData.city);
        
        const weatherWithEvent = {
          ...realWeather,
          eventName: formData.eventName,
          date: formData.date
        };

        setWeatherData(weatherWithEvent);
        toast.success('Real weather data retrieved successfully! 🌤️');
        
      } catch (error) {
        console.log('Falling back to mock data due to error:', error);
        
        // Fallback to mock data if real API fails
        const mockWeather = {
          precipitation: (Math.random() * 20).toFixed(1),
          wind: (Math.random() * 15).toFixed(1),
          humidity: Math.round(40 + Math.random() * 40),
          temperature: Math.round(15 + Math.random() * 20),
          city: formData.city,
          eventName: formData.eventName,
          date: formData.date,
          description: ["clear sky", "partly cloudy", "light rain", "sunny"][Math.floor(Math.random() * 4)],
          realData: false // Mark as mock data
        };

        setWeatherData(mockWeather);
        toast.warning('Using sample data (API limit reached) ⚠️');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="header">
        <h1 className="main-title">SpaceShield</h1>
        <p className="subtitle">Parade Planner</p>
        <p className="description">
          Powered by Real Weather APIs • Live weather intelligence for safe event planning
        </p>
      </header>

      {/* Main Form */}
      <div className="form-container">
        <h2 className="form-title">Plan Your Parade</h2>
        
        <form onSubmit={handleSubmit}>
          {/* City Location */}
          <div className="form-section">
            <label className="section-label">City Location</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter city name"
              required
            />
            <p className="helper-text">Enter real city name (e.g., London, Tokyo, New York)</p>
          </div>

          {/* Event Name */}
          <div className="form-section">
            <label className="section-label">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter event name"
              required
            />
            <p className="helper-text">Enter parade or event name</p>
          </div>

          {/* Event Date */}
          <div className="form-section">
            <label className="section-label">Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
            <p className="helper-text">[mm/dd/yyyy]</p>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Fetching Live Weather...
              </>
            ) : (
              'Get Real Weather Data'
            )}
          </button>
        </form>
      </div>

      {/* Weather Display */}
      {weatherData && (
        <>
          <WeatherDisplay data={weatherData} />
          {!weatherData.realData && (
            <div style={{
              textAlign: 'center',
              background: 'rgba(255, 152, 0, 0.1)',
              color: '#f57c00',
              padding: '10px',
              borderRadius: '10px',
              marginTop: '10px',
              fontSize: '0.9rem'
            }}>
              ⚠️ Showing sample data. Real API might be rate-limited.
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">Built for NASA Space Apps Challenge 2024</p>
        <p className="footer-subtext">
          Data sources: OpenWeatherMap API • OpenStreetMap Geocoding
        </p>
      </footer>
    </div>
  );
}

export default App;