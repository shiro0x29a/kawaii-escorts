'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { Input, Button } from '@/components/ui';
import styles from './LoginForm.module.css';

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
      router.push('/');
    } catch (err) {
      setError(t('loginError'));
    }
  };

  if (token) {
    router.push('/');
    return null;
  }

  return (
    <div className={`${styles.formBg} ${styles.active}`}>
      <div className={styles.formWrapper}>
        <div className={styles.iconClose} onClick={() => router.push('/')}>
          ✕
        </div>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>{t('login')}</h2>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
              label={t('email')}
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              label={t('password')}
            />

            <div className={styles.forget}>
              <label>
                <input type="checkbox" /> {t('rememberMe') || 'Remember me'}
              </label>
              <a href="/forgot-password">{t('forgotPassword')}</a>
            </div>

            <Button type="submit" disabled={login.isPending} fullWidth>
              {login.isPending ? t('loading') : t('login')}
            </Button>

            <div className={styles.registerBlock}>
              {t('noAccount')}{' '}
              <a href="/register">{t('register')}</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
