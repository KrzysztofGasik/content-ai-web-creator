'use server';

import { getServerSession } from 'next-auth';
import { prisma } from './prisma';
import { authOptions } from './auth';
import { ContentData, UpdateData } from '@/types/types';

export async function saveGeneratedContent({ data }: ContentData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('User not authenticated');
    }
    const content = await prisma.content.create({
      data: { ...data, userId: session.user.id },
    });

    return {
      success: true,
      message: 'Content saved in DB',
      contentId: content.id,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to save content in db',
    };
  }
}

export async function updateContent({ contentId, editedContent }: UpdateData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('User not authenticated');
    }
    const verifyUser = await prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!verifyUser) {
      return { success: false, message: 'Content not found' };
    }
    if (verifyUser.userId !== session.user.id) {
      return { success: false, message: 'Not authorized' };
    }

    await prisma.content.update({
      where: { id: contentId },
      data: { editedText: editedContent },
    });

    return { success: true, message: 'Content updated in DB' };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to update content in db',
    };
  }
}

export async function getUserContent() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('User not authenticated');
    }

    const contents = await prisma.content.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, message: 'Content fetched from DB', contents };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to fetch content from db',
    };
  }
}

export async function deleteContent(contentId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('User not authenticated');
    }
    const verifyUser = await prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!verifyUser) {
      return { success: false, message: 'Content not found' };
    }
    if (verifyUser.userId !== session.user.id) {
      return { success: false, message: 'Not authorized' };
    }

    await prisma.content.delete({
      where: { id: contentId },
    });

    return { success: true, message: 'Content successfully deleted from DB' };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to delete content from db',
    };
  }
}

export async function getContentDetails(contentId: string) {
  try {
    const session = await getServerSession(authOptions);
    const verifyUser = await prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!session || !verifyUser) {
      throw new Error('User not authenticated');
    }

    if (verifyUser.userId !== session.user.id) {
      return { success: false, message: 'Not authorized' };
    }

    const content = await prisma.content.findUnique({
      where: { id: contentId },
    });

    return { success: true, message: 'Content fetched from DB', content };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to fetch content from db',
    };
  }
}

export async function toggleFavorite(contentId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('User not authenticated');
    }
    const verifyUser = await prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!verifyUser) {
      return { success: false, message: 'Content not found' };
    }
    if (verifyUser.userId !== session.user.id) {
      return { success: false, message: 'Not authorized' };
    }

    await prisma.content.update({
      where: { id: contentId },
      data: { isFavorite: !verifyUser.isFavorite },
    });

    return { success: true, message: 'Content favorite status updated in DB' };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to toggle favorite status in db',
    };
  }
}

export async function toggleArchived(contentId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('User not authenticated');
    }
    const verifyUser = await prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!verifyUser) {
      return { success: false, message: 'Content not found' };
    }
    if (verifyUser.userId !== session.user.id) {
      return { success: false, message: 'Not authorized' };
    }

    await prisma.content.update({
      where: { id: contentId },
      data: { isArchived: !verifyUser.isArchived },
    });

    return { success: true, message: 'Content archived status updated in DB' };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to toggle archived status in db',
    };
  }
}
