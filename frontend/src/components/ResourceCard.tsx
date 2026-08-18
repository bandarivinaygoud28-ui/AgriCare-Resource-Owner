import React from 'react';
import { FarmResource, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { MapPin, Phone, Star, CheckCircle2, ShieldCheck, Tractor } from 'lucide-react';

interface ResourceCardProps {
  resource: FarmResource;
  language: LanguageCode;
  onBook: (resource: FarmResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, language, onBook }) => {
  const t = translations[language];

  return (
    <div className="glass-card overflow-hidden flex flex-col bg-white border border-slate-200 hover:border-emerald-400 transition-all">
      {/* Resource Image */}
      <div className="h-44 w-full relative overflow-hidden bg-slate-100">
        <img
          src={resource.image_url || "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80"}
          alt={resource.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs">
          {resource.resource_type}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{resource.rating}</span>
        </div>
      </div>

      {/* Resource Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-1">
            {resource.title}
          </h3>
          
          <p className="text-xs text-slate-500 font-semibold mt-1">
            By {resource.provider_name}
          </p>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          <div className="mt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{resource.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{resource.contact_phone}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Booking Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-emerald-800">₹{resource.price}</span>
              <span className="text-xs text-slate-500 font-medium">/{resource.price_unit}</span>
            </div>
          </div>

          <button
            onClick={() => onBook(resource)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>{t.bookNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
