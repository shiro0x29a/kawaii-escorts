'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCities } from '@/hooks/useCities';
import { useAuthStore } from '@/stores/authStore';
import { Input, Dropdown, Button } from '@/components/ui';
import Link from 'next/link';
import styles from './page.module.css';

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
  const { isAuthenticated, user } = useAuthStore();
  const { data: cities, isLoading: citiesLoading } = useCities('en');
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
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('title')}</h1>
          <div className={styles.loginBox}>
            <p className={styles.loginText}>{t('loginRequired')}</p>
            <div className={styles.loginButtons}>
              <Link
                href="/login"
                className={`${styles.loginBtn} ${styles.loginBtnPrimary}`}
              >
                {tNav('login')}
              </Link>
              <Link
                href="/register"
                className={`${styles.loginBtn} ${styles.loginBtnSecondary}`}
              >
                {tNav('register')}
              </Link>
            </div>
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
      console.log('Avatar file:', formData.avatar);
      console.log('Photos files:', formData.photos);
      
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
      const answer: Record<string, boolean> = {
        to_calls: formData.toCalls,
        sms: formData.sms,
        whatsapp: formData.whatsapp,
        viber: formData.viber,
        telegram: formData.telegram,
      };
      form.append('answer', JSON.stringify(answer));

      // Languages
      const langs: Record<string, boolean> = {
        russian: formData.russian,
        english: formData.english,
        other_lang: !!formData.otherLang,
      };
      form.append('languages', JSON.stringify(langs));

      // Services
      const work: Record<string, boolean> = {
        apartments: formData.apartments,
        on_departure: formData.onDeparture,
      };
      form.append('workType', JSON.stringify(work));

      if (formData.avatar) {
        form.append('avatar', formData.avatar);
      }

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
      
      // Add userId if authenticated
      if (user?.id) {
        form.append('userId', user.id);
      }

      const response = await fetch(`/api/profiles`, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('error'));
      }

      const profile = await response.json();
      router.push(`/ads/${profile.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutoFill = () => {
    const firstCity = cities?.[0]?.id || '';
    setFormData({
      ...formData,
      name: 'Anna',
      age: '25',
      gender: 'female',
      tel: '+972-50-123-4567',
      email: 'anna@example.com',
      city: String(firstCity),
      height: '168',
      weight: '52',
      about: 'Friendly and outgoing, love to meet new people and explore new places. I will be happy to accompany you on your journey!',
      toCalls: true,
      sms: true,
      whatsapp: true,
      viber: true,
      telegram: true,
      russian: true,
      english: true,
      otherLang: '',
      apartments: true,
      onDeparture: true,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{t('title')}</h1>
          <button
            type="button"
            onClick={handleAutoFill}
            className={styles.autoFillBtn}
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className={styles.errorBox}>{error}</div>
        )}

        <div className={styles.formBorder}>
          <div className={styles.form}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('name')} <span className={styles.required}>*</span>
            </label>
            <Input
              type="text"
              required
              maxLength={20}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t('namePlaceholder')}
            />
            <p className={styles.hint}>{t('nameHint')}</p>
          </div>

          {/* Age */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('age')} <span className={styles.required}>*</span>
            </label>
            <Input
              type="number"
              required
              min={18}
              max={99}
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('gender')} <span className={styles.required}>*</span>
            </label>
            <Dropdown
              options={[
                { label: t('female'), value: 'female' },
                { label: t('male'), value: 'male' },
                { label: t('trans'), value: 'trans' },
              ]}
              value={formData.gender}
              onChange={(value) => handleChange('gender', value)}
            />
          </div>

          {/* Phone */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('phone')} <span className={styles.required}>*</span>
            </label>
            <Input
              type="tel"
              required
              value={formData.tel}
              onChange={(e) => handleChange('tel', e.target.value)}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('email')} <span className={styles.required}>*</span>
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          {/* City */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('city')} <span className={styles.required}>*</span>
            </label>
            <Dropdown
              options={[
                { label: t('selectCity'), value: '' },
                ...(cities || []).map((city) => ({
                  label: city.name,
                  value: String(city.id),
                })),
              ]}
              value={formData.city}
              onChange={(value) => handleChange('city', value)}
            />
          </div>

          {/* Contact methods */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('contactMethods')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.toCalls}
                  onChange={(e) => handleChange('toCalls', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>{t('toCalls')}</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.sms}
                  onChange={(e) => handleChange('sms', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>SMS</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>WhatsApp</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.viber}
                  onChange={(e) => handleChange('viber', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Viber</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.telegram}
                  onChange={(e) => handleChange('telegram', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Telegram</span>
              </label>
            </div>
          </div>

          {/* Languages */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('languages')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.russian}
                  onChange={(e) => handleChange('russian', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>{t('russian')}</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.english}
                  onChange={(e) => handleChange('english', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>{t('english')}</span>
              </label>
              <label className={styles.checkboxLabel}>
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
                  className={styles.checkbox}
                />
                <span>{t('other')}</span>
              </label>
              {showOtherLang && (
                <input
                  type="text"
                  value={formData.otherLang}
                  onChange={(e) => handleChange('otherLang', e.target.value)}
                  placeholder={t('otherLangPlaceholder')}
                  className={styles.otherLangInput}
                />
              )}
            </div>
          </div>

          {/* Height & Weight */}
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                {t('height')} <span className={styles.required}>*</span>
              </label>
              <Input
                type="number"
                required
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                {t('weight')} <span className={styles.required}>*</span>
              </label>
              <Input
                type="number"
                required
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>
          </div>

          {/* About */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('about')} <span className={styles.required}>*</span>
            </label>
            <textarea
              required
              maxLength={5000}
              value={formData.about}
              onChange={(e) => handleChange('about', e.target.value)}
              rows={6}
              className={styles.textarea}
            />
            <p className={styles.hint}>{t('aboutHint')}</p>
          </div>

          {/* Services */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('services')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.apartments}
                  onChange={(e) => handleChange('apartments', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>{t('apartments')}</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.onDeparture}
                  onChange={(e) => handleChange('onDeparture', e.target.checked)}
                  className={styles.checkbox}
                />
                <span>{t('onDeparture')}</span>
              </label>
            </div>
          </div>

          {/* Avatar */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('avatar')} <span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => handleChange('avatar', e.target.files?.[0] || null)}
              className={styles.fileInput}
            />
            <p className={styles.hint}>{t('fileHint')}</p>
          </div>

          {/* Photos */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('photos')} <span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={(e) => handleChange('photos', Array.from(e.target.files || []))}
              className={styles.fileInput}
            />
            <p className={styles.hint}>{t('photosHint')}</p>
          </div>

          {/* Plan */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              {t('plan')} <span className={styles.required}>*</span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="plan"
                  checked={formData.plan === '1_week'}
                  onChange={() => handleChange('plan', '1_week')}
                  className={styles.radio}
                />
                <span>{t('plan1Week')} - $50</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="plan"
                  checked={formData.plan === '1_month'}
                  onChange={() => handleChange('plan', '1_month')}
                  className={styles.radio}
                />
                <span>{t('plan1Month')} - $100</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="plan"
                  checked={formData.plan === '3_months'}
                  onChange={() => handleChange('plan', '3_months')}
                  className={styles.radio}
                />
                <span>{t('plan3Months')} - $150</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? t('submitting') : t('submit')}
          </Button>
        </form>
        </div>
        </div>
      </div>
    </div>
  );
}
