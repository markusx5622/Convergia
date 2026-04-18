'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebatePage() {
  const router = useRouter();
  useEffect(() => { router.replace('/demo'); }, [router]);
  return null;
}
