'use server';

import { prisma } from '../prisma';
import { ContentVersion } from '@prisma/client';
import { getUserSession, verifyUserByContent } from './actions';
import type {
  ContentTypeParams,
  SortOptions,
  UpdateData,
  ContentData,
} from '@/types/types';

// Content actions

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
    console.error(error);
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

      const toDelete = items.map((item: ContentVersion) => item.id);

      await prisma.contentVersion.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    return { success: true, message: 'Content updated in DB' };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during attempt to update content in db',
    };
  }
}

export async function getUserContent(filters: {
  project: string;
  type: ContentTypeParams;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  sort: SortOptions;
}) {
  try {
    const { session } = await getUserSession();
    const { project, type, tags, favorite, archived, sort } = filters;
    // eslint-disable-next-line
    const where: any = { userId: session.user.id };

    if (project !== 'ALL') {
      where.projectId = filters.project;
    }
    if (type !== 'ALL') {
      where.type = filters.type;
    }
    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          name: { in: tags },
        },
      };
    }
    if (favorite === true) {
      where.isFavorite = filters.favorite;
    }
    if (archived === true) {
      where.isArchived = filters.archived;
    }

    const contents = await prisma.content.findMany({
      where,
      orderBy:
        sort === 'oldest'
          ? { createdAt: 'asc' }
          : sort === 'title-asc'
            ? { title: 'asc' }
            : sort === 'title-desc'
              ? { title: 'desc' }
              : { createdAt: 'desc' },
    });

    return { success: true, message: 'Content fetched from DB', contents };
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    return {
      success: false,
      message: 'Version failed during attempt to restore',
    };
  }
}
