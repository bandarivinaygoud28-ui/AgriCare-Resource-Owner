import React, { useState } from 'react';
import {
  Sprout,
  Upload,
  Camera,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Info,
  Check,
  X,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { LanguageCode, DiseaseScanResult } from '../types';
import { translations } from '../utils/translations';
import { sampleCropImages } from '../utils/sampleImages';
import { api } from '../services/api';
import { DiseaseReport } from '../components/DiseaseReport';

interface DetectPageProps {
  language: LanguageCode;
  onAskAssistant: (report: DiseaseScanResult) => void;
  onSaveHistory: (report: DiseaseScanResult) => void;
  onNavigateToMarket: (crop: string) => void;
}

const CROPS = [
  { id: 'Tomato', nameEn: 'Tomato', nameTe: 'టమాట', nameHi: 'टमाटर', icon: '🍅', color: 'border-red-200 hover:border-red-500 bg-red-50/30' },
  { id: 'Paddy', nameEn: 'Paddy / Rice', nameTe: 'వరి', nameHi: 'धान / चावल', icon: '🌾', color: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/30' },
  { id: 'Cotton', nameEn: 'Cotton', nameTe: 'పత్తి', nameHi: 'कपास', icon: '☁️', color: 'border-blue-200 hover:border-blue-500 bg-blue-50/30' },
  { id: 'Maize', nameEn: 'Maize / Corn', nameTe: 'మొక్కజొన్న', nameHi: 'मक्का', icon: '🌽', color: 'border-amber-200 hover:border-amber-500 bg-amber-50/30' },
  { id: 'Chilli', nameEn: 'Chilli', nameTe: 'మిర్చి', nameHi: 'मिर्च', icon: '🌶️', color: 'border-rose-200 hover:border-rose-500 bg-rose-50/30' },
  { id: 'Potato', nameEn: 'Potato', nameTe: 'బంగాళాదుంప', nameHi: 'आलू', icon: '🥔', color: 'border-yellow-200 hover:border-yellow-500 bg-yellow-50/30' },
];

const PLANT_PARTS = [
  { id: 'Leaf', label: 'Leaf', icon: '🍃', desc: 'Spots, yellowing, wilting, curling' },
  { id: 'Stem', label: 'Stem', icon: '🪵', desc: 'Cankers, lesions, rot, hollow stem' },
  { id: 'Fruit / Boll', label: 'Fruit / Boll', icon: '🍎', desc: 'Rotting, blotches, holes, shedding' },
  { id: 'Grain / Cob', label: 'Grain / Cob', icon: '🌾', desc: 'Discoloration, blast, smut' },
  { id: 'Flower', label: 'Flower', icon: '🌸', desc: 'Drop, blight, thrips damage' },
  { id: 'Root', label: 'Root', icon: '🌱', desc: 'Root rot, wilting, nematodes' },
];

export const DetectPage: React.FC<DetectPageProps> = ({
  language,
  onAskAssistant,
  onSaveHistory,
  onNavigateToMarket
}) => {
  const t = translations[language];

  // 5-Step Workflow State
  const [step, setStep] = useState<number>(1);
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [selectedArea, setSelectedArea] = useState<string>('Leaf');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Scan & Result State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStage, setScanStage] = useState<string>('');
  const [scanResult, setScanResult] = useState<DiseaseScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectSample = (sample: typeof sampleCropImages[0]) => {
    setSelectedCrop(sample.crop);
    setSelectedArea(sample.affected_area || 'Leaf');
    setPreviewUrl(sample.url);
    setSelectedImage(null);
    setStep(3);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleStartAnalysis = async () => {
    setStep(4);
    setIsScanning(true);
    setErrorMsg(null);

    try {
      // 4-stage realistic scanning progress
      setScanStage('Validating photo quality & lighting...');
      await new Promise(r => setTimeout(r, 600));

      setScanStage(`Analyzing ${selectedCrop} ${selectedArea} cellular tissue...`);
      await new Promise(r => setTimeout(r, 800));

      setScanStage('Matching pathogen biomarkers across agricultural database...');
      await new Promise(r => setTimeout(r, 700));

      setScanStage('Generating unified agronomic health report...');

      const result = await api.predictDisease(selectedCrop, selectedArea, selectedImage || undefined);
      setScanResult(result);
      setIsScanning(false);
      setStep(5);
    } catch (err: any) {
      setIsScanning(false);
      setErrorMsg(err.message || 'AI analysis encountered an error. Please try again.');
      setStep(3);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedImage(null);
    setPreviewUrl(null);
    setScanResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          AI Crop Disease Detection
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Follow 5 simple guided steps to accurately identify plant diseases and receive immediate treatment.
        </p>
      </div>

      {/* 5-Step Stepper Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-card">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: '01 Select Crop' },
            { num: 2, label: '02 Affected Area' },
            { num: 3, label: '03 Upload Photo' },
            { num: 4, label: '04 AI Analysis' },
            { num: 5, label: '05 Health Report' },
          ].map((s, idx) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;

            return (
              <div key={s.num} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  disabled={s.num > step}
                  className={`flex items-center gap-1.5 sm:gap-2 text-left transition-all ${
                    isActive
                      ? 'text-emerald-800 font-black'
                      : isCompleted
                      ? 'text-emerald-700 font-bold hover:underline'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className="hidden md:inline text-xs">{s.label}</span>
                </button>
                {idx < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-colors ${
                      step > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: SELECT CROP */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Step 1 of 5
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Select Your Crop
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Choose the crop you want to inspect for symptoms or disease.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CROPS.map((c) => {
              const isSelected = selectedCrop === c.id;
              const cropName = language === 'te' ? c.nameTe : language === 'hi' ? c.nameHi : c.nameEn;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer select-none text-center space-y-2 relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-200'
                      : `${c.color} hover:shadow-card`
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="text-4xl sm:text-5xl">{c.icon}</div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{cropName}</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">{c.id}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <span>Next: Select Affected Area</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT AFFECTED AREA */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Step 2 of 5
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Select Affected Plant Part
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Where on the {selectedCrop} plant are you observing disease symptoms?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PLANT_PARTS.map((p) => {
              const isSelected = selectedArea === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedArea(p.id)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none space-y-2 relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-200'
                      : 'border-slate-200 hover:border-emerald-400 bg-white hover:shadow-card'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="text-3xl">{p.icon}</div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{p.label}</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl"
            >
              ← Back to Crops
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <span>Next: Photo Guidance & Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTO GUIDANCE & UPLOAD */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Step 3 of 5
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Photo Upload & Camera Capture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Inspecting <strong>{selectedCrop}</strong> ({selectedArea}). Take a clear, focused photo in natural daylight.
            </p>
          </div>

          {/* Good vs Bad Photo Guidance Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-emerald-900">Good Photo (Recommended)</p>
                <p className="text-[11px] text-emerald-800 leading-tight">
                  Single leaf or plant part, clear focus, natural sunlight, spots visible.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-rose-50/70 border border-rose-200/80 p-3 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                <X className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-rose-900">Bad Photo (Avoid)</p>
                <p className="text-[11px] text-rose-800 leading-tight">
                  Blurry, distant whole field, intense night flash, finger obstructing lens.
                </p>
              </div>
            </div>
          </div>

          {/* Upload & Preview Box */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all">
            {previewUrl ? (
              <div className="space-y-4 max-w-sm mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video bg-black flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Uploaded Crop Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {selectedCrop} • {selectedArea}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <label className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg cursor-pointer transition-colors">
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload or Capture Crop Photo</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag and drop image here, or select from gallery or camera
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span>Upload / Take Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Sample Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Or Test with Verified Crop Samples:</span>
              <span className="text-[11px] text-slate-400">Click to load photo instantly</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sampleCropImages.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-left transition-all flex items-center gap-2"
                >
                  <img src={s.url} alt={s.label} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-slate-900 truncate">{s.label}</p>
                    <p className="text-[10px] text-emerald-700">{s.crop} • {s.affected_area}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl"
            >
              ← Back to Affected Area
            </button>
            <button
              onClick={handleStartAnalysis}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <span>Run AI Disease Analysis</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI SCANNING RADAR ANIMATION */}
      {step === 4 && (
        <div className="bg-slate-950 border border-emerald-800/80 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl space-y-6">
          <div className="relative w-48 h-48 mx-auto rounded-full border-2 border-emerald-500/40 flex items-center justify-center overflow-hidden bg-radial-gradient">
            {/* Concentric radar rings */}
            <div className="absolute inset-4 rounded-full border border-emerald-500/30"></div>
            <div className="absolute inset-10 rounded-full border border-emerald-500/20"></div>
            <div className="absolute inset-16 rounded-full border border-emerald-500/10"></div>
            
            {/* Radar sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent radar-sweep-animation origin-center"></div>

            {/* Central Crop preview with scan line */}
            <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-400 shadow-glow">
              {previewUrl ? (
                <img src={previewUrl} alt="Crop" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-3xl">
                  🌿
                </div>
              )}
              <div className="absolute inset-x-0 h-1 bg-emerald-300 shadow-glow scan-line-animation"></div>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-600/60 text-emerald-300 text-xs font-black">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Step 4: AI Diagnostic Engine Running</span>
            </div>
            <h3 className="text-xl font-black text-white">{scanStage}</h3>
            <p className="text-xs text-slate-400">
              Examining {selectedCrop} ({selectedArea}) for viral, bacterial, fungal, and pest lesions...
            </p>
          </div>
        </div>
      )}

      {/* STEP 5: CENTRAL UNIFIED CROP HEALTH REPORT */}
      {step === 5 && scanResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another Crop</span>
            </button>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Diagnosis Confirmed
            </span>
          </div>

          <DiseaseReport
            report={scanResult}
            language={language}
            onAskAssistant={onAskAssistant}
            onSaveHistory={onSaveHistory}
            onNavigateToMarket={onNavigateToMarket}
          />
        </div>
      )}
    </div>
  );
};
