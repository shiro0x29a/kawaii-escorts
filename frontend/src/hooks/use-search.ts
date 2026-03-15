import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSearch(params?: {
  city?: string;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  lang?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => api.search.query(params || {}),
    enabled: !!params?.city,
  });
}
