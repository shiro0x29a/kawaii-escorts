'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';
import styles from './login-form.module.css';

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
    <div className={`${styles.formBg} ${styles.active}`}>
      <div className={styles.formWrapper}>
        <div className={styles.iconClose} onClick={() => router.push('/')}>
          ✕
        </div>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>{t('login')}</h2>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>{t('email')}</label>
            </div>

            <div className={styles.inputBox}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>{t('password')}</label>
            </div>

            <div className={styles.forget}>
              <label>
                <input type="checkbox" /> {t('rememberMe') || 'Remember me'}
              </label>
              <a href="/forgot-password">{t('forgotPassword')}</a>
            </div>

            <button type="submit" disabled={login.isPending} className={styles.submitBtn}>
              {login.isPending ? t('loading') : t('login')}
            </button>

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
