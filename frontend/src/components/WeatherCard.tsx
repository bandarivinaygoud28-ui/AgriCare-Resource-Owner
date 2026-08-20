import React from 'react';
import { WeatherData, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import {
  CloudSun,
  Droplets,
  Wind,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  CloudRain,
  Cloud,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  language: LanguageCode;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, language }) => {
  const t = translations[language];
  const { current, agricultural_advisory, forecast, location, coordinates, source, is_live } = weather;

  const isRiskHigh = agricultural_advisory.disease_risk === 'High';
  const isRiskModerate = agricultural_advisory.disease_risk === 'Moderate';

  const precipitation = current.precipitation ?? 0.0;
  const cloudCover = current.cloud_cover ?? 20;
  const updatedAt = current.updated_at || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      {/* 1. Main Meteorological Hero Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800/40">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Station Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-extrabold flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>Live Agro-Meteorological Station</span>
              </span>
              {is_live && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live API
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{location}</span>
            </h3>
            {coordinates && (
              <p className="text-[11px] text-emerald-200/70 font-medium mt-0.5">
                Lat: {coordinates.lat.toFixed(3)}° N, Lon: {coordinates.lon.toFixed(3)}° E • {source || 'Meteorological Network'}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Last updated badge */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-emerald-100 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t.weatherUpdated}: {updatedAt}</span>
            </div>

            {/* Disease Risk Badge */}
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm ${
              isRiskHigh ? 'bg-red-500/25 text-red-200 border-red-400/60' :
              isRiskModerate ? 'bg-amber-500/25 text-amber-200 border-amber-400/60' :
              'bg-emerald-500/25 text-emerald-200 border-emerald-400/60'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              {agricultural_advisory.disease_risk} Disease Risk
            </span>
          </div>
        </div>

        {/* 6 Key Weather Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-stretch relative z-10">
          {/* 1. Main Temperature & Condition */}
          <div className="sm:col-span-2 bg-white/10 backdrop-blur p-4 sm:p-5 rounded-2xl border border-white/15 flex items-center gap-4">
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter shrink-0">
              {current.temp}°<span className="text-2xl text-emerald-300">C</span>
            </div>
            <div>
              <p className="text-base font-bold text-emerald-200 leading-tight">{current.condition}</p>
              <p className="text-xs text-white/80 mt-0.5">{t.feelsLike} {current.feels_like}°C</p>
              <p className="text-[11px] text-white/60 mt-1 line-clamp-1">{current.description}</p>
            </div>
          </div>

          {/* 2. Humidity & Foliar Wetness */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold mb-1">
                <Droplets className="w-4 h-4" />
                <span>{t.humidity}</span>
              </div>
              <span className="text-2xl font-black text-white">{current.humidity}%</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">Foliar Wetness</span>
              <p className="text-[11px] text-white/70 font-medium leading-tight">
                {current.foliar_wetness?.status || (current.humidity >= 75 ? 'High wetness' : 'Moderate wetness')}
              </p>
            </div>
          </div>

          {/* 3. Wind Speed & Drift Factor */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold mb-1">
                <Wind className="w-4 h-4" />
                <span>{t.windSpeed}</span>
              </div>
              <span className="text-2xl font-black text-white">{current.wind_speed} <span className="text-xs font-normal">km/h</span></span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">Spraying Drift</span>
              <p className="text-[11px] text-white/70 font-medium leading-tight">
                {current.spraying_drift?.status || (current.wind_speed > 15 ? 'Severe drift' : 'Optimal drift')}
              </p>
            </div>
          </div>

          {/* 4. Rainfall / Precipitation */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sky-300 text-xs font-bold mb-1">
                <CloudRain className="w-4 h-4" />
                <span>{t.rainfall}</span>
              </div>
              <span className="text-2xl font-black text-white">{precipitation} <span className="text-xs font-normal">mm</span></span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-[11px] text-white/70 font-medium leading-tight">
                {precipitation > 0 ? 'Active rain / foliar moisture' : 'No rain recorded'}
              </p>
            </div>
          </div>

          {/* 5. Cloud Coverage */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold mb-1">
                <Cloud className="w-4 h-4" />
                <span>{t.cloudCoverage}</span>
              </div>
              <span className="text-2xl font-black text-white">{cloudCover}%</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-[11px] text-white/70 font-medium leading-tight">
                {cloudCover > 60 ? 'Dense canopy cover' : cloudCover > 30 ? 'Passing sun & clouds' : 'High solar exposure'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Agricultural Risk Modeling & Spraying Window Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* A. Disease Risk & Factors */}
        <div className="glass-card p-6 border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="w-5 h-5 text-emerald-700" />
              <h4 className="font-bold text-base">{t.diseaseRiskLevel}</h4>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase ${
              isRiskHigh ? 'bg-red-100 text-red-800' :
              isRiskModerate ? 'bg-amber-100 text-amber-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              {agricultural_advisory.disease_risk}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 mb-3">
            Target Model: <span className="text-slate-900 font-bold">{agricultural_advisory.crop || 'Crop'}</span>
          </p>

          <div className="space-y-2.5">
            {agricultural_advisory.disease_risk_factors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* B. Spraying Window & Chemical Advisory */}
        <div className="glass-card p-6 border-slate-200 bg-white md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Wind className="w-5 h-5 text-sky-700" />
                <h4 className="font-bold text-base">{t.sprayingAdvisory}</h4>
              </div>

              <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border ${
                agricultural_advisory.suitable_for_spraying
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {agricultural_advisory.suitable_for_spraying ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Safe Spraying Window Open</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Caution: Drift / Wash-off Risk</span>
                  </>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed ${
              agricultural_advisory.suitable_for_spraying
                ? 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
                : 'bg-amber-50/70 border-amber-100 text-amber-950'
            }`}>
              {agricultural_advisory.spraying_advisory}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Foliar Wetness Analysis</span>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  {current.foliar_wetness?.description || `Relative humidity is ${current.humidity}% with passing dew.`}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Spraying Drift Analysis</span>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  {current.spraying_drift?.description || `Current wind velocity is ${current.wind_speed} km/h.`}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 leading-relaxed pt-3 border-t border-slate-100">
            💡 <span className="font-semibold text-slate-700">Recommended Farmer Spraying Hours:</span> Early morning (6:30 AM – 9:30 AM) or late afternoon (4:00 PM – 6:00 PM) minimize chemical evaporation, prevent bee pollinator disturbance, and maximize plant uptake.
          </p>
        </div>
      </div>

      {/* 3. 5-Day Live Forecast Grid */}
      <div className="glass-card p-6 bg-white border-slate-200">
        <h4 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-emerald-700" />
          <span>{t.forecast5Day}</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {forecast.map((item, idx) => (
            <div key={idx} className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 text-center transition-colors">
              <span className="text-xs font-bold text-slate-800 uppercase block mb-1">{item.day}</span>
              <span className="text-[11px] text-slate-400 block mb-2">{item.date.split('-').slice(1).join('/')}</span>
              
              <div className="text-2xl mb-1">
                {item.condition.includes('Rain') || item.condition.includes('Drizzle') ? '🌧️' : 
                 item.condition.includes('Cloud') ? '⛅' : 
                 item.condition.includes('Thunder') ? '⛈️' : '☀️'}
              </div>

              <div className="text-sm font-black text-slate-900">
                {item.temp_max}° <span className="text-xs font-medium text-slate-500">/ {item.temp_min}°</span>
              </div>

              <p className="text-[11px] text-slate-600 mt-1 font-medium line-clamp-1">{item.condition}</p>
              
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-full text-slate-700 font-semibold">
                  💧 {item.humidity}%
                </span>
                {item.pop > 0 && (
                  <span className="text-[10px] bg-sky-100 px-1.5 py-0.5 rounded-full text-sky-700 font-bold">
                    ☔ {item.pop}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
