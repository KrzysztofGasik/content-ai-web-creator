import { Heading } from './heading';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <header>
        <nav className="flex justify-between px-4 py-2">
          <Heading session={session} />
        </nav>
      </header>
      <main className="flex flex-col justify-center items-center p-5">
        {children}
      </main>
    </>
  );
}
