import { useTranslations } from 'next-intl';
import { SearchResults } from '@/components/search-results';

interface SearchPageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const t = useTranslations('Search');
  const { city } = await searchParams;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>
      <SearchResults initialCity={city} />
    </div>
  );
}
