'use server';

import { prisma } from '../prisma';
import { deleteImageFromBucket, generateGetPreSignUrl } from '../aws';
import { Image } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getUserSession, verifyUserByContent } from './actions';
import type { SaveImageMetadataProps } from '@/types/types';

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
