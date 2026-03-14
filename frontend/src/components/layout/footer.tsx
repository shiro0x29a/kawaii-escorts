import { useTranslations } from 'next-intl';
import styles from './footer.module.css';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.title}>{t('about')}</h3>
            <p className={styles.description}>
              Kawaii Escorts - ваш надежный партнер в поиске идеального компаньона.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>{t('contact')}</h3>
            <ul className={styles.contactList}>
              <li>
                <a href="tel:+972534997866" className={styles.contactLink}>
                  +972 53 499 7866
                </a>
              </li>
              <li>
                <a href="https://t.me/sexy_alexbaby" className={styles.contactLink}>
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://l.clck.bar/ba669" className={styles.contactLink}>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Информация</h3>
            <ul className={styles.infoList}>
              <li>
                <a href="/privacy" className={styles.infoLink}>
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className={styles.infoLink}>
                  {t('terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>{t('copyright')}</div>
      </div>
    </footer>
  );
}
