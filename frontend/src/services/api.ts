import {
  DiseaseScanResult,
  MarketPricesResponse,
  MarketHistoryResponse,
  WeatherData,
  LocationSearchResult,
  FarmerProfile,
  NewsArticle,
  NewsResponse,
  FarmResource,
  BookingRecord,
  LanguageCode
} from '../types';

const API_BASE = 'https://hv2026-0051-vortex-backend.onrender.com/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('agricare_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth & Profile
  async login(phone: string, password: string) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('agricare_token', data.access_token);
      localStorage.setItem('agricare_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(farmerData: Partial<FarmerProfile> & { password: string }) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('agricare_token', data.access_token);
      localStorage.setItem('agricare_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getProfile(): Promise<FarmerProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(data: Partial<FarmerProfile>): Promise<any> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // AI Disease Detection
  async predictDisease(crop: string, affected_area: string = "Leaf", file?: File): Promise<DiseaseScanResult> {
    const formData = new FormData();
    formData.append('crop', crop);
    formData.append('affected_area', affected_area);
    if (file) {
      formData.append('image', file);
    }

    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    if (!res.ok) throw new Error('Disease prediction failed');
    return res.json();
  },

  async predictDiseaseJson(crop: string, affected_area: string = "Leaf", image_url?: string, image_base64?: string): Promise<DiseaseScanResult> {
    const res = await fetch(`${API_BASE}/predict/json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ crop, affected_area, image_url, image_base64 })
    });
    if (!res.ok) throw new Error('Disease prediction failed');
    return res.json();
  },

  async saveScan(scanData: DiseaseScanResult): Promise<any> {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(scanData)
    });
    if (!res.ok) throw new Error('Failed to save scan to history');
    return res.json();
  },

  async getScanHistory(): Promise<DiseaseScanResult[]> {
    const res = await fetch(`${API_BASE}/history`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch scan history');
    return res.json();
  },

  async getAdvisory(crop: string = "Tomato"): Promise<any> {
    const res = await fetch(`${API_BASE}/advisory?crop=${encodeURIComponent(crop)}`);
    if (!res.ok) throw new Error('Failed to fetch advisory');
    return res.json();
  },

  // Market Prices (Strictly "Market Prices")
  async getMarketPrices(params: {
    crop?: string;
    state?: string;
    district?: string;
    market?: string;
    date?: string;
  }): Promise<MarketPricesResponse> {
    const query = new URLSearchParams();
    if (params.crop) query.append('crop', params.crop);
    if (params.state) query.append('state', params.state);
    if (params.district) query.append('district', params.district);
    if (params.market) query.append('market', params.market);
    if (params.date) query.append('date', params.date);

    const res = await fetch(`${API_BASE}/market-prices?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch market prices');
    return res.json();
  },

  async getMarketPriceHistory(params: {
    crop?: string;
    state?: string;
    district?: string;
    market?: string;
    days?: number;
  }): Promise<MarketHistoryResponse> {
    const query = new URLSearchParams();
    if (params.crop) query.append('crop', params.crop);
    if (params.state) query.append('state', params.state);
    if (params.district) query.append('district', params.district);
    if (params.market) query.append('market', params.market);
    query.append('days', String(params.days || 7));

    const res = await fetch(`${API_BASE}/market-prices/history?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch market price history');
    return res.json();
  },

  // Location & Geocoding
  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await fetch(`${API_BASE}/location/search?query=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Direct Geocoding fallback if backend is unreachable
    }

    try {
      const directUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
      const directRes = await fetch(directUrl);
      if (directRes.ok) {
        const d = await directRes.json();
        return (d.results || []).map((it: any) => ({
          name: it.name,
          district: it.admin2 || it.admin1 || it.name,
          state: it.admin1 || it.country || 'India',
          country: it.country || 'India',
          lat: it.latitude,
          lon: it.longitude,
          formatted_location: it.admin1 ? `${it.name}, ${it.admin1}` : it.name,
          display_name: [it.name, it.admin2, it.admin1, it.country].filter(Boolean).join(', '),
          source: 'Open-Meteo Geocoding'
        }));
      }
    } catch (err) {
      console.warn('Geocoding fallback error:', err);
    }
    return [];
  },

  async reverseGeocode(lat: number, lon: number): Promise<{
    formatted_location: string;
    city: string;
    district: string;
    state: string;
    country: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/location/reverse?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Direct reverse geocoding fallback
    }

    try {
      const directUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      const directRes = await fetch(directUrl, { headers: { 'User-Agent': 'AgriCareAI/2.0' } });
      if (directRes.ok) {
        const d = await directRes.json();
        const a = d.address || {};
        const city = a.village || a.town || a.city || a.suburb || a.county || 'Local Farm';
        const state = a.state || 'India';
        return {
          formatted_location: `${city}, ${state}`,
          city,
          district: a.state_district || a.county || city,
          state,
          country: a.country || 'India'
        };
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    }

    return {
      formatted_location: `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      city: 'Farm Location',
      district: 'Regional District',
      state: 'India',
      country: 'India'
    };
  },

  // Weather
  async getWeather(params: {
    location?: string;
    lat?: number;
    lon?: number;
    crop?: string;
  }): Promise<WeatherData> {
    const query = new URLSearchParams();
    if (params.location) query.append('location', params.location);
    if (params.lat !== undefined) query.append('lat', String(params.lat));
    if (params.lon !== undefined) query.append('lon', String(params.lon));
    if (params.crop) query.append('crop', params.crop);

    try {
      const res = await fetch(`${API_BASE}/weather?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Direct live meteorological fallback if backend is unreachable
    }

    // Direct Live Open-Meteo fetch fallback
    const lat = params.lat ?? 17.9689;
    const lon = params.lon ?? 79.5941;
    const cropName = params.crop || 'Tomato';
    const directWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_mean&timezone=auto`;
    
    const dRes = await fetch(directWeatherUrl);
    if (!dRes.ok) throw new Error('Live weather service unreachable');
    const dJson = await dRes.json();
    const curr = dJson.current || {};
    const temp = Math.round((curr.temperature_2m ?? 30.0) * 10) / 10;
    const feelsLike = Math.round((curr.apparent_temperature ?? temp) * 10) / 10;
    const humidity = Math.round(curr.relative_humidity_2m ?? 65);
    const windSpeed = Math.round((curr.wind_speed_10m ?? 8.0) * 10) / 10;
    const precipitation = Math.round((curr.precipitation ?? 0.0) * 10) / 10;
    const cloudCover = Math.round(curr.cloud_cover ?? 20);

    const isRiskHigh = (humidity >= 75 || precipitation > 0) && (temp >= 20 && temp <= 32);
    const canSpray = windSpeed <= 14 && humidity <= 85 && precipitation <= 0.2;

    return {
      location: params.location || `Coordinates (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      coordinates: { lat, lon },
      source: 'Open-Meteo Live Meteorological Station',
      is_live: true,
      current: {
        temp,
        feels_like: feelsLike,
        humidity,
        wind_speed: windSpeed,
        precipitation,
        cloud_cover: cloudCover,
        condition: precipitation > 0 ? 'Light Rain / Drizzle' : cloudCover > 50 ? 'Partly Cloudy' : 'Clear / Sunny',
        description: precipitation > 0 ? 'Passing showers with moist canopy' : 'Fair agricultural sky with sunlight',
        updated_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        foliar_wetness: {
          status: humidity >= 75 || precipitation > 0 ? 'High' : 'Moderate',
          description: `${humidity}% relative humidity with ${precipitation} mm precipitation.`
        },
        spraying_drift: {
          status: windSpeed > 15 ? 'Severe Drift Hazard' : windSpeed > 10 ? 'Moderate Drift' : 'Low Drift (Optimal)',
          description: `Wind speed is ${windSpeed} km/h.`
        }
      },
      agricultural_advisory: {
        disease_risk: isRiskHigh ? 'High' : 'Low',
        disease_risk_factors: [
          `Relative humidity (${humidity}%) and temperature (${temp}°C) influence pathogen progression in ${cropName}.`,
          `Wind velocity (${windSpeed} km/h) affects chemical spray droplet dispersion.`
        ],
        spraying_advisory: canSpray ? 'Optimal conditions for foliar nutrient and chemical spraying.' : `Caution: Wind speed (${windSpeed} km/h) or moisture creates drift/wash-off risk.`,
        suitable_for_spraying: canSpray,
        crop: cropName
      },
      forecast: (dJson.daily?.time || []).slice(0, 5).map((d: string, idx: number) => ({
        date: d,
        day: new Date(d).toLocaleDateString('en-US', { weekday: 'short' }),
        temp_max: Math.round(dJson.daily.temperature_2m_max[idx] ?? temp + 2),
        temp_min: Math.round(dJson.daily.temperature_2m_min[idx] ?? temp - 6),
        condition: (dJson.daily.precipitation_probability_max[idx] || 0) > 40 ? 'Light Rain' : 'Partly Cloudy',
        description: 'Daily agro-meteorological prediction',
        humidity: Math.round(dJson.daily.relative_humidity_2m_mean[idx] ?? humidity),
        pop: Math.round(dJson.daily.precipitation_probability_max[idx] ?? 10)
      }))
    };
  },

  // AI Farmer Assistant
  async askAssistant(
    message: string,
    language: LanguageCode = 'en',
    diagnosis_context?: Partial<DiseaseScanResult>,
    location?: string
  ): Promise<{ response: string; topic: string; language: string }> {
    const res = await fetch(`${API_BASE}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, diagnosis_context, location })
    });
    if (!res.ok) throw new Error('Assistant communication failed');
    return res.json();
  },

  // Real-Time Agricultural Market News
  async getNews(params: {
    category?: string;
    filter?: string;
    search?: string;
    location?: string;
    language?: LanguageCode;
    limit?: number;
    force_refresh?: boolean;
  }): Promise<NewsResponse> {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.filter) query.append('filter', params.filter);
    if (params.search) query.append('search', params.search);
    if (params.location) query.append('location', params.location);
    if (params.language) query.append('language', params.language);
    if (params.limit) query.append('limit', String(params.limit));
    if (params.force_refresh) query.append('force_refresh', 'true');

    try {
      const res = await fetch(`${API_BASE}/news?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.articles)) {
          return data;
        } else if (Array.isArray(data)) {
          return {
            success: true,
            articles: data,
            count: data.length,
            last_updated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            source: 'Indian Agricultural Feeds',
            is_live: true
          };
        }
      }
    } catch {
      // Direct live RSS fallback if backend is unreachable
    }

    // Direct RSS fallback from Google News Agriculture RSS
    const searchTerms = ['India', 'agriculture'];
    if (params.location) searchTerms.push(params.location.split(',').pop()?.trim() || '');
    if (params.search) searchTerms.push(params.search);
    if (params.category && params.category !== 'All') searchTerms.push(params.category.replace(/[^\w\s]/g, '').trim());
    if (params.filter && params.filter !== 'All') searchTerms.push(params.filter);

    const qStr = searchTerms.filter(Boolean).join(' ') || 'India agriculture mandi MSP commodity prices';
    const rssUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://news.google.com/rss/search?q=${encodeURIComponent(qStr)}&hl=en-IN&gl=IN&ceid=IN:en`)}`;

    try {
      const directRes = await fetch(rssUrl);
      if (directRes.ok) {
        const xmlText = await directRes.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, params.limit || 20);

        const parsedArticles: NewsArticle[] = items.map((item, idx) => {
          const fullTitle = item.querySelector('title')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const desc = item.querySelector('description')?.textContent?.replace(/<[^>]*>/g, '') || fullTitle;
          const title = fullTitle.includes(' - ') ? fullTitle.split(' - ')[0] : fullTitle;
          const source = fullTitle.includes(' - ') ? fullTitle.split(' - ').pop() || 'Agri News' : 'Agri News';

          return {
            id: `rss_${idx}_${Date.now()}`,
            title,
            summary: desc,
            content: desc,
            category: params.category && params.category !== 'All' ? params.category : '📈 Mandi / Commodity Market',
            source,
            date: pubDate ? new Date(pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
            url: link,
            image_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
            location_tag: params.location ? `📍 ${params.location.split(',').pop()?.trim()}` : '🇮🇳 National'
          };
        });

        if (parsedArticles.length > 0) {
          return {
            success: true,
            articles: parsedArticles,
            count: parsedArticles.length,
            last_updated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            source: 'Live Google News Indian Agriculture Feed',
            is_live: true
          };
        }
      }
    } catch (rssErr) {
      console.warn('RSS client fallback error:', rssErr);
    }

    throw new Error('Unable to fetch the latest market news. Please try again.');
  },

  // Farm Resources & Booking
  async getResources(params: {
    resource_type?: string;
    location?: string;
  }): Promise<FarmResource[]> {
    const query = new URLSearchParams();
    if (params.resource_type) query.append('resource_type', params.resource_type);
    if (params.location) query.append('location', params.location);

    const res = await fetch(`${API_BASE}/resources?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  async checkAvailability(resource_id: number, date: string): Promise<any> {
    const res = await fetch(`${API_BASE}/resources/availability?resource_id=${resource_id}&date=${encodeURIComponent(date)}`);
    if (!res.ok) throw new Error('Failed to check availability');
    return res.json();
  },

  async bookResource(bookingData: {
    farmer_name: string;
    farmer_phone: string;
    resource_id: number;
    booking_date: string;
    booking_time: string;
    location: string;
    notes?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/resources/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to book resource');
    return res.json();
  },

  async getBookings(farmer_id?: number, phone?: string): Promise<BookingRecord[]> {
    const query = new URLSearchParams();
    if (farmer_id) query.append('farmer_id', String(farmer_id));
    if (phone) query.append('phone', phone);

    const res = await fetch(`${API_BASE}/resources/bookings?${query.toString()}`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  }
};
