'use client';

import { useTranslations } from 'next-intl';
import { AdsList } from '@/components/AdsList';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

export default function AdsPage() {
  const t = useTranslations('Ads');
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>

      {!isAuthenticated && (
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center mb-8">
          <p className="text-gray-700 mb-4">
            {t('loginToViewAds')}
          </p>
          <Link
            href="/login"
            className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            {t('login')}
          </Link>
        </div>
      )}

      <main>
        <AdsList />
      </main>
    </div>
  );
}
