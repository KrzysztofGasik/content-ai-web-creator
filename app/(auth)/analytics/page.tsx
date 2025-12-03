import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function Analytics() {
  await getServerSession(authOptions);
}
