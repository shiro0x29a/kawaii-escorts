import { LoginForm } from '@/components/loginForm';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LoginPage() {
  return <LoginForm />;
}
