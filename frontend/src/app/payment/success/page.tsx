import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function PaymentSuccessPage() {
  const t = useTranslations('Payment');

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('success')}</h1>
        <p className="text-gray-600 mb-6">Thank you for your payment!</p>
        <Link
          href="/profiles"
          className="inline-block bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
        >
          Browse Profiles
        </Link>
      </div>
    </div>
  );
}
