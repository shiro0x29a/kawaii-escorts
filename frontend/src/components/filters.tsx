'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCities } from '@/hooks/use-cities';
import { useRouter, usePathname } from 'next/navigation';

export function Filters() {
  const t = useTranslations('Profiles');
  const router = useRouter();
  const pathname = usePathname();
  const { data: cities } = useCities();

  const [filters, setFilters] = useState({
    cityId: '',
    gender: '',
    minAge: '',
    maxAge: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (filters.cityId) params.set('cityId', filters.cityId);
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.minAge) params.set('minAge', filters.minAge);
    if (filters.maxAge) params.set('maxAge', filters.maxAge);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setFilters({ cityId: '', gender: '', minAge: '', maxAge: '' });
    router.push(pathname);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">{t('filters')}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('city')}
          </label>
          <select
            value={filters.cityId}
            onChange={(e) => setFilters({ ...filters, cityId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-pink-400 focus:outline-none"
          >
            <option value="">{t('allCities')}</option>
            {cities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('gender')}
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-pink-400 focus:outline-none"
          >
            <option value="">{t('allGenders')}</option>
            <option value="FEMALE">{t('female')}</option>
            <option value="MALE">{t('male')}</option>
            <option value="TRANSGENDER">{t('transgender')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('ageRange')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t('minAge')}
              value={filters.minAge}
              onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-pink-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder={t('maxAge')}
              value={filters.maxAge}
              onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-pink-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
          >
            {t('applyFilters')}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            {t('clearFilters')}
          </button>
        </div>
      </div>
    </form>
  );
}
