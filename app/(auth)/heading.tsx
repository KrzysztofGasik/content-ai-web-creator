'use client';

import { SideMenu } from '@/components/side-menu';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

export const Heading = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  return (
    <>
      <h1
        className="text-xl cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        ContentForge AI
      </h1>
      <SideMenu data={session} />
    </>
  );
};
