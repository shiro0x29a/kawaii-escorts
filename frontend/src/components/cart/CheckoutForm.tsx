'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/stores/cart-store';
import { useRouter } from 'next/navigation';

export function CheckoutForm() {
  const t = useTranslations('Payment');
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();

  const handlePayment = async () => {
    try {
      const API_URL = '/api';

      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: items[0]?.profileId || 0,
          amount: total,
          currency: 'usd',
        }),
      });

      const data = await response.json();
      
      if (data.sessionId) {
        const checkoutResponse = await fetch(`${API_URL}/payments/${data.id}/checkout?successUrl=${encodeURIComponent(window.location.origin + '/payment/success')}&cancelUrl=${encodeURIComponent(window.location.origin + '/payment/cancel')}`, {
          method: 'POST',
        });
        
        const checkoutData = await checkoutResponse.json();
        
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        }
      }

      clearCart();
      router.push('/payment/success');
    } catch (error) {
      console.error('Payment error:', error);
      router.push('/payment/failed');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No items to checkout</p>
        <button
          onClick={() => router.push('/profiles')}
          className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
        >
          Browse Profiles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>Profile #{item.profileId} ({t(item.plan.toLowerCase() as any)})</span>
            <span>${(item.price / 100).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>${(total / 100).toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-medium"
      >
        Pay with Stripe
      </button>

      <button
        onClick={() => router.push('/cart')}
        className="w-full mt-4 text-gray-600 hover:text-gray-800 transition text-sm"
      >
        Back to Cart
      </button>
    </div>
  );
}
