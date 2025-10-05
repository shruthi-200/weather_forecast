// src/components/WeatherDashboard.tsx
import React from 'react';
import { Thermometer, Wind, Droplets, Gauge, Calendar, MapPin, AlertTriangle } from 'lucide-react';

interface WeatherData {
  precipitation: number;
  wind: number;
  humidity: number;
  temperature: number;
  city: string;
  eventName: string;
  date: string;
  description: string;
  alerts?: Array<{
    event: string;
    description: string;
  }>;
}

interface ForecastDay {
  date: string;
  temp: number;
  precipitation: number;
  wind: number;
  humidity: number;
  description: string;
}

interface WeatherDashboardProps {
  data: WeatherData;
  forecast: ForecastDay[];
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ data, forecast }) => {
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('wind')) return '💨';
    if (desc.includes('storm')) return '⛈️';
    return '🌈';
  };

  const getStatusColor = (type: string, value: number) => {
    switch (type) {
      case 'temperature':
        if (value < 5) return 'text-blue-300';
        if (value > 35) return 'text-red-300';
        return 'text-green-300';
      case 'wind':
        if (value > 50) return 'text-red-300';
        if (value > 30) return 'text-orange-300';
        return 'text-green-300';
      case 'precipitation':
        if (value > 50) return 'text-red-300';
        if (value > 10) return 'text-orange-300';
        return 'text-green-300';
      case 'humidity':
        if (value > 80) return 'text-orange-300';
        if (value < 30) return 'text-yellow-300';
        return 'text-green-300';
      default:
        return 'text-white';
    }
  };

  const getStatusMessage = () => {
    const issues = [];
    
    if (data.wind > 30) issues.push('high wind');
    if (data.precipitation > 10) issues.push('rain');
    if (data.temperature < 5 || data.temperature > 35) issues.push('extreme temperature');
    if (data.humidity > 80) issues.push('high humidity');

    if (issues.length === 0) {
      return { message: 'Perfect conditions for your parade! 🎉', color: 'text-green-400' };
    }

    return { 
      message: `Be aware of ${issues.join(', ')} conditions`, 
      color: 'text-yellow-400' 
    };
  };

  const status = getStatusMessage();

  return (
    <div className="space-y-6">
      {/* Current Weather Overview */}
      <div className="glow-card p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              {data.city}
            </h2>
            <p className="text-lg text-muted-foreground">{data.eventName}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(data.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="text-4xl font-bold flex items-center gap-2">
              {getWeatherIcon(data.description)}
              {Math.round(data.temperature)}°C
            </div>
            <p className="text-lg capitalize text-muted-foreground">{data.description}</p>
          </div>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${status.color.includes('green') ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Event Status:</span>
            <span>{status.message}</span>
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/30 p-4 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <span className="font-semibold">Temperature</span>
            </div>
            <p className={`text-2xl font-bold ${getStatusColor('temperature', data.temperature)}`}>
              {Math.round(data.temperature)}°C
            </p>
          </div>

          <div className="bg-background/30 p-4 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Wind Speed</span>
            </div>
            <p className={`text-2xl font-bold ${getStatusColor('wind', data.wind)}`}>
              {data.wind} m/s
            </p>
          </div>

          <div className="bg-background/30 p-4 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold">Precipitation</span>
            </div>
            <p className={`text-2xl font-bold ${getStatusColor('precipitation', data.precipitation)}`}>
              {data.precipitation} mm
            </p>
          </div>

          <div className="bg-background/30 p-4 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-5 h-5 text-purple-400" />
              <span className="font-semibold">Humidity</span>
            </div>
            <p className={`text-2xl font-bold ${getStatusColor('humidity', data.humidity)}`}>
              {data.humidity}%
            </p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="glow-card p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            5-Day Forecast
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="bg-background/30 p-4 rounded-lg border border-border/50 text-center">
                <p className="font-semibold mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <div className="text-2xl mb-2">{getWeatherIcon(day.description)}</div>
                <p className="text-lg font-bold">{Math.round(day.temp)}°C</p>
                <p className="text-xs text-muted-foreground capitalize mt-1">{day.description}</p>
                <div className="flex justify-between text-xs mt-2">
                  <span>💨 {day.wind}m/s</span>
                  <span>🌧️ {day.precipitation}mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;