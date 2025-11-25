'use server';

import { getServerSession } from 'next-auth';
import { prisma } from './prisma';
import { authOptions } from './auth';
import { ContentData, ContentTemplate, UpdateData } from '@/types/types';
import { client } from '../sanity/lib/client';

export async function saveGeneratedContent({ data }: ContentData) {
  try {
    const { session } = await getUserSession();
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
    const { verifyUser } = await verifyUserByContent(contentId);

    const textToSave =
      (verifyUser?.editedText as string) ?? verifyUser?.generatedText;

    await prisma.$transaction([
      prisma.contentVersion.create({
        data: {
          contentId,
          text: textToSave,
        },
      }),
      prisma.content.update({
        where: { id: contentId },
        data: { editedText: editedContent },
      }),
    ]);

    const versionCount = await prisma.contentVersion.count({
      where: { contentId },
    });
    const contentVersionsForDelete = versionCount - 10;
    if (contentVersionsForDelete > 0) {
      const items = await prisma.contentVersion.findMany({
        where: { contentId },
        orderBy: { createdAt: 'asc' },
        take: contentVersionsForDelete,
      });

      const toDelete = items.map((item) => item.id);

      await prisma.contentVersion.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

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
    const { session } = await getUserSession();
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
    await verifyUserByContent(contentId);

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
    await verifyUserByContent(contentId);

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
    const { verifyUser } = await verifyUserByContent(contentId);

    await prisma.content.update({
      where: { id: contentId },
      data: { isFavorite: !verifyUser?.isFavorite },
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
    const { verifyUser } = await verifyUserByContent(contentId);

    await prisma.content.update({
      where: { id: contentId },
      data: { isArchived: !verifyUser?.isArchived },
    });

    return { success: true, message: 'Content archived status updated in DB' };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to toggle archived status in db',
    };
  }
}

export async function getContentVersions(contentId: string) {
  try {
    await verifyUserByContent(contentId);

    const versions = await prisma.contentVersion.findMany({
      where: { contentId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Content versions fetched successfully',
      versions,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error during attempt to get content versions in db',
    };
  }
}

export async function restoreContentVersion(
  versionId: string,
  contentId: string
) {
  try {
    await verifyUserByContent(contentId);
    const verifyVersion = await prisma.contentVersion.findUnique({
      where: { id: versionId },
    });
    if (verifyVersion?.contentId !== contentId) {
      return { success: false, message: 'Version not found' };
    }
    await prisma.content.update({
      where: { id: contentId },
      data: {
        editedText: verifyVersion.text,
      },
    });
    return {
      success: true,
      message: 'Version restored successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Version failed during attempt to restore',
    };
  }
}

async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('User not authenticated');
  }
  return { session };
}

async function verifyUserByContent(contentId: string) {
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

// Sanity actions

export async function getContentTemplates() {
  try {
    const templates: ContentTemplate[] = await client.fetch(
      '*[_type == "contentTemplate" && isActive == true] {_id, name,description,contentType,promptTemplate,defaultTone,category}'
    );
    return {
      success: true,
      message: 'Successfully fetched data from sanity',
      templates,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error during fetching content templates from sanity',
    };
  }
}

export async function getContentTemplateById(id: string) {
  try {
    const template: ContentTemplate[] = await client.fetch(
      `*[_type == "contentTemplate" && isActive == true && _id == "${id}"] {_id, name,description,contentType,promptTemplate,defaultTone,category}`
    );
    return {
      success: true,
      message: 'Successfully fetched template from sanity',
      template: template[0],
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error during fetching content template from sanity',
    };
  }
}
