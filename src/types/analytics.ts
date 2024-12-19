export interface LocationData {
  country_name: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface Analytics {
  id: string;
  page_slug: string;
  ip_address: string | null;
  location: LocationData | null;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
}