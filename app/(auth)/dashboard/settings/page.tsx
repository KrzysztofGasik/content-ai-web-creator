import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ProfileTabs } from './tabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default async function Settings() {
  await getServerSession(authOptions);

  return <ProfileTabs />;
}
