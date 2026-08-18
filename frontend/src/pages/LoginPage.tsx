import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import {
  Sprout,
  Phone,
  Lock,
  User,
  MapPin,
  ArrowRight,
  Cpu,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

interface LoginPageProps {
  language: LanguageCode;
  onLoginSuccess: (user: any) => void;
}

const FEATURES = [
  { icon: Cpu, title: 'AI Disease Detection', desc: '98.7% accuracy in 6 crop types', color: 'text-emerald-400' },
  { icon: TrendingUp, title: 'Live Market Prices', desc: 'Real-time mandi rates across India', color: 'text-sky-400' },
  { icon: CloudSun, title: 'Weather & Risk Engine', desc: 'Smart spraying window advisory', color: 'text-amber-400' },
  { icon: ShieldCheck, title: 'Multilingual Support', desc: 'English, Telugu & Hindi voice AI', color: 'text-violet-400' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ language, onLoginSuccess }) => {
  const t = translations[language];

  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('9848012345');
  const [password, setPassword] = useState('farmer123');
  const [name, setName] = useState('Ramesh Patel');
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Warangal');
  const [location, setLocation] = useState('Warangal Rural (Enumamula)');
  const [crops, setCrops] = useState('Tomato,Paddy,Cotton');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        const res = await api.register({
          name,
          phone,
          password,
          state,
          district,
          location,
          main_crops: crops,
          preferred_language: language
        });
        onLoginSuccess(res.user);
      } else {
        const res = await api.login(phone, password);
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden border border-slate-200">
        
        {/* ===== LEFT PANEL: Branding & Feature Highlights ===== */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-b from-[#0b3318] via-[#0f4a24] to-[#0a2d18] p-10 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-400 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
              backgroundSize: '28px 28px'
            }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-900/40">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl text-white tracking-tight">AgriCare</span>
                  <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold uppercase tracking-widest mt-0.5">
                  Farmer Advisory Platform
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              India's Most Advanced<br />
              <span className="text-emerald-400">AI Farming Platform</span>
            </h2>
            <p className="text-sm text-emerald-100/70 font-medium leading-relaxed max-w-sm">
              Empowering 140 million Indian farmers with AI-powered disease detection, live market intelligence, and expert crop advisory.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 space-y-3">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-[11px] text-emerald-200/60 font-medium">{desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
            {[
              { value: '2.4L+', label: 'Registered Farmers' },
              { value: '98.7%', label: 'Detection Accuracy' },
              { value: '11+', label: 'Platform Modules' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <span className="text-xl font-black text-white block">{value}</span>
                <span className="text-[10px] text-emerald-300/70 font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== RIGHT PANEL: Auth Form ===== */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-slate-900">AgriCare <span className="text-emerald-700">AI</span></span>
          </div>

          {/* Form Header */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isRegister ? 'Create Farmer Account' : 'Welcome Back 👋'}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {isRegister
                ? 'Register to access AI diagnosis, market prices & more'
                : 'Enter your mobile number to continue to AgriCare AI'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isRegister
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isRegister
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Farmer Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Mobile Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm font-semibold border-r border-slate-200 pr-2">+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="9848012345"
                  className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      placeholder="Telangana"
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      placeholder="Warangal"
                      className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Village / Farm Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder="Warangal Rural (Enumamula)"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Main Crops (comma separated)
                  </label>
                  <input
                    type="text"
                    value={crops}
                    onChange={(e) => setCrops(e.target.value)}
                    placeholder="Tomato, Paddy, Cotton"
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-extrabold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 mt-2 group"
            >
              <span>
                {isLoading
                  ? 'Processing...'
                  : isRegister
                  ? 'Complete Registration'
                  : 'Login to AgriCare AI'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <p className="text-center text-xs text-slate-400 font-medium">
              Demo credentials pre-filled — just click Login
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Your data is protected under India's DPDP Act 2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
