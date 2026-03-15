'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCities } from '@/hooks/use-cities';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

interface FormData {
  name: string;
  age: string;
  gender: 'female' | 'male' | 'trans';
  tel: string;
  email: string;
  city: string;
  height: string;
  weight: string;
  about: string;
  // Contact methods
  toCalls: boolean;
  sms: boolean;
  whatsapp: boolean;
  viber: boolean;
  telegram: boolean;
  // Languages
  russian: boolean;
  english: boolean;
  otherLang: string;
  // Services
  apartments: boolean;
  onDeparture: boolean;
  // Files
  avatar: File | null;
  photos: File[];
  // Plan
  plan: '1_week' | '1_month' | '3_months';
}

export default function AddAdPage() {
  const t = useTranslations('AddAd');
  const tNav = useTranslations('Nav');
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: cities } = useCities();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtherLang, setShowOtherLang] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: 'female',
    tel: '',
    email: '',
    city: '',
    height: '',
    weight: '',
    about: '',
    toCalls: false,
    sms: false,
    whatsapp: false,
    viber: false,
    telegram: false,
    russian: false,
    english: false,
    otherLang: '',
    apartments: false,
    onDeparture: false,
    avatar: null,
    photos: [],
    plan: '1_week',
  });

  // If not authenticated, show login/register message
  if (!isAuthenticated) {
    return (
      <div className="formContainer">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-700 mb-6">{t('loginRequired')}</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition font-medium"
            >
              {tNav('login')}
            </Link>
            <Link
              href="/register"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition font-medium"
            >
              {tNav('register')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.name || !formData.age || !formData.tel || !formData.email || 
        !formData.city || !formData.height || !formData.weight || !formData.about) {
      setError(t('fillAllFields'));
      setIsLoading(false);
      return;
    }

    if (!formData.avatar) {
      setError(t('avatarRequired'));
      setIsLoading(false);
      return;
    }

    if (formData.photos.length === 0) {
      setError(t('photosRequired'));
      setIsLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('age', formData.age);
      form.append('gender', formData.gender);
      form.append('tel', formData.tel);
      form.append('email', formData.email);
      form.append('city', formData.city);
      form.append('height', formData.height);
      form.append('weight', formData.weight);
      form.append('about', formData.about);
      
      // Contact methods
      const answer: Record<string, string | null> = {
        to_calls: formData.toCalls ? 'לשיחות' : null,
        sms: formData.sms ? 'SMS' : null,
        whatsapp: formData.whatsapp ? 'WhatsApp' : null,
        viber: formData.viber ? 'Viber' : null,
        telegram: formData.telegram ? 'Telegram' : null,
      };
      form.append('answer', JSON.stringify(answer));
      
      // Languages
      const langs: Record<string, string | null> = {
        russian: formData.russian ? 'רוסית' : null,
        english: formData.english ? 'אנגלית' : null,
        other_lang: formData.otherLang || null,
      };
      form.append('languages', JSON.stringify(langs));
      
      // Services
      const work: Record<string, string | null> = {
        apartments: formData.apartments ? 'בדירה דיסקרטית' : null,
        on_departure: formData.onDeparture ? 'ביתך או מלון' : null,
      };
      form.append('workType', JSON.stringify(work));

      form.append('avatar', formData.avatar);
      
      formData.photos.forEach((photo) => {
        form.append('photos', photo);
      });

      // Plan pricing
      const prices = {
        '1_week': 50,
        '1_month': 100,
        '3_months': 150,
      };
      form.append('price', String(prices[formData.plan]));
      form.append('plan', formData.plan);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('error'));
      }

      const profile = await response.json();
      router.push(`/profiles/${profile.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="formContainer">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={20}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder={t('namePlaceholder')}
          />
          <p className="text-xs text-gray-500 mt-1">{t('nameHint')}</p>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('age')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min={18}
            max={99}
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('gender')} <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="female">{t('female')}</option>
            <option value="male">{t('male')}</option>
            <option value="trans">{t('trans')}</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('phone')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.tel}
            onChange={(e) => handleChange('tel', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('city')} <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="">{t('selectCity')}</option>
            {cities?.map((city: any) => (
              <option key={city.id} value={city.nameEn}>
                {city.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Contact methods */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('contactMethods')} <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.toCalls}
                onChange={(e) => handleChange('toCalls', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>{t('toCalls')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.sms}
                onChange={(e) => handleChange('sms', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>SMS</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>WhatsApp</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.viber}
                onChange={(e) => handleChange('viber', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>Viber</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.telegram}
                onChange={(e) => handleChange('telegram', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>Telegram</span>
            </label>
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('languages')} <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.russian}
                onChange={(e) => handleChange('russian', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>{t('russian')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.english}
                onChange={(e) => handleChange('english', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>{t('english')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.otherLang}
                onChange={(e) => {
                  if (e.target.checked) {
                    setShowOtherLang(true);
                  } else {
                    setShowOtherLang(false);
                    handleChange('otherLang', '');
                  }
                }}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>{t('other')}</span>
            </label>
            {showOtherLang && (
              <input
                type="text"
                value={formData.otherLang}
                onChange={(e) => handleChange('otherLang', e.target.value)}
                placeholder={t('otherLangPlaceholder')}
                className="ml-6 px-3 py-1 border rounded text-sm"
              />
            )}
          </div>
        </div>

        {/* Height & Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('height')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('weight')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('about')} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            maxLength={5000}
            value={formData.about}
            onChange={(e) => handleChange('about', e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{t('aboutHint')}</p>
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('services')} <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.apartments}
                onChange={(e) => handleChange('apartments', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>{t('apartments')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.onDeparture}
                onChange={(e) => handleChange('onDeparture', e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span>{t('onDeparture')}</span>
            </label>
          </div>
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('avatar')} <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleChange('avatar', e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{t('fileHint')}</p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('photos')} <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(e) => handleChange('photos', Array.from(e.target.files || []))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{t('photosHint')}</p>
        </div>

        {/* Plan */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('plan')} <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="plan"
                checked={formData.plan === '1_week'}
                onChange={() => handleChange('plan', '1_week')}
                className="w-4 h-4 text-pink-600"
              />
              <span>{t('plan1Week')} - $50</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="plan"
                checked={formData.plan === '1_month'}
                onChange={() => handleChange('plan', '1_month')}
                className="w-4 h-4 text-pink-600"
              />
              <span>{t('plan1Month')} - $100</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="plan"
                checked={formData.plan === '3_months'}
                onChange={() => handleChange('plan', '3_months')}
                className="w-4 h-4 text-pink-600"
              />
              <span>{t('plan3Months')} - $150</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('submitting') : t('submit')}
        </button>
      </form>
    </div>
  );
}
