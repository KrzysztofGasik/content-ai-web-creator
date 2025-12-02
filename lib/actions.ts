'use server';

import { getServerSession, Session } from 'next-auth';
import { prisma } from './prisma';
import { authOptions } from './auth';
import {
  ContentData,
  ContentTemplate,
  ContentTypeParams,
  CreateProjectProps,
  SaveImageMetadataProps,
  SortOptions,
  UpdateData,
} from '@/types/types';
import { client } from '../sanity/lib/client';
import { deleteImageFromBucket, generateGetPreSignUrl } from './aws';
import { ContentVersion, Image } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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
    if (tags.length > 0) {
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

// Image actions

export async function saveImageMetadata({
  key,
  bucket,
  url,
  filename,
  size,
  contentType,
  userId,
  width,
  height,
  isGenerated,
  contentId,
  prompt,
  quality,
  style,
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
        width,
        height,
        isGenerated,
        contentId: contentId || null,
        prompt,
        quality,
        style,
      },
    });

    revalidatePath('/images');

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
      where: { userId: verifyUser.userId, contentId },
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

export async function getUserImageById(userId: string, imageId: string) {
  try {
    const image = await prisma.image.findFirst({
      where: { userId, id: imageId },
    });

    if (!image) {
      return {
        success: false,
        message: 'Error during image fetched',
      };
    }

    const imageWithUrl = {
      ...image,
      url: await generateGetPreSignUrl({ key: image.s3Key }),
    };

    return {
      success: true,
      message: 'Image fetched from DB',
      image: imageWithUrl,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during image fetched',
    };
  }
}

export async function attachImageToContent(contentId: string, imageId: string) {
  try {
    const { verifyUser } = await verifyUserByContent(contentId);

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image || image.userId !== verifyUser.userId) {
      return {
        success: false,
        message: 'Did not found image for that user',
      };
    }

    await prisma.image.update({
      where: { id: imageId },
      data: {
        contentId,
      },
    });

    return {
      success: true,
      message: 'Successfully attached image to content',
    };
  } catch (error) {
    console.error('Error during attempt to attach image to content', error);
    return {
      success: false,
      message: 'Error during attempt to attach image to content',
    };
  }
}

export async function getUnattachedImages(userId: string) {
  try {
    await getUserSession();

    const images = await prisma.image.findMany({
      where: { userId, contentId: null },
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

export async function deleteImage(imageId: string) {
  try {
    await getUserSession();

    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image) {
      return {
        success: false,
        message: 'Images not found in DB',
      };
    }

    await deleteImageFromBucket({ key: image.s3Key });

    await prisma.image.delete({ where: { id: imageId } });

    revalidatePath('/images');

    return {
      success: true,
      message: 'Images deleted from DB',
    };
  } catch (error) {
    console.error('Error during attempt to delete image', error);
    return {
      success: false,
      message: 'Error during attempt to delete image',
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

// Project actions

export async function createProject(data: CreateProjectProps) {
  try {
    const { session } = await getUserSession();
    const project = await prisma.project.create({
      data: { ...data, userId: session.user.id },
    });

    return {
      success: true,
      message: 'Project created successfully',
      project,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during attempt to create project',
    };
  }
}

export async function getUserProjects(userId: string) {
  try {
    await getUserSession();
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });

    return {
      success: true,
      message: 'Projects fetched successfully',
      projects,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during attempt to fetch user projects',
    };
  }
}

export async function getUserProjectById(userId: string, projectId: string) {
  try {
    await getUserSession();
    const project = await prisma.project.findFirst({
      where: { userId, id: projectId },
      include: {
        contents: {
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { contents: true },
        },
      },
    });

    if (!project) {
      return {
        success: false,
        message: 'Error during attempt to fetch user project',
      };
    }

    return {
      success: true,
      message: 'Project fetched successfully',
      project,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during attempt to fetch user project',
    };
  }
}

export async function updateProject(
  projectId: string,
  data: CreateProjectProps
) {
  try {
    const { session } = await getUserSession();

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== session.user.id) {
      return {
        success: false,
        message: 'Project not found',
      };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { ...data },
    });

    revalidatePath('/projects');

    return { success: true, message: 'Project updated successfully' };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during attempt to update project',
    };
  }
}

export async function deleteProject(userId: string, projectId: string) {
  try {
    await getUserSession();

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return {
        success: false,
        message: 'Error during attempt to delete user project',
      };
    }

    await prisma.project.delete({ where: { id: projectId, userId } });

    revalidatePath('/projects');

    return { success: true, message: 'Project deleted successfully' };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error during attempt to delete user project',
    };
  }
}

export async function assignContentToProject(
  contentId: string,
  projectId: string | null
) {
  try {
    const { verifyUser } = await verifyUserByContent(contentId);

    const content = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content || content.userId !== verifyUser.userId) {
      return {
        success: false,
        message: 'Did not found content for that user',
      };
    }

    await prisma.content.update({
      where: { id: contentId },
      data: {
        projectId,
      },
    });

    revalidatePath('/projects');

    return {
      success: true,
      message: 'Successfully attached image to content',
    };
  } catch (error) {
    console.error('Error during attempt to attach image to content', error);
    return {
      success: false,
      message: 'Error during attempt to attach image to content',
    };
  }
}

// Tags actions

export async function getAllTags() {
  try {
    await getUserSession();

    const tags = await prisma.tag.findMany();

    if (!tags) {
      return {
        success: false,
        message: 'No tags',
      };
    }

    return {
      success: true,
      message: 'Tags fetched successfully',
      tags,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Error during fetching tags',
    };
  }
}

export async function getContentTags(contentId: string) {
  try {
    await getUserSession();

    const content = await prisma.content.findUnique({
      where: { id: contentId },
      select: { tags: true },
    });

    if (!content) {
      return {
        success: false,
        message: 'No tags for that conent',
      };
    }

    return {
      success: true,
      message: 'Tags fetched successfully',
      content,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Error during fetching tags for content',
    };
  }
}

export async function addTagToConent(contentId: string, tagName: string) {
  try {
    await getUserSession();

    const tag = await prisma.content.update({
      where: { id: contentId },
      data: {
        tags: {
          connectOrCreate: {
            where: { name: tagName },
            create: { name: tagName },
          },
        },
      },
    });

    revalidatePath('/content');

    return {
      success: true,
      message: 'Tag successfully added to content',
      tag,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Error during adding tag to content',
    };
  }
}

export async function removeTagFromContent(contentId: string, tagId: string) {
  try {
    await getUserSession();

    const tag = await prisma.content.update({
      where: { id: contentId },
      data: {
        tags: {
          disconnect: { id: tagId },
        },
      },
    });

    revalidatePath('/');

    return {
      success: true,
      message: 'Tag successfully deleted from content',
      tag,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Error during deletion tag from content',
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
