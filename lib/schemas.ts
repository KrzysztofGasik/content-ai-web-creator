import { ContentType } from '@/prisma/generated/enums';
import z from 'zod';
import { imageQuality, imageSize, imageStyle } from './utils';

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const generateSchema = z.object({
  templateSelector: z.string(),
  id: z.string().optional(),
  topic: z.string(),
  contentType: z.enum(Object.values(ContentType)),
  tone: z.enum(['professional', 'casual', 'friendly']),
  context: z.string().optional(),
});

export const uploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  fileSize: z.number().optional(),
});

export const generateImageSchema = z.object({
  prompt: z.string(),
  size: z.enum(imageSize).optional(),
  quality: z.enum(imageQuality).optional(),
  style: z.enum(imageStyle).optional(),
});

export const createProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const updateProfileSchema = z.object({
  email: z.email(),
  name: z.string(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });
