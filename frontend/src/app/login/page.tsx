import { useTranslations } from 'next-intl';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  const t = useTranslations('Auth');

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">{t('login')}</h1>
        <LoginForm />
      </div>
    </div>
  );
}
