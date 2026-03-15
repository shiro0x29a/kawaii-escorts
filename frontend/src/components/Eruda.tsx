'use client';

import { useEffect } from 'react';

export function Eruda() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('eruda').then((eruda) => {
        eruda.default.init();
      });
    }
  }, []);

  return null;
}
