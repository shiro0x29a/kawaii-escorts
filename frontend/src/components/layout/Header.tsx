'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/authStore';
import styles from './Header.module.css';

export function Header() {
  const t = useTranslations('Nav');
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Kawaii Escorts
          </Link>

          <ul className={styles.menu}>
            <li>
              <Link href="/" className={styles.menuLink}>
                {t('home')}
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/ads/profiles" className={styles.menuLink}>
                    {t('myAds')}
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className={styles.logoutButton}>
                    {t('logout')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/ads" className={styles.menuLink}>
                    {t('ads')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className={styles.authButton}>
                    {t('login')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
