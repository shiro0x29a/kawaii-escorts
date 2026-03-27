import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface UseMyProfilesOptions {
  page?: number;
  limit?: number;
}

// Define the profile update data interface
interface ProfileUpdateData {
  name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  cityId?: number;
  about?: string;
  languages?: string[];
  tel?: string;
  avatar?: File | string | null;
  photos?: (File | string)[];
}

export function useMyProfiles(options: UseMyProfilesOptions = {}) {
  const { page = 1, limit = 10 } = options;
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();

  // Query for fetching profiles
  const query = useQuery({
    queryKey: ['myProfiles', user?.id, page, limit],
    queryFn: () => {
      if (!user?.id || !token) return Promise.resolve({ data: [], pagination: { page, limit, total: 0, pages: 0 } });
      return api.profiles.getMy(String(user.id), token, { page, limit });
    },
    enabled: !!user?.id && !!token,
  });

  // Mutation for updating a profile
  const updateProfileMutation = useMutation({
    mutationFn: ({ profileId, data }: { profileId: number; data: ProfileUpdateData }) => {
      if (!token) throw new Error('No authentication token');
      return api.profiles.update(profileId, token, data);
    },
    onSuccess: () => {
      // Invalidate and refetch the profiles data
      queryClient.invalidateQueries({ queryKey: ['myProfiles'] });
    },
  });

  // Mutation for deleting a profile
  const deleteProfileMutation = useMutation({
    mutationFn: ({ profileId }: { profileId: number }) => {
      if (!token) throw new Error('No authentication token');
      return api.profiles.delete(profileId, token);
    },
    onSuccess: () => {
      // Invalidate and refetch the profiles data
      queryClient.invalidateQueries({ queryKey: ['myProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['ads'] });
    },
  });

  return {
    ...query,
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
    deleteProfile: deleteProfileMutation.mutate,
    deleteProfileAsync: deleteProfileMutation.mutateAsync,
    isDeleting: deleteProfileMutation.isPending,
    deleteError: deleteProfileMutation.error,
  };
}
