import React from 'react';
import { MarketPriceRecord } from '../types';
import { MapPin, Building, Calendar, ArrowRight } from 'lucide-react';

interface MarketPriceCardProps {
  record: MarketPriceRecord;
}

export const MarketPriceCard: React.FC<MarketPriceCardProps> = ({ record }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <h4 className="font-extrabold text-sm text-slate-900">{record.commodity}</h4>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {record.arrival_date}
        </span>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{record.market} (APMC)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{record.district}, {record.state}</span>
        </div>
      </div>

      <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-2.5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Modal Price
          </span>
          <span className="text-base font-black text-emerald-800">
            ₹{record.modal_price?.toLocaleString()} / Qtl
          </span>
        </div>

        <div className="text-right text-[11px] font-semibold text-slate-600">
          <span>Range: ₹{record.min_price} – ₹{record.max_price}</span>
        </div>
      </div>
    </div>
  );
};
