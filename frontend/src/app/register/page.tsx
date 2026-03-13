import { useTranslations } from 'next-intl';
import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  const t = useTranslations('Auth');

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">{t('register')}</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
