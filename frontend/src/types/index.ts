export type LanguageCode = 'en' | 'te' | 'hi';

export type CropType = 'Tomato' | 'Paddy' | 'Cotton' | 'Maize' | 'Chilli' | 'Potato';

export type AffectedAreaType = 'Leaf' | 'Stem' | 'Fruit / Boll' | 'Grain / Cob' | 'Flower' | 'Root';

export interface DiseaseScanResult {
  id?: number;
  crop: string;
  affected_area: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'None' | string;
  symptoms: string[];
  cause: string;
  immediate_actions: string[];
  treatment: string[];
  prevention: string[];
  disclaimer?: string;
  weather_risk?: {
    disease_risk: string;
    disease_risk_factors: string[];
    spraying_advisory: string;
    suitable_for_spraying: boolean;
  };
  market_summary?: {
    average_price: number;
    highest_price: number;
    lowest_price: number;
    last_updated: string;
  };
  image_url?: string;
  date?: string;
}

export interface MarketPriceRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  arrival_date: string;
}

export interface MarketSummary {
  average_price: number;
  highest_price: number;
  lowest_price: number;
  last_updated: string;
}

export interface MarketPricesResponse {
  source: string;
  is_live: boolean;
  notice: string;
  commodity: string;
  last_updated: string;
  summary: MarketSummary;
  ai_insight: string;
  records: MarketPriceRecord[];
}

export interface MarketHistoryPoint {
  date: string;
  price: number;
  min_price: number;
  max_price: number;
}

export interface MarketHistoryResponse {
  commodity: string;
  days: number;
  source: string;
  is_live: boolean;
  current_modal_price: number;
  price_change: number;
  percentage_change: number;
  trend: 'Increasing' | 'Decreasing' | 'Stable';
  history: MarketHistoryPoint[];
}

export interface LocationSearchResult {
  name: string;
  district?: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
  formatted_location: string;
  display_name: string;
  source?: string;
}

export interface WeatherData {
  location: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  source?: string;
  is_live?: boolean;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    precipitation?: number;
    cloud_cover?: number;
    condition: string;
    description: string;
    updated_at?: string;
    updated_at_iso?: string;
    foliar_wetness?: {
      status: string;
      description: string;
    };
    spraying_drift?: {
      status: string;
      description: string;
    };
  };
  agricultural_advisory: {
    disease_risk: string;
    disease_risk_factors: string[];
    spraying_advisory: string;
    suitable_for_spraying: boolean;
    crop?: string;
  };
  forecast: Array<{
    date: string;
    day: string;
    temp_max: number;
    temp_min: number;
    condition: string;
    description: string;
    humidity: number;
    pop: number;
  }>;
}

export interface FarmerProfile {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  state: string;
  district: string;
  location: string;
  main_crops: string;
  preferred_language: LanguageCode;
}

export interface NewsArticle {
  id: string | number;
  category: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  date: string;
  url?: string;
  image_url: string;
  location_tag?: string;
  crop?: string;
  published_raw?: string;
}

export interface NewsResponse {
  success: boolean;
  articles: NewsArticle[];
  count: number;
  last_updated: string;
  source: string;
  is_live: boolean;
}

export interface FarmResource {
  id: number;
  resource_type: string;
  title: string;
  provider_name: string;
  location: string;
  price: number;
  price_unit: string;
  availability: string;
  contact_phone: string;
  rating: number;
  description: string;
  image_url?: string;
}

export interface BookingRecord {
  id: number;
  resource_id: number;
  resource_title: string;
  resource_type: string;
  provider_name: string;
  contact_phone: string;
  price: number;
  price_unit: string;
  booking_date: string;
  booking_time: string;
  location: string;
  status: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  topic?: string;
  timestamp: string;
  diagnosis_context?: Partial<DiseaseScanResult>;
}
