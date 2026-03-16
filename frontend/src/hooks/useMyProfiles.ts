import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

interface UseMyProfilesOptions {
  page?: number;
  limit?: number;
}

export function useMyProfiles(options: UseMyProfilesOptions = {}) {
  const { page = 1, limit = 10 } = options;
  const { user, token } = useAuthStore();

  return useQuery({
    queryKey: ['myProfiles', user?.id, page, limit],
    queryFn: () => {
      if (!user?.id || !token) return Promise.resolve({ data: [], pagination: { page, limit, total: 0, pages: 0 } });
      return api.profiles.getMy(user.id, token, { page, limit });
    },
    enabled: !!user?.id && !!token,
  });
}
