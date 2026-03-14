const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ user: { id: string; email: string; role: string }; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (username: string, email: string, password: string) =>
      fetchApi<{ user: { id: string; email: string; role: string }; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
  },

  // Cities
  cities: {
    getAll: (lang: 'en' | 'ru' = 'en') =>
      fetchApi<{ id: number; name: string; slug: string }[]>(`/cities?lang=${lang}`),
    getBySlug: (slug: string) =>
      fetchApi<{ id: number; nameEn: string; nameRu: string; slug: string }>(`/cities/${slug}`),
  },

  // Profiles
  profiles: {
    getAll: (params?: {
      cityId?: number;
      gender?: string;
      minAge?: number;
      maxAge?: number;
      page?: number;
      limit?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.cityId) searchParams.set('cityId', String(params.cityId));
      if (params?.gender) searchParams.set('gender', params.gender);
      if (params?.minAge) searchParams.set('minAge', String(params.minAge));
      if (params?.maxAge) searchParams.set('maxAge', String(params.maxAge));
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));

      return fetchApi<{
        data: any[];
        pagination: { page: number; limit: number; total: number; pages: number };
      }>(`/profiles?${searchParams.toString()}`);
    },
    getOne: (id: number) =>
      fetchApi<any>(`/profiles/${id}`),
  },

  // Search
  search: {
    query: (params: {
      city?: string;
      minAge?: number;
      maxAge?: number;
      gender?: string;
      lang?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params.city) searchParams.set('city', params.city);
      if (params.minAge) searchParams.set('minAge', String(params.minAge));
      if (params.maxAge) searchParams.set('maxAge', String(params.maxAge));
      if (params.gender) searchParams.set('gender', params.gender);
      if (params.lang) searchParams.set('lang', params.lang);

      return fetchApi<{
        data: any[];
        pagination: { page: number; limit: number; total: number; pages: number };
      }>(`/search?${searchParams.toString()}`);
    },
  },

  // Cart
  cart: {
    get: (sessionId?: string) =>
      fetchApi<{ items: any[]; total: number }>(`/cart${sessionId ? `?sessionId=${sessionId}` : ''}`),
    add: (data: { profileId: number; plan: string; price: number; sessionId?: string }) =>
      fetchApi<any>('/cart', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      fetchApi<void>(`/cart/${id}`, { method: 'DELETE' }),
    clear: (sessionId?: string) =>
      fetchApi<void>(`/cart${sessionId ? `?sessionId=${sessionId}` : ''}`, { method: 'DELETE' }),
  },

  // Payments
  payments: {
    create: (data: { profileId: number; amount: number; currency?: string; sessionId?: string }) =>
      fetchApi<any>('/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    checkout: (paymentId: string, successUrl: string, cancelUrl: string) =>
      fetchApi<{ sessionId: string; url: string }>('/payments/${paymentId}/checkout', {
        method: 'POST',
      }),
  },
};
