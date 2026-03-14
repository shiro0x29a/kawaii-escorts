import { useTranslations } from 'next-intl';
import { ProfileView } from '@/components/profileView';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  
  return (
    <div className="container py-8">
      <ProfileView id={parseInt(id)} />
    </div>
  );
}
