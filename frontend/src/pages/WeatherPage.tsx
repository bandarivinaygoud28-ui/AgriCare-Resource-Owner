import React, { useState, useEffect } from 'react';
import { WeatherData, LanguageCode, CropType } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import { WeatherCard } from '../components/WeatherCard';
import { CloudSun, MapPin, RefreshCw } from 'lucide-react';

interface WeatherPageProps {
  language: LanguageCode;
}

const POPULAR_LOCATIONS = [
  "Warangal, Telangana",
  "Karimnagar, Telangana",
  "Nalgonda, Telangana",
  "Guntur, Andhra Pradesh",
  "Chittoor, Andhra Pradesh",
  "Nashik, Maharashtra",
  "Kolar, Karnataka",
  "Ludhiana, Punjab"
];

const CROPS: CropType[] = ['Tomato', 'Paddy', 'Cotton', 'Maize', 'Chilli', 'Potato'];

export const WeatherPage: React.FC<WeatherPageProps> = ({ language }) => {
  const t = translations[language];

  const [selectedLocation, setSelectedLocation] = useState<string>("Warangal, Telangana");
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const data = await api.getWeather({
        location: selectedLocation,
        crop: selectedCrop
      });
      setWeatherData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [selectedLocation, selectedCrop]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.weatherHeader}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {t.weatherSubtitle}
          </p>
        </div>

        <button
          onClick={() => {
            setIsRefreshing(true);
            fetchWeather();
          }}
          disabled={isRefreshing}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Weather</span>
        </button>
      </div>

      {/* Location & Crop Selection Controls */}
      <div className="glass-card p-4 sm:p-5 bg-white border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs font-bold text-slate-600 block mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Select Farm Location</span>
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {POPULAR_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <label className="text-xs font-bold text-slate-600 block mb-1">
            Crop Risk Model
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Weather Card View */}
      {weatherData && (
        <WeatherCard weather={weatherData} language={language} />
      )}
    </div>
  );
};
