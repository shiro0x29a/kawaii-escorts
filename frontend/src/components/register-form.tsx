'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRegister } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';

export function RegisterForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { token } = useAuthStore();
  const register = useRegister();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwordMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('minLength').replace('{min}', '6'));
      return;
    }

    try {
      await register.mutateAsync({ email, password });
      router.push('/profiles');
    } catch (err) {
      setError(t('registerError'));
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('confirmPassword')}
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-pink-400 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={register.isPending}
        className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-medium disabled:opacity-50"
      >
        {register.isPending ? t('loading') : t('register')}
      </button>

      <p className="text-center text-sm text-gray-600">
        {t('hasAccount')}{' '}
        <a href="/login" className="text-pink-600 hover:underline">
          {t('login')}
        </a>
      </p>
    </form>
  );
}
