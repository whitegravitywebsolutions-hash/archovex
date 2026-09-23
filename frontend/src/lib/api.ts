import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('archovex_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper fetchers for Server Components & Metadata
export async function fetchPublicData(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error(`Fetch error for ${endpoint}:`, err);
    return null;
  }
}

export function getImageUrl(url?: string | null): string {
  if (!url) return '/placeholder.jpg';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const backendOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
}
