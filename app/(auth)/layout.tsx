'use client';

import { useSession } from 'next-auth/react';
import { SideMenu } from '@/components/side-menu';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <header>
        <nav className="flex justify-between px-4 py-2">
          <h1 className="text-xl">ContentForge AI</h1>
          {isMounted && <SideMenu data={session?.data} />}
        </nav>
      </header>
      <main className="flex flex-col justify-center items-center p-5">
        {children}
      </main>
    </>
  );
}
