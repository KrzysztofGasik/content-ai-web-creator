import { ContentType } from '@/prisma/app/generated/prisma/client/enums';
import z from 'zod';

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
