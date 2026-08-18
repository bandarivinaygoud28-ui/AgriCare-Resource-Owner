import React, { useState, useEffect } from 'react';
import { FarmerProfile, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import { User, Phone, MapPin, Sprout, Globe, Check, Save } from 'lucide-react';

interface ProfilePageProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onProfileUpdated?: (name: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  language,
  onLanguageChange,
  onProfileUpdated
}) => {
  const t = translations[language];

  const [profile, setProfile] = useState<FarmerProfile>({
    name: "Ramesh Patel",
    phone: "+91 98480 12345",
    email: "ramesh.farmer@agricare.ai",
    state: "Telangana",
    district: "Warangal",
    location: "Warangal Rural (Enumamula)",
    main_crops: "Tomato,Paddy,Cotton,Chilli",
    preferred_language: language
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const p = await api.getProfile();
        setProfile(p);
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await api.updateProfile(profile);
      setSavedSuccess(true);
      if (onProfileUpdated) onProfileUpdated(profile.name);
      if (profile.preferred_language && profile.preferred_language !== language) {
        onLanguageChange(profile.preferred_language);
      }
    } catch (e) {
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-inner">
            👨‍🌾
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium mt-0.5">
              Verified Farmer Profile • {profile.district}, {profile.state}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
        <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
          Farmer & Farm Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Farmer Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Farmer Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              State
            </label>
            <input
              type="text"
              value={profile.state}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          {/* District */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              District
            </label>
            <input
              type="text"
              value={profile.district}
              onChange={(e) => setProfile({ ...profile, district: e.target.value })}
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          {/* Location / Village */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Village / Mandi / Farm Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Main Crops Cultivated */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Main Crops (comma separated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.main_crops}
                onChange={(e) => setProfile({ ...profile, main_crops: e.target.value })}
                required
                placeholder="e.g. Tomato, Paddy, Cotton, Chilli"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <Sprout className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Preferred Language */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Preferred App & Voice Language
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en' as LanguageCode, label: 'English 🇬🇧' },
                { code: 'te' as LanguageCode, label: 'తెలుగు (Telugu) 🇮🇳' },
                { code: 'hi' as LanguageCode, label: 'हिन्दी (Hindi) 🇮🇳' }
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setProfile({ ...profile, preferred_language: l.code })}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    profile.preferred_language === l.code
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile and language preferences updated successfully!</span>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
