'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAds } from '@/hooks/use-ads';
import { useState } from 'react';

export function AdsList() {
  const t = useTranslations('Ads');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAds({ page, limit: 12 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.data?.length) {
    return <p className="text-center text-gray-500 py-12">{t('noAds')}</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((ad: any) => (
          <Link
            key={ad.id}
            href={`/ads/${ad.id}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="relative h-64 w-full">
              <Image
                src={ad.avatar}
                alt={ad.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {ad.name}, {ad.age}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{ad.city.nameEn}</p>
            </div>
          </Link>
        ))}
      </div>

      {data.pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.pages}
            className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
