import { useTranslations } from 'next-intl';
import { AdsList } from '@/components/adsList';
import { Filters } from '@/components/filters';

export default function AdsPage() {
  const t = useTranslations('Ads');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <Filters />
        </aside>

        <main className="flex-1">
          <AdsList />
        </main>
      </div>
    </div>
  );
}
