import { RegisterForm } from '@/components/RegisterForm';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function RegisterPage() {
  return <RegisterForm />;
}
