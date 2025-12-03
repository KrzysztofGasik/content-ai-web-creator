'use server';

import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import { getUserSession, verifyUserByContent } from './actions';
import type { CreateProjectProps } from '@/types/types';

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
