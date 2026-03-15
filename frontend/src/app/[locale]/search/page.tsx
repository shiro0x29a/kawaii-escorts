import { getTranslations } from 'next-intl/server';
import { SearchResults } from '@/components/search/SearchResults';

interface SearchPageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const t = await getTranslations('Search');
  const { city } = await searchParams;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>
      <SearchResults initialCity={city} />
    </div>
  );
}
