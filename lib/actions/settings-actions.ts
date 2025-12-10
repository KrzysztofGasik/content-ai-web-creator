'use server';

import { UpdatePasswordData, UpdateProfileData } from '@/types/types';
import { prisma } from '../prisma';
import { getUserSession } from './actions';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function updateProfileTab({ name, email }: UpdateProfileData) {
  try {
    const { session } = await getUserSession();
    const userId = session?.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
    });

    revalidatePath('/');

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Error during profile update',
    };
  }
}

export async function updatePasswordTab({
  currentPassword,
  newPassword,
}: UpdatePasswordData) {
  try {
    const { session } = await getUserSession();
    const userId = session?.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const comparePasswords = await bcrypt.compare(
      currentPassword,
      user?.password as string
    );

    if (!comparePasswords) {
      return {
        success: false,
        message: 'Incorrect current password',
      };
    }

    const hashNew = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashNew,
      },
    });

    revalidatePath('/');

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Error during password update',
    };
  }
}
