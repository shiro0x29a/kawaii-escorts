import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export function useMyProfiles() {
  const { user, token } = useAuthStore();

  return useQuery({
    queryKey: ['myProfiles', user?.id],
    queryFn: () => {
      if (!user?.id || !token) return Promise.resolve([]);
      return api.profiles.getMy(user.id, token);
    },
    enabled: !!user?.id && !!token,
  });
}
