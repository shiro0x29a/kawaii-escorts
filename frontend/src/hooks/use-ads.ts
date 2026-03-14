import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAds(filters?: {
  cityId?: number;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: () => api.profiles.getAll(filters),
  });
}

export function useAd(id: number) {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => api.profiles.getOne(id),
    enabled: !!id,
  });
}
