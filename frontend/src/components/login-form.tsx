'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';

export function LoginForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { token } = useAuthStore();
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login.mutateAsync({ email, password });
      router.push('/profiles');
    } catch (err) {
      setError(t('loginError'));
    }
  };

  if (token) {
    router.push('/profiles');
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-400 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('password')}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-400 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-medium disabled:opacity-50"
      >
        {login.isPending ? t('loading') : t('login')}
      </button>

      <p className="text-center text-sm text-gray-600">
        {t('noAccount')}{' '}
        <a href="/register" className="text-pink-600 hover:underline">
          {t('register')}
        </a>
      </p>
    </form>
  );
}
