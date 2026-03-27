'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import styles from './CartView.module.css';

export function CartView() {
  const t = useTranslations('Cart');
  const router = useRouter();
  const { items, total, removeItem, clearCart } = useCartStore();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>{t('empty')}</p>
        <Button onClick={() => router.push('/profiles')}>
          {t('continueShopping')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.itemList}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div>
              <p className={styles.itemName}>Profile #{item.profileId}</p>
              <p className={styles.itemPlan}>
                {t(item.plan.toLowerCase() as any)}
              </p>
            </div>
            <div className={styles.itemPrice}>
              <span>${(item.price / 100).toFixed(2)}</span>
              <button
                onClick={() => removeItem(item.id)}
                className={styles.removeBtn}
              >
                {t('remove')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.totalLabel}>{t('total')}</span>
          <span className={styles.totalAmount}>${(total / 100).toFixed(2)}</span>
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="secondary" onClick={() => router.push('/profiles')}>
            {t('continueShopping')}
          </Button>
          <Button onClick={handleCheckout}>
            {t('checkout')}
          </Button>
        </div>

        <Button variant="ghost" onClick={clearCart} fullWidth>
          Clear Cart
        </Button>
      </div>
    </div>
  );
}
