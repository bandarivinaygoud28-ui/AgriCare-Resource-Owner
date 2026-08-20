import React, { useState } from 'react';
import { NewsArticle, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { Calendar, Building, X, ExternalLink, MapPin, Eye } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  language: LanguageCode;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, language }) => {
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="glass-card overflow-hidden flex flex-col bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 rounded-2xl group">
        {/* News Thumbnail */}
        <div className="h-44 w-full relative overflow-hidden bg-slate-100">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-emerald-700/50">
            {t.newsCategories[article.category] || article.category}
          </div>

          {article.location_tag && (
            <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/30">
              <span>{article.location_tag}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Meta tags: Date & Source */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-2">
              <span className="flex items-center gap-1 text-slate-600 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 line-clamp-1 text-slate-600 font-semibold">
                <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{article.source}</span>
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
              {article.title}
            </h3>

            {/* Short Summary */}
            <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-3 font-normal">
              {article.summary}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.readMore}</span>
            </button>

            {article.url ? (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95"
              >
                <span>{t.readFullNews}</span>
                <ExternalLink className="w-3 h-3 text-emerald-700" />
              </a>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                <span>{t.readFullNews}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full Article / Summary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative animate-scale-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                {t.newsCategories[article.category] || article.category}
              </span>
              {article.location_tag && (
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {article.location_tag}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 leading-tight">
              {article.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                {article.source}
              </span>
            </div>

            <div className="w-full h-56 rounded-2xl overflow-hidden mb-5">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-normal">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-slate-800 font-medium">
                <h4 className="text-xs uppercase font-extrabold text-emerald-900 tracking-wider mb-1">
                  Live Market Brief
                </h4>
                <p>{article.summary}</p>
              </div>

              {article.content && article.content !== article.summary && (
                <p className="text-slate-600">{article.content}</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Source: {article.source}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>

                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>{t.readFullNews}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
