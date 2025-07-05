'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SimpleLoading from '@/components/simple-loading';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <SimpleLoading />;
}
