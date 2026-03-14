'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAd } from '@/hooks/use-ads';

interface AdViewProps {
  id: number;
}

export function AdView({ id }: AdViewProps) {
  const t = useTranslations('Ad');
  const { data: ad, isLoading } = useAd(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="grid md:grid-cols-2">
          <div className="h-96 bg-gray-200" />
          <div className="p-8">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return <p className="text-center text-gray-500">Ad not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative h-96">
          <Image src={ad.avatar} alt={ad.name} fill className="object-cover" />
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {ad.name}, {ad.age}
          </h1>
          <p className="text-gray-500 mb-6">{ad.city.nameEn}</p>

          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">{t('gender')}</span>
              <span className="font-medium">{t(ad.gender.toLowerCase())}</span>
            </div>
            {ad.height && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">{t('height')}</span>
                <span className="font-medium">{ad.height} {t('cm')}</span>
              </div>
            )}
            {ad.weight && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">{t('weight')}</span>
                <span className="font-medium">{ad.weight} {t('kg')}</span>
              </div>
            )}
          </div>

          {ad.about && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">{t('about')}</h3>
              <p className="text-gray-600">{ad.about}</p>
            </div>
          )}

          {ad.languages && ad.languages.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">{t('languages')}</h3>
              <div className="flex flex-wrap gap-2">
                {ad.languages.map((lang: string) => (
                  <span
                    key={lang}
                    className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <a
              href={`tel:${ad.tel}`}
              className="block w-full bg-pink-600 text-white text-center py-3 rounded-lg hover:bg-pink-700 transition font-medium"
            >
              {t('contact')}: {ad.tel}
            </a>
          </div>
        </div>
      </div>

      {ad.photos && ad.photos.length > 0 && (
        <div className="p-8">
          <h3 className="text-xl font-bold mb-4">Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ad.photos.map((photo: string, index: number) => (
              <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                <Image src={photo} alt={`${ad.name} ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
