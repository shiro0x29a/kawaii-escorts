import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function PaymentFailedPage() {
  const t = useTranslations('Payment');

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('failed')}</h1>
        <p className="text-gray-600 mb-6">Something went wrong with your payment.</p>
        <Link
          href="/cart"
          className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
