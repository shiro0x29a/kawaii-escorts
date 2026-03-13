import { getTranslations } from 'next-intl/server';
import { SearchBox } from '@/components/search-box';
import { FeaturedProfiles } from '@/components/featured-profiles';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });

  return (
    <div>
      <section className="relative bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{t('title')}</h1>
            <p className="text-xl text-gray-600 mb-8">{t('subtitle')}</p>
            <SearchBox placeholder={t('searchPlaceholder')} />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('featuredProfiles')}</h2>
          <FeaturedProfiles />
        </div>
      </section>
    </div>
  );
}
