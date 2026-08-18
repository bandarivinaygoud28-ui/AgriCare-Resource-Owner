import React, { useState } from 'react';
import { NewsArticle, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { Calendar, Building, X, ArrowRight } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  language: LanguageCode;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, language }) => {
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="glass-card overflow-hidden flex flex-col bg-white border border-slate-200 hover:border-emerald-300 transition-all group">
        {/* News Thumbnail */}
        <div className="h-44 w-full relative overflow-hidden bg-slate-100">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
            {t.newsCategories[article.category] || article.category}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 line-clamp-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {article.source}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-slate-600 text-xs mt-2 leading-relaxed line-clamp-3">
              {article.summary}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 pt-2 transition-colors"
          >
            <span>{t.readMore}</span>
          </button>
        </div>
      </div>

      {/* Full Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-3 inline-block">
              {t.newsCategories[article.category] || article.category}
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              {article.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
              <span>🗓️ {article.date}</span>
              <span>•</span>
              <span>🏛️ {article.source}</span>
            </div>

            <div className="w-full h-56 rounded-2xl overflow-hidden mb-5">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-normal">
              <p className="font-semibold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {article.summary}
              </p>
              <p>{article.content}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
