'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import styles from './header.module.css';

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
            <li>
              <Link href="/profiles" className={styles.menuLink}>
                {t('profiles')}
              </Link>
            </li>
            <li>
              <Link href="/search" className={styles.menuLink}>
                {t('search')}
              </Link>
            </li>
            <li>
              <Link href="/cart" className={styles.menuLink}>
                {t('cart')}
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/profile" className={styles.menuLink}>
                    {t('profile')}
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
                  <Link href="/login" className={styles.menuLink}>
                    {t('login')}
                  </Link>
                </li>
                <li>
                  <Link href="/register" className={styles.registerButton}>
                    {t('register')}
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
