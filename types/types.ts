import { generateSchema, loginSchema, registerSchema } from '@/lib/schemas';
import {
  Content,
  ContentType,
} from '@/prisma/app/generated/prisma/client/client';
import z from 'zod';

export type ContentData = {
  data: Pick<Content, 'title' | 'type' | 'prompt' | 'generatedText' | 'model'>;
};

export type UpdateData = {
  contentId: string;
  editedContent: string;
};

export type ContentFullData = {
  success: boolean;
  message: string;
  contents?: Content[];
};

export type ContentDetailsData = {
  success: boolean;
  message: string;
  content?: Content | null;
};

export type CardDataProps = {
  id: number | string;
  title: string;
  description: string;
  content: string;
  footer: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

export type ExportFile = {
  title: string | undefined;
  content: string;
  createdAt: string | undefined;
  contentType: ContentType | undefined;
  model: string | undefined;
};

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type GenerateData = z.infer<typeof generateSchema>;
