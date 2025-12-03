'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { getUserSession } from './actions';

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
