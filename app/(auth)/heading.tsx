'use client';

import { SideMenu } from '@/components/side-menu';
import { useRouter } from 'next/navigation';

export const Heading = () => {
  const router = useRouter();
  return (
    <>
      <h1
        className="text-xl cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        ContentForge AI
      </h1>
      <SideMenu />
    </>
  );
};
