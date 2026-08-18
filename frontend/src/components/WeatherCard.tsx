import React from 'react';
import { WeatherData, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { CloudSun, Droplets, Wind, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  language: LanguageCode;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, language }) => {
  const t = translations[language];
  const { current, agricultural_advisory, forecast, location } = weather;

  const isRiskHigh = agricultural_advisory.disease_risk === 'High';
  const isRiskModerate = agricultural_advisory.disease_risk === 'Moderate';

  return (
    <div className="space-y-6">
      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block">
              Agro-Meteorological Station
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">{location}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className={`badge ${
              isRiskHigh ? 'bg-red-500/20 text-red-200 border-red-400' :
              isRiskModerate ? 'bg-amber-500/20 text-amber-200 border-amber-400' :
              'bg-emerald-500/20 text-emerald-200 border-emerald-400'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              {agricultural_advisory.disease_risk} Disease Risk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Main Temperature */}
          <div className="flex items-center gap-4">
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
              {current.temp}°<span className="text-2xl text-emerald-300">C</span>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-200">{current.condition}</p>
              <p className="text-xs text-white/70">{t.feelsLike} {current.feels_like}°C</p>
            </div>
          </div>

          {/* Metric: Humidity */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
              <Droplets className="w-4 h-4" />
              <span>{t.humidity}</span>
            </div>
            <span className="text-2xl font-black text-white">{current.humidity}%</span>
            <p className="text-[11px] text-white/60 mt-0.5">Foliar wetness factor</p>
          </div>

          {/* Metric: Wind Speed */}
          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-1">
              <Wind className="w-4 h-4" />
              <span>{t.windSpeed}</span>
            </div>
            <span className="text-2xl font-black text-white">{current.wind_speed} <span className="text-xs font-normal">km/h</span></span>
            <p className="text-[11px] text-white/60 mt-0.5">Spraying drift factor</p>
          </div>

          {/* Spraying Window Status */}
          <div className={`p-4 rounded-2xl border ${
            agricultural_advisory.suitable_for_spraying
              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-100'
              : 'bg-amber-500/20 border-amber-400/50 text-amber-100'
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
              {agricultural_advisory.suitable_for_spraying ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <AlertCircle className="w-4 h-4 text-amber-300" />}
              <span>Spraying Window</span>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              {agricultural_advisory.suitable_for_spraying ? 'Safe to spray chemicals' : 'Caution: High drift/wash risk'}
            </p>
          </div>
        </div>
      </div>

      {/* Advisory & Risk Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disease Risk Explanations */}
        <div className="glass-card p-6 border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-900">
            <ShieldAlert className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-base">{t.diseaseRiskLevel}</h4>
          </div>
          <div className="space-y-3">
            {agricultural_advisory.disease_risk_factors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spraying Advisory Details */}
        <div className="glass-card p-6 border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-900">
            <Wind className="w-5 h-5 text-sky-700" />
            <h4 className="font-bold text-base">{t.sprayingAdvisory}</h4>
          </div>
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-sky-950 text-sm font-medium leading-relaxed">
            {agricultural_advisory.spraying_advisory}
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Tip: Early morning (6:30 AM – 9:30 AM) or late afternoon (4:00 PM – 6:00 PM) typically provide lowest wind drift and highest chemical absorption.
          </p>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      <div className="glass-card p-6">
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
                {item.condition.includes('Rain') ? '🌧️' : item.condition.includes('Cloud') ? '⛅' : '☀️'}
              </div>

              <div className="text-sm font-black text-slate-900">
                {item.temp_max}° <span className="text-xs font-medium text-slate-500">/ {item.temp_min}°</span>
              </div>

              <p className="text-[11px] text-slate-600 mt-1 font-medium line-clamp-1">{item.condition}</p>
              
              <span className="inline-block mt-2 text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-full text-slate-700 font-semibold">
                💧 {item.humidity}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
