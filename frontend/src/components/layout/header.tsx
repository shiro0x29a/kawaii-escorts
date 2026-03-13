'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';

export function Header() {
  const t = useTranslations('Nav');
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-md">
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-pink-600">
            Kawaii Escorts
          </Link>

          <ul className="flex items-center space-x-6">
            <li>
              <Link href="/" className="text-gray-700 hover:text-pink-600 transition">
                {t('home')}
              </Link>
            </li>
            <li>
              <Link href="/profiles" className="text-gray-700 hover:text-pink-600 transition">
                {t('profiles')}
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-gray-700 hover:text-pink-600 transition">
                {t('search')}
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-gray-700 hover:text-pink-600 transition">
                {t('cart')}
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/profile" className="text-gray-700 hover:text-pink-600 transition">
                    {t('profile')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-pink-600 transition"
                  >
                    {t('logout')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="text-gray-700 hover:text-pink-600 transition">
                    {t('login')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
                  >
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
