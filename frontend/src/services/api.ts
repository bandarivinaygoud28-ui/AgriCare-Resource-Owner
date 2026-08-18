import {
  DiseaseScanResult,
  MarketPricesResponse,
  MarketHistoryResponse,
  WeatherData,
  FarmerProfile,
  NewsArticle,
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

    const res = await fetch(`${API_BASE}/weather?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
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

  // Farmer News
  async getNews(params: {
    category?: string;
    language?: LanguageCode;
    search?: string;
    limit?: number;
  }): Promise<NewsArticle[]> {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.language) query.append('language', params.language);
    if (params.search) query.append('search', params.search);
    if (params.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/news?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
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
