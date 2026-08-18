import React from 'react';
import { CropType, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { CheckCircle2 } from 'lucide-react';

interface CropCardProps {
  crop: CropType;
  isSelected: boolean;
  onSelect: (crop: CropType) => void;
  language: LanguageCode;
}

const CROP_METADATA: Record<CropType, { icon: string; image: string; tag: string }> = {
  Tomato: {
    icon: "🍅",
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=400&auto=format&fit=crop&q=80",
    tag: "Solanaceae"
  },
  Paddy: {
    icon: "🌾",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&auto=format&fit=crop&q=80",
    tag: "Kharif / Rabi"
  },
  Cotton: {
    icon: "☁️",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&auto=format&fit=crop&q=80",
    tag: "Commercial"
  },
  Maize: {
    icon: "🌽",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80",
    tag: "Cereal"
  },
  Chilli: {
    icon: "🌶️",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80",
    tag: "Spice"
  },
  Potato: {
    icon: "🥔",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80",
    tag: "Tuber"
  }
};

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  isSelected,
  onSelect,
  language
}) => {
  const t = translations[language];
  const meta = CROP_METADATA[crop];

  const getTranslatedCropName = (c: CropType) => {
    switch (c) {
      case 'Tomato': return t.cropTomato;
      case 'Paddy': return t.cropPaddy;
      case 'Cotton': return t.cropCotton;
      case 'Maize': return t.cropMaize;
      case 'Chilli': return t.cropChilli;
      case 'Potato': return t.cropPotato;
      default: return c;
    }
  };

  return (
    <div
      onClick={() => onSelect(crop)}
      className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 group bg-white ${
        isSelected
          ? 'border-green-600 shadow-lg ring-4 ring-green-100 scale-[1.02]'
          : 'border-slate-200 hover:border-green-300 hover:shadow-md'
      }`}
    >
      {/* Background Image Header */}
      <div className="h-28 w-full overflow-hidden relative bg-slate-100">
        <img
          src={meta.image}
          alt={crop}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
        
        {/* Selected Check Badge */}
        {isSelected && (
          <div className="absolute top-2.5 right-2.5 bg-green-600 text-white rounded-full p-1 shadow-md">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}

        {/* Category Tag */}
        <span className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
          {meta.tag}
        </span>

        {/* Emoji Icon Float */}
        <div className="absolute bottom-2 left-3 text-2xl drop-shadow-md">
          {meta.icon}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-base">{getTranslatedCropName(crop)}</h4>
          <p className="text-xs text-slate-500 font-medium">
            {language !== 'en' ? crop : 'Select for Diagnosis'}
          </p>
        </div>

        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-green-600 bg-green-600' : 'border-slate-300'
        }`}>
          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
      </div>
    </div>
  );
};
