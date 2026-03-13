'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/stores/cart-store';
import { useRouter } from 'next/navigation';

export function CartView() {
  const t = useTranslations('Cart');
  const router = useRouter();
  const { items, total, removeItem, clearCart } = useCartStore();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{t('empty')}</p>
        <button
          onClick={() => router.push('/profiles')}
          className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div>
              <p className="font-medium">Profile #{item.profileId}</p>
              <p className="text-sm text-gray-500">
                {t(item.plan.toLowerCase() as any)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">${(item.price / 100).toFixed(2)}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                {t('remove')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">{t('total')}</span>
          <span className="text-xl font-bold">${(total / 100).toFixed(2)}</span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/profiles')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            {t('continueShopping')}
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-medium"
          >
            {t('checkout')}
          </button>
        </div>

        <button
          onClick={clearCart}
          className="w-full mt-4 text-red-500 hover:text-red-700 transition text-sm"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
