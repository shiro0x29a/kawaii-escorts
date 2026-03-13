import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProfiles(filters?: {
  cityId?: number;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['profiles', filters],
    queryFn: () => api.profiles.getAll(filters),
  });
}

export function useProfile(id: number) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => api.profiles.getOne(id),
    enabled: !!id,
  });
}
