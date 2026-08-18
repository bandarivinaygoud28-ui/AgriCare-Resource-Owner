import React, { useState, useEffect } from 'react';
import { CropType, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import {
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Droplets,
  Sprout,
  Flame
} from 'lucide-react';

interface AdvisoryPageProps {
  language: LanguageCode;
}

const CROPS: CropType[] = ['Tomato', 'Paddy', 'Cotton', 'Maize', 'Chilli', 'Potato'];

export const AdvisoryPage: React.FC<AdvisoryPageProps> = ({ language }) => {
  const t = translations[language];
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Tomato');
  const [advisoryData, setAdvisoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdvisory = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAdvisory(selectedCrop);
        setAdvisoryData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvisory();
  }, [selectedCrop]);

  const diagnosis = advisoryData?.standard_diagnosis;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-emerald-300" />
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
            Agronomic Knowledge Base
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {t.navAdvisory}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl font-medium">
          Comprehensive, scientific crop protection recommendations, integrated pest management, and official dosages.
        </p>

        {/* Crop Switcher Bar */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          {CROPS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCrop === c
                  ? 'bg-white text-emerald-950 shadow-md scale-105'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {diagnosis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Main Advisory Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Standard Disease & Symptoms */}
            <div className="glass-card p-6 bg-white border border-slate-200">
              <div className="flex items-center gap-2.5 mb-3 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">Key Pathogen Risk: {diagnosis.disease}</h3>
              </div>
              <p className="text-xs text-slate-600 mb-4">{diagnosis.cause}</p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recognized Symptoms:</h4>
              <ul className="space-y-2">
                {diagnosis.symptoms?.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment Guidance */}
            <div className="glass-card p-6 bg-white border border-slate-200">
              <div className="flex items-center gap-2.5 mb-4 text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">{t.treatmentGuidance}</h3>
              </div>
              <div className="space-y-3 mb-6">
                {diagnosis.treatment?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-800 font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Disclaimer:</strong> {t.treatmentDisclaimer}
              </div>
            </div>

            {/* Long-Term Prevention */}
            <div className="glass-card p-6 bg-white border border-slate-200">
              <div className="flex items-center gap-2.5 mb-4 text-blue-800">
                <Bookmark className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">{t.preventionGuidance}</h3>
              </div>
              <ul className="space-y-2.5">
                {diagnosis.prevention?.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right 1 Col: Best Practices & Quick Actions */}
          <div className="space-y-6">
            {/* Immediate Actions */}
            <div className="glass-card p-6 bg-red-50/40 border border-red-200">
              <div className="flex items-center gap-2 mb-3 text-red-800 font-bold text-sm">
                <Flame className="w-4 h-4 text-red-600" />
                <span>{t.immediateActions}</span>
              </div>
              <div className="space-y-2">
                {diagnosis.immediate_actions?.map((act: string, i: number) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-red-100 text-xs font-medium text-slate-800">
                    {i + 1}. {act}
                  </div>
                ))}
              </div>
            </div>

            {/* General Agronomic Best Practices */}
            <div className="glass-card p-6 bg-white border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Good Agricultural Practices (GAP)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                {advisoryData.best_practices?.map((bp: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
