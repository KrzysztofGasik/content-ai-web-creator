'use server';

import { ChartData } from '@/types/types';
import { prisma } from '../prisma';
import { getUserSession } from './actions';

export async function getUserContentStats() {
  try {
    const { session } = await getUserSession();

    const userId = session.user.id;

    const contentCount = await prisma.content.count({ where: { userId } });
    const imageCount = await prisma.image.count({ where: { userId } });
    const projectCount = await prisma.project.count({ where: { userId } });

    return {
      success: true,
      message: 'Stats for content, image, project fetched successfully',
      contentCount,
      imageCount,
      projectCount,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Fetching stats for content, image, project failed',
    };
  }
}

export async function getGroupContentStats() {
  try {
    const { session } = await getUserSession();

    const userId = session.user.id;

    const groupContent = await prisma.content.groupBy({
      by: ['type'],
      where: { userId },
      _count: { type: true },
    });

    const imagesCount = await prisma.image.count({
      where: { userId },
    });

    const mapGroupContent = groupContent.map((content) => ({
      name: content.type,
      value: content._count.type,
    }));

    return {
      success: true,
      message: 'Stats for grouped content fetched successfully',
      content: [...mapGroupContent, { name: 'Images', value: imagesCount }],
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Fetching stats for grouped content failed',
    };
  }
}

export async function getTimeLineStats() {
  try {
    const { session } = await getUserSession();

    const userId = session.user.id;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const content = await prisma.content.findMany({
      where: { userId, createdAt: { gte: last7Days } },
    });

    const image = await prisma.image.findMany({
      where: { userId, createdAt: { gte: last7Days } },
    });

    const chartData: ChartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const contentCount = content.filter(
        (item) => item.createdAt.toDateString() === date.toDateString()
      ).length;
      const imageCount = image.filter(
        (item) => item.createdAt.toDateString() === date.toDateString()
      ).length;

      chartData.push({
        date: date.toLocaleDateString(),
        content: contentCount,
        images: imageCount,
      });
    }

    return {
      success: true,
      message: 'Time line stats fetched successfully',
      chartData,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Fetching time line stats failed',
    };
  }
}

export async function getUserCreditsInfo() {
  try {
    const { session } = await getUserSession();
    const userId = session.user.id;

    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      return {
        success: false,
        message: 'User data not found',
      };
    }

    const contentTokensData = await prisma.content.aggregate({
      where: { userId },
      _sum: { tokens: true },
    });
    const imageTokensData = await prisma.image.aggregate({
      where: { userId },
      _sum: { tokens: true },
    });
    const contentTokens = contentTokensData._sum.tokens || 0;
    const imageTokens = imageTokensData._sum.tokens || 0;

    const tokensUsed = contentTokens + imageTokens;
    const remainingTokens = userData?.credits - tokensUsed;

    return {
      success: true,
      message: 'Credit stats fetched successfully',
      tokens: {
        totalCredits: userData.credits,
        tokensUsed,
        creditsRemaining: remainingTokens,
        contentTokens,
        imageTokens,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Fetching credit stats failed',
    };
  }
}
