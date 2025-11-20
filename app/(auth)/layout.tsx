'use client';

import { useSession } from 'next-auth/react';
import { SideMenu } from '@/components/side-menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  return (
    <>
      <header>
        <nav className="flex justify-between px-4 py-2">
          <h1 className="text-xl">ContentForge AI</h1>
          <SideMenu data={session?.data} />
        </nav>
      </header>
      <main className="flex flex-col justify-center items-center p-5">
        {children}
      </main>
    </>
  );
}
