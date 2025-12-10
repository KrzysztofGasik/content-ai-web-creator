import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ProfileTabs } from './tabs';

export default async function Settings() {
  await getServerSession(authOptions);

  return <ProfileTabs />;
}
