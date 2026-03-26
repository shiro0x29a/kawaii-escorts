import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useCities(lang: 'en' | 'ru' = 'en') {
  return useQuery({
    queryKey: ['cities', lang],
    queryFn: () => api.cities.getAll(lang),
  });
}

export function useCity(slug: string) {
  return useQuery({
    queryKey: ['city', slug],
    queryFn: () => api.cities.getBySlug(slug),
    enabled: !!slug,
  });
}
