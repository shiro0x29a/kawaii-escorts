import { useTranslations } from 'next-intl';
import { CartView } from '@/components/cart/CartView';
import styles from './page.module.css';

export default function CartPage() {
  const t = useTranslations('Cart');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>
        <CartView />
      </div>
    </div>
  );
}
