import {
  generateImageSchema,
  generateSchema,
  loginSchema,
  registerSchema,
} from '@/lib/schemas';
import { Image } from '@prisma/client';
import { Content, ContentType, ContentVersion } from '@prisma/client';
import { ImageGenerateParamsBase } from 'openai/resources/images.mjs';
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
  content: string | Image;
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

export type VersionsData = {
  success: boolean;
  message: string;
  versions?: ContentVersion[] | null;
};

export type ContentTemplateData = {
  success: boolean;
  message: string;
  templates?: ContentTemplate[] | null;
};

export type ContentTemplate = {
  _id: string;
  name: string;
  description: string | null;
  contentType: string;
  promptTemplate: string;
  defaultTone: string | null;
  category: string | null;
};

export type ContentTypeParams = ContentType | 'ALL';

export type SearchParamsProps = {
  newType?: ContentTypeParams;
  favorite?: boolean;
  archived?: boolean;
};

export type SaveImageMetadataProps = {
  key: string;
  bucket: string;
  url: string;
  filename: string;
  size: number;
  contentType: string;
  userId: string;
  contentId?: string | undefined;
};

export type ImageDataType = {
  url: string;
  publicUrl: string;
  key: string;
  bucket: string;
};

export type ImageContentData = {
  success: boolean;
  message: string;
  images?: Image[] | null;
};

export type PromptTextProps = {
  topic: string;
  tone: GenerateData['tone'];
  contentType: GenerateData['contentType'];
  context: string | undefined;
};

export type ExtractFromStringProps = {
  text: string;
  topic: string;
  tone: GenerateData['tone'];
  context: string | undefined;
};

export type ImageSize = ImageGenerateParamsBase['size'];
export type ImageQuality = ImageGenerateParamsBase['quality'];
export type ImageStyle = ImageGenerateParamsBase['style'];

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type GenerateData = z.infer<typeof generateSchema>;
export type ImageGenerateParams = z.infer<typeof generateImageSchema>;
