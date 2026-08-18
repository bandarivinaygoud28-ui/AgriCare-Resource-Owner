import React, { useState, useEffect } from 'react';
import { DiseaseScanResult, LanguageCode, CropType } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import { DiseaseReport } from '../components/DiseaseReport';
import {
  History,
  Scan,
  Calendar,
  Filter,
  Eye,
  X,
  RefreshCw,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface HistoryPageProps {
  language: LanguageCode;
  onAskAssistant: (report: DiseaseScanResult) => void;
  onNavigateToMarket?: (crop: string) => void;
}

const CROP_FILTERS = ['All Crops', 'Tomato', 'Paddy', 'Cotton', 'Maize', 'Chilli', 'Potato'];

export const HistoryPage: React.FC<HistoryPageProps> = ({
  language,
  onAskAssistant,
  onNavigateToMarket
}) => {
  const t = translations[language];

  const [scans, setScans] = useState<DiseaseScanResult[]>([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All Crops');
  const [selectedReportModal, setSelectedReportModal] = useState<DiseaseScanResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await api.getScanHistory();
      setScans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredScans = scans.filter((s) => {
    if (selectedCropFilter === 'All Crops') return true;
    return s.crop.toLowerCase() === selectedCropFilter.toLowerCase();
  });

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'high': return 'badge-high';
      case 'moderate': return 'badge-moderate';
      default: return 'badge-low';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-emerald-300" />
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                Diagnostic Archives
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.navHistory}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl font-medium">
              Review past disease identification scans, symptom timelines, and treatment effectiveness records.
            </p>
          </div>

          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh History</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          {CROP_FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCropFilter(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCropFilter === c
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Grid List */}
      {filteredScans.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-3 bg-white">
          <div className="text-4xl">📸</div>
          <h3 className="font-bold text-slate-800 text-base">No Disease Scans Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't saved any disease diagnoses for this crop filter yet. Use the 5-step detection tool to analyze your crops.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScans.map((scan, idx) => (
            <div
              key={scan.id || idx}
              className="glass-card p-5 bg-white border border-slate-200 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide block">
                      🌾 {scan.crop} ({scan.affected_area})
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {scan.date || 'Recent Scan'}
                    </span>
                  </div>

                  <span className={`badge ${getSeverityBadgeClass(scan.severity)}`}>
                    <Flame className="w-3 h-3" />
                    {scan.severity}
                  </span>
                </div>

                {scan.image_url && (
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100">
                    <img src={scan.image_url} alt={scan.disease} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{scan.disease}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{scan.cause}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700">
                  {Math.round(scan.confidence * 100)}% Confidence
                </span>

                <button
                  onClick={() => setSelectedReportModal(scan)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Report Modal View */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedReportModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <DiseaseReport
              report={selectedReportModal}
              language={language}
              onAskAssistant={onAskAssistant}
              onSaveHistory={() => {}}
              onNavigateToMarket={onNavigateToMarket ?? (() => {})}
            />
          </div>
        </div>
      )}
    </div>
  );
};
