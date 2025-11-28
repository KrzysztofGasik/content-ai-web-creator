'use server';

import { getServerSession, Session } from 'next-auth';
import { prisma } from './prisma';
import { authOptions } from './auth';
import {
  ContentData,
  ContentTemplate,
  ContentTypeParams,
  SaveImageMetadataProps,
  UpdateData,
} from '@/types/types';
import { client } from '../sanity/lib/client';
import { generateGetPreSignUrl } from './aws';
import { ContentVersion, Image } from '@prisma/client';

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
  type: ContentTypeParams;
  favorite: boolean;
  archived: boolean;
}) {
  try {
    const { session } = await getUserSession();
    const { type, favorite, archived } = filters;
    // eslint-disable-next-line
    const where: any = { userId: session.user.id };

    if (type !== 'ALL') {
      where.type = filters.type;
    }
    if (favorite === true) {
      where.isFavorite = filters.favorite;
    }
    if (archived === true) {
      where.isArchived = filters.archived;
    }
    const contents = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

export async function saveImageMetadata({
  key,
  bucket,
  url,
  filename,
  size,
  contentType,
  userId,
  contentId,
}: SaveImageMetadataProps) {
  try {
    await getUserSession();

    const image = await prisma.image.create({
      data: {
        s3Bucket: bucket,
        s3Key: key,
        url,
        filename,
        size,
        mimeType: contentType,
        userId,
        contentId: contentId || null,
      },
    });

    return {
      success: true,
      message: 'Image saved in DB',
      image,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Image failed during attempt to save in DB',
    };
  }
}

export async function getContentImages(contentId: string) {
  try {
    const { verifyUser } = await verifyUserByContent(contentId);

    const images = await prisma.image.findMany({
      where: { userId: verifyUser.userId },
    });

    const imagesWithUrls = await Promise.all(
      images.map(async (image: Image) => ({
        ...image,
        url: await generateGetPreSignUrl({ key: image.s3Key }),
      }))
    );

    return {
      success: true,
      message: 'Images fetched from DB',
      images: imagesWithUrls,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Fetching images from DB failed',
    };
  }
}

export async function getUserImages(userId: string) {
  try {
    const images = await prisma.image.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => ({
        ...image,
        url: await generateGetPreSignUrl({ key: image.s3Key }),
      }))
    );

    return {
      success: true,
      message: 'Images fetched from DB',
      images: imagesWithUrls,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during images fetched',
    };
  }
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
    console.error(error);
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
    console.error(error);
    return {
      success: false,
      message: 'Error during fetching content template from sanity',
    };
  }
}

// Generic functions

export async function getUserSession(): Promise<{
  session: Session;
}> {
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
