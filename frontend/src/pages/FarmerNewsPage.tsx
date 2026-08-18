import React, { useState, useEffect } from 'react';
import { NewsArticle, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { api } from '../services/api';
import { NewsCard } from '../components/NewsCard';
import { Newspaper, Search, RefreshCw } from 'lucide-react';

interface FarmerNewsPageProps {
  language: LanguageCode;
}

const CATEGORIES = [
  "All",
  "Government Schemes",
  "New Farming Technologies",
  "Weather & Agriculture Alerts",
  "Fertilizer & Seed Updates",
  "Market Updates",
  "Crop & Farming Updates"
];

export const FarmerNewsPage: React.FC<FarmerNewsPageProps> = ({ language }) => {
  const t = translations[language];

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNews({
        category: selectedCategory,
        language: language,
        search: searchQuery || undefined
      });
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Newspaper className="w-5 h-5 text-emerald-300" />
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                Official Bulletins & Schemes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t.newsHeader}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl font-medium">
              {t.newsSubtitle}
            </p>
          </div>

          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh News</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {t.newsCategories[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-card p-3.5 bg-white border border-slate-200 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search news by keyword (e.g. PM-Kisan, Drone, Subsidy, Urea)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-2 py-1 text-xs sm:text-sm text-slate-800 bg-transparent focus:outline-none font-medium"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 bg-white">
          <p className="font-semibold text-slate-700">No articles found for this search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} language={language} />
          ))}
        </div>
      )}
    </div>
  );
};
