// src/components/ParadeForm.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ParadeFormProps {
  onSubmit: (data: { city: string; eventName: string; date: string }) => void;
  isLoading: boolean;
}

const ParadeForm: React.FC<ParadeFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    city: '',
    eventName: '',
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.city && formData.eventName && formData.date) {
      onSubmit(formData);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="glow-card p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h2 className="text-2xl font-bold mb-6 text-center neon-text">Plan Your Parade</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium mb-2">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Enter parade or event name"
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city name"
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Event Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed glow-effect"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing Weather...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Check Weather Conditions
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 className="font-semibold text-blue-300 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-blue-200/80">
          Plan your parade with confidence! We analyze wind, precipitation, temperature, and humidity 
          to ensure your event goes smoothly regardless of weather conditions.
        </p>
      </div>
    </div>
  );
};

export default ParadeForm;