import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building,
  MapPin,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LanguageCode, MarketPriceRecord, MarketSummary } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import { MarketPriceTable } from '../components/MarketPriceTable';
import { MarketPriceCard } from '../components/MarketPriceCard';

interface MarketPricesPageProps {
  language: LanguageCode;
  initialCrop?: string;
}

const CROPS = ['Tomato', 'Paddy', 'Cotton', 'Maize', 'Chilli', 'Potato', 'Wheat', 'Onion'];
const STATES = ['All States', 'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka', 'Punjab', 'Uttar Pradesh'];

export const MarketPricesPage: React.FC<MarketPricesPageProps> = ({
  language,
  initialCrop = 'Tomato'
}) => {
  const t = translations[language];

  // Filters State
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop);
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [districtQuery, setDistrictQuery] = useState<string>('');
  const [marketQuery, setMarketQuery] = useState<string>('');
  const [trendDays, setTrendDays] = useState<number>(7);

  // Data State
  const [records, setRecords] = useState<MarketPriceRecord[]>([]);
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [historyTrend, setHistoryTrend] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('modal_price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const stateParam = selectedState === 'All States' ? undefined : selectedState;
      const res = await api.getMarketPrices({
        crop: selectedCrop,
        state: stateParam,
        district: districtQuery || undefined,
        market: marketQuery || undefined
      });

      setRecords(res.records || []);
      setSummary(res.summary || null);
      setAiInsight(res.ai_insight || '');
      setIsDemo(res.source === 'Demo Data');

      // Fetch Trend History
      const histRes = await api.getMarketPriceHistory({ crop: selectedCrop, days: trendDays });
      setHistoryTrend(histRes.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop, selectedState, trendDays]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let valA = (a as any)[sortBy];
    let valB = (b as any)[sortBy];
    if (typeof valA === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Market Prices
            </h1>
            {isDemo ? (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                Demo Market Data
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                Live OGD Verified
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            View the latest available agricultural commodity prices from Indian markets.
          </p>
        </div>

        <button
          onClick={fetchPrices}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Prices</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Filter Market Commodities
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Updated Daily</span>
        </div>

        {/* Commodity Pills */}
        <div className="flex flex-wrap gap-2">
          {CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {/* State, District, and Market Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">District (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={districtQuery}
                onChange={(e) => setDistrictQuery(e.target.value)}
                placeholder="e.g. Warangal, Guntur"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Market (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={marketQuery}
                onChange={(e) => setMarketQuery(e.target.value)}
                placeholder="e.g. Enumamula, Bowenpally"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
              <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Modal Price</span>
            <p className="text-2xl font-black text-emerald-700">₹{summary.average_price.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500 font-semibold">per Quintal (100 kg)</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Highest Market Price</span>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-black text-emerald-900">₹{summary.highest_price.toLocaleString()}</p>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold truncate block">
              Top Market Rate
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lowest Market Price</span>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-black text-slate-800">₹{summary.lowest_price.toLocaleString()}</p>
              <ArrowDownRight className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-[10px] text-slate-500 font-semibold truncate block">
              Floor Market Rate
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Markets Reporting</span>
            <p className="text-2xl font-black text-slate-900">{records.length}</p>
            <span className="text-[10px] text-slate-500 font-semibold">Last Updated: {summary.last_updated}</span>
          </div>
        </div>
      )}

      {/* AI Market Insight Card */}
      {aiInsight && (
        <div className="bg-gradient-to-r from-emerald-900 to-forest-900 text-white rounded-2xl p-5 shadow-md flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
              AI Market Intelligence Insight
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/95 font-medium leading-relaxed">
              {aiInsight}
            </p>
          </div>
        </div>
      )}

      {/* Historical Price Trend Chart Box */}
      {historyTrend.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                {selectedCrop} Price Trend Analysis
              </h3>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setTrendDays(7)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  trendDays === 7 ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                7-Day Trend
              </button>
              <button
                onClick={() => setTrendDays(30)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  trendDays === 30 ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                30-Day Trend
              </button>
            </div>
          </div>

          {/* Simple Visual SVG Chart */}
          <div className="h-40 w-full flex items-end gap-2 pt-4 px-2">
            {historyTrend.map((point, idx) => {
              const maxPrice = Math.max(...historyTrend.map(p => p.price));
              const minPrice = Math.min(...historyTrend.map(p => p.price));
              const heightPct = Math.max(20, Math.round(((point.price - minPrice + 200) / (maxPrice - minPrice + 400)) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    ₹{point.price} ({point.date})
                  </div>
                  <div
                    className="w-full bg-emerald-600 group-hover:bg-emerald-500 rounded-t-md transition-all shadow-xs"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-slate-400 font-semibold truncate w-full text-center hidden sm:inline">
                    {point.date.slice(0, 5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Table (Desktop) & Cards (Mobile) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
            Market Rate Records ({sortedRecords.length})
          </h3>
          <span className="text-xs text-slate-500 font-semibold">Click column headers to sort</span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <MarketPriceTable
            records={sortedRecords}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-3">
          {sortedRecords.map((r, idx) => (
            <MarketPriceCard key={idx} record={r} />
          ))}
        </div>
      </div>

      {/* Official Attribution Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium space-y-1">
        <p>
          Source: <strong>Government of India Open Government Data (OGD) Platform</strong> (data.gov.in / Agmarknet).
        </p>
        <p className="text-[11px] text-slate-400">
          Modal prices are representative market auction benchmarks recorded by Agricultural Produce Market Committees (APMC).
        </p>
      </div>
    </div>
  );
};
