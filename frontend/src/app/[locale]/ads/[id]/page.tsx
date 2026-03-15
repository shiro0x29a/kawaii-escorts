import { useTranslations } from 'next-intl';
import { AdView } from '@/components/profiles/AdView';

interface AdPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdPage({ params }: AdPageProps) {
  const { id } = await params;

  return (
    <div className="container py-8">
      <AdView id={parseInt(id)} />
    </div>
  );
}
