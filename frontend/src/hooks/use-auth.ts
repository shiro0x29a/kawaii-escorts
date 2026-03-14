import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export function useLogin() {
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.login(email, password),
    onSuccess: ({ user, token }) => {
      setUser(user);
      setToken(token);
    },
  });
}

export function useRegister() {
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      api.auth.register(username, email, password),
    onSuccess: ({ user, token }) => {
      setUser(user);
      setToken(token);
    },
  });
}
