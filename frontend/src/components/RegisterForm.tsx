'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRegister } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';
import { LangSwitcher } from './LangSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './LoginForm.module.css';

export function RegisterForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { token } = useAuthStore();
  const register = useRegister();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('registerError') || 'Passwords do not match');
      return;
    }

    try {
      await register.mutateAsync({ username, email, password });
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
    <div className={`${styles.formBg} ${styles.active}`}>
      <div className={styles.switchersWrapper}>
        <ThemeSwitcher />
        <LangSwitcher />
      </div>
      <div className={styles.formWrapper}>
        <div className={styles.iconClose} onClick={() => router.push('/')}>
          ✕
        </div>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>{t('register')}</h2>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label>Username</label>
            </div>

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

            <div className={styles.inputBox}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label>{t('confirmPassword')}</label>
            </div>

            <button type="submit" disabled={register.isPending} className={styles.submitBtn}>
              {register.isPending ? t('loading') : t('register')}
            </button>

            <div className={styles.registerBlock}>
              {t('hasAccount')}{' '}
              <a href="/login">{t('login')}</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
