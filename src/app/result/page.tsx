'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/demo'); }, [router]);
  return null;
}
