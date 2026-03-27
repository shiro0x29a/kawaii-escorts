'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { useCities } from '@/hooks/useCities';
import { SearchBox, Pagination } from '@/components/ui';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  city?: string;
  showSearchBox?: boolean;
}

export function SearchResults({ city = '', showSearchBox = true }: SearchResultsProps) {
  const t = useTranslations('Search');
  const router = useRouter();
  const [searchCity, setSearchCity] = useState(city);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSearch(searchCity ? { city: searchCity, page, limit: 6 } : undefined);
  const { data: cities } = useCities('en');

  useEffect(() => {
    setSearchCity(city);
  }, [city]);

  useEffect(() => {
    setPage(1);
  }, [searchCity]);

  const totalPages = data?.pagination?.pages || 1;

  const suggestions = cities
    ?.filter((c) =>
      searchCity ? c.name.toLowerCase().startsWith(searchCity.toLowerCase()) : true
    )
    .map((c) => ({ label: c.name, value: c.name })) || [];

  return (
    <div className={styles.searchResults}>
      {showSearchBox && (
        <SearchBox
          placeholder={t('placeholder')}
          value={searchCity}
          onChange={setSearchCity}
          suggestions={suggestions}
          onSuggestionSelect={(value) => {
            if (value.trim()) {
              router.push(`/search?city=${encodeURIComponent(value.trim())}`);
            }
          }}
          onSearch={(value) => {
            if (value.trim()) {
              router.push(`/search?city=${encodeURIComponent(value.trim())}`);
            }
          }}
        />
      )}

      {isLoading && (
        <div className="text-center text-gray-500">{t('loading')}</div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className="text-center text-gray-500 py-12">{t('noResults')}</div>
      )}

      {!isLoading && data?.data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((profile: any) => (
              <Link
                key={profile.id}
                href={`/profiles/${profile.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">{profile.city.nameEn}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
