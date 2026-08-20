import React, { useState, useEffect, useRef } from 'react';
import { WeatherData, LanguageCode, CropType, LocationSearchResult } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import { WeatherCard } from '../components/WeatherCard';
import {
  Search,
  MapPin,
  RefreshCw,
  Navigation,
  AlertTriangle,
  WifiOff,
  CloudOff,
  Check,
  Loader2,
  ChevronDown
} from 'lucide-react';

interface WeatherPageProps {
  language: LanguageCode;
}

const CROPS: CropType[] = ['Tomato', 'Paddy', 'Cotton', 'Maize', 'Chilli', 'Potato'];

export const WeatherPage: React.FC<WeatherPageProps> = ({ language }) => {
  const t = translations[language];

  // Restore saved location from localStorage or default to Warangal
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    return localStorage.getItem('agricare_farm_location_name') || 'Warangal, Telangana';
  });

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | null>(() => {
    const saved = localStorage.getItem('agricare_farm_coords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return { lat: 17.9689, lon: 79.5941 };
  });

  const [selectedCrop, setSelectedCrop] = useState<string>(() => {
    return localStorage.getItem('agricare_weather_crop') || 'Tomato';
  });

  // Search input & suggestions state
  const [searchQuery, setSearchQuery] = useState<string>(selectedLocation);
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Weather fetch state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'location' | 'weather' | 'network' | null>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Location Search Autocomplete
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }

    // If query matches current selected location, don't trigger search
    if (searchQuery.trim().toLowerCase() === selectedLocation.trim().toLowerCase()) {
      return;
    }

    setIsSearchingLocation(true);
    const timer = setTimeout(async () => {
      try {
        const results = await api.searchLocations(searchQuery.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error('Location search failed:', err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedLocation]);

  // Fetch Live Weather
  const fetchWeather = async (
    locationName: string = selectedLocation,
    coords: { lat: number; lon: number } | null = selectedCoords,
    crop: string = selectedCrop
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setErrorType(null);

    // Check offline status
    if (!navigator.onLine) {
      setErrorMessage("No internet connection available. Please connect to the internet and retry.");
      setErrorType('network');
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const data = await api.getWeather({
        location: locationName,
        lat: coords?.lat,
        lon: coords?.lon,
        crop: crop
      });

      if (!data || !data.current) {
        throw new Error('Incomplete weather payload');
      }

      setWeatherData(data);

      // Persist in localStorage
      localStorage.setItem('agricare_farm_location_name', locationName);
      if (coords) {
        localStorage.setItem('agricare_farm_coords', JSON.stringify(coords));
      }
      localStorage.setItem('agricare_weather_crop', crop);
    } catch (e: any) {
      console.error('Weather error:', e);
      if (!navigator.onLine) {
        setErrorMessage("Internet connection lost. Please check your network.");
        setErrorType('network');
      } else {
        setErrorMessage(t.weatherFetchError || "Unable to fetch live weather data. Please retry.");
        setErrorType('weather');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load or crop change
  useEffect(() => {
    fetchWeather(selectedLocation, selectedCoords, selectedCrop);
  }, [selectedCrop]);

  // Handle Location Selection from Suggestions
  const handleSelectLocation = (item: LocationSearchResult) => {
    const locName = item.formatted_location || item.display_name || item.name;
    const coords = { lat: item.lat, lon: item.lon };
    
    setSelectedLocation(locName);
    setSearchQuery(locName);
    setSelectedCoords(coords);
    setShowSuggestions(false);

    fetchWeather(locName, coords, selectedCrop);
  };

  // Handle Manual Search Submit (Enter Key or Search Click)
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery || searchQuery.trim().length < 2) return;

    setShowSuggestions(false);
    setIsLoading(true);
    setErrorMessage(null);
    setErrorType(null);

    try {
      const results = await api.searchLocations(searchQuery.trim());
      if (results && results.length > 0) {
        handleSelectLocation(results[0]);
      } else {
        // Try direct fetch by name
        setSelectedLocation(searchQuery.trim());
        setSelectedCoords(null);
        fetchWeather(searchQuery.trim(), null, selectedCrop);
      }
    } catch {
      setErrorMessage(t.locationNotFound || "Location could not be found. Please check spelling.");
      setErrorType('location');
      setIsLoading(false);
    }
  };

  // GPS Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocatingGPS(true);
    setErrorMessage(null);
    setErrorType(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Reverse geocode GPS to place name
          const geoRes = await api.reverseGeocode(lat, lon);
          const locName = geoRes.formatted_location || `My Farm (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
          const coords = { lat, lon };

          setSelectedLocation(locName);
          setSearchQuery(locName);
          setSelectedCoords(coords);

          fetchWeather(locName, coords, selectedCrop);
        } catch (err) {
          console.warn('Reverse geocode error:', err);
          const fallbackName = `Current GPS (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`;
          const coords = { lat, lon };
          setSelectedLocation(fallbackName);
          setSearchQuery(fallbackName);
          setSelectedCoords(coords);
          fetchWeather(fallbackName, coords, selectedCrop);
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (err) => {
        console.error('GPS error:', err);
        setIsLocatingGPS(false);
        if (err.code === err.PERMISSION_DENIED) {
          alert("Location permission was denied. Please allow location access in your browser settings to use current location.");
        } else {
          setErrorMessage("Unable to retrieve GPS coordinates. Please try searching your town or village.");
          setErrorType('location');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>{t.weatherHeader}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {t.weatherSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh Weather Button */}
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchWeather(selectedLocation, selectedCoords, selectedCrop);
            }}
            disabled={isLoading || isRefreshing}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
            title="Refresh latest live weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{t.refreshWeather}</span>
          </button>
        </div>
      </div>

      {/* Location & Crop Selection Controls Bar */}
      <div className="glass-card p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* 1. Interactive Farm Location Search with Autocomplete */}
          <div className="md:col-span-8 relative" ref={searchContainerRef}>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.searchFarmLocation}</span>
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                Village, Town, City, District, or State
              </span>
            </label>

            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Search className="w-4 h-4 text-emerald-700" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder={t.searchLocationPlaceholder}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 hover:border-emerald-400 focus:border-emerald-500 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all placeholder:text-slate-400"
              />

              {isSearchingLocation && (
                <div className="absolute right-20 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                </div>
              )}

              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Suggestions Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100">
                <div className="px-3.5 py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Matching Locations in India & Worldwide
                </div>
                {suggestions.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-emerald-50/80 transition-colors flex items-start gap-2.5 group"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-emerald-900">
                        {loc.formatted_location}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {loc.display_name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Crop Risk Model Dropdown */}
          <div className="md:col-span-4">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {t.cropRiskModel}
            </label>
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-emerald-400 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. "Use My Current Location" Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700">Current Station:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200/60">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {selectedLocation}
            </span>
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocatingGPS || isLoading}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 text-emerald-700 ${isLocatingGPS ? 'animate-spin' : ''}`} />
            <span>{isLocatingGPS ? t.locatingGps : `📍 ${t.useCurrentLocation}`}</span>
          </button>
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900 shadow-sm animate-fade-in">
          {errorType === 'network' ? (
            <WifiOff className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          ) : errorType === 'location' ? (
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          ) : (
            <CloudOff className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          )}
          <div className="flex-1">
            <h4 className="font-bold text-sm text-red-950">
              {errorType === 'network' ? 'Connection Error' : errorType === 'location' ? 'Location Error' : 'Weather Service Error'}
            </h4>
            <p className="text-xs text-red-800 mt-0.5 font-medium leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <button
            onClick={() => fetchWeather(selectedLocation, selectedCoords, selectedCrop)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-56 bg-slate-200 rounded-2xl" />
            <div className="h-56 md:col-span-2 bg-slate-200 rounded-2xl" />
          </div>
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
      )}

      {/* Main Live Weather & Dynamic Risk View */}
      {!isLoading && weatherData && (
        <WeatherCard weather={weatherData} language={language} />
      )}
    </div>
  );
};
