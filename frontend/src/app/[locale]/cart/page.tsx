import { useTranslations } from 'next-intl';
import { CartView } from '@/components/cart/CartView';

export default function CartPage() {
  const t = useTranslations('Cart');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>
      <CartView />
    </div>
  );
}
