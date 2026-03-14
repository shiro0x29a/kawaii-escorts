'use client';

import { usePathname } from 'next/navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');
  
  if (isAuthPage) {
    return null;
  }
  
  return <>{children}</>;
}
