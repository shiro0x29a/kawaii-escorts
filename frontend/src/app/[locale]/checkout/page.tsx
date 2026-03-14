import { useTranslations } from 'next-intl';
import { CheckoutForm } from '@/components/checkoutForm';

export default function CheckoutPage() {
  const t = useTranslations('Payment');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>
      <CheckoutForm />
    </div>
  );
}
