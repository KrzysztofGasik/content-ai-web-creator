'use server';

import { getServerSession, Session } from 'next-auth';
import { prisma } from '../prisma';
import { authOptions } from '../auth';

export async function getUserSession(): Promise<{
  session: Session;
}> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('User not authenticated');
  }
  return { session };
}

export async function verifyUserByContent(contentId: string) {
  const { session } = await getUserSession();

  const verifyUser = await prisma.content.findUnique({
    where: { id: contentId },
  });
  if (!verifyUser) {
    throw new Error('Content not found');
  }
  if (verifyUser.userId !== session.user.id) {
    throw new Error('Not authorized');
  }

  return { verifyUser };
}
