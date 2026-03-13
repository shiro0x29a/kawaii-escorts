import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('about')}</h3>
            <p className="text-gray-400 text-sm">
              Kawaii Escorts - ваш надежный партнер в поиске идеального компаньона.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="tel:+972534997866" className="hover:text-pink-400 transition">
                  +972 53 499 7866
                </a>
              </li>
              <li>
                <a href="https://t.me/sexy_alexbaby" className="hover:text-pink-400 transition">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://l.clck.bar/ba669" className="hover:text-pink-400 transition">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Информация</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/privacy" className="hover:text-pink-400 transition">
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-pink-400 transition">
                  {t('terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
