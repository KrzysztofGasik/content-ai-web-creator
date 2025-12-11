'use server';

import { getServerSession, Session } from 'next-auth';
import { prisma } from '../prisma';
import { authOptions } from '../auth';

export async function updateLastLogin() {
  try {
    const { session } = await getUserSession();
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    await prisma.user.update({
      where: { id: session?.user?.id },
      data: {
        lastLogin: new Date(),
      },
    });

    return {
      success: true,
      message: 'Last login updated successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during attempt to update last login',
    };
  }
}

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
