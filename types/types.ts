import {
  createProjectSchema,
  generateImageSchema,
  generateSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from '@/lib/schemas';
import { Image, Project, Tag } from '@prisma/client';
import { Content, ContentType, ContentVersion } from '@prisma/client';
import { ImageGenerateParamsBase } from 'openai/resources/images.mjs';
import z from 'zod';

export type ContentData = {
  data: Pick<
    Content,
    'title' | 'type' | 'prompt' | 'generatedText' | 'model' | 'tokens'
  >;
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
export type SortOptions = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export type SearchParamsProps = {
  project?: string;
  newType?: ContentTypeParams;
  tags?: string[];
  favorite?: boolean;
  archived?: boolean;
  sort?: SortOptions;
};

export type SaveImageMetadataProps = {
  key: string;
  bucket: string;
  url: string;
  filename: string;
  size: number;
  contentType: string;
  userId: string;
  width: number;
  height: number;
  isGenerated: boolean;
  contentId?: string | undefined;
  prompt?: string;
  quality?: string;
  style?: string;
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

export type CreateProjectProps = {
  name: string;
  description?: string | undefined;
  color?: string | undefined;
};

export type CreateProjectType = {
  success: boolean;
  message: string;
  project?: Project | undefined;
};

export type ProjectWithCount = Project & {
  contents?: Content[];
  _count: {
    contents: number;
  };
};

export type UserProjectType = {
  success: boolean;
  message: string;
  projects?: ProjectWithCount[] | undefined;
};

export type TagsData = {
  success: boolean;
  message: string;
  tags?: Tag[] | undefined;
};

export type TagsWithContentData = {
  success: boolean;
  message: string;
  content?: {
    tags: Tag[] | undefined;
  };
};

export type StatCardDataProps = {
  id: number | string;
  title: string;
  description: string | React.ReactNode;
  content: string | React.ReactNode;
  footer: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};
export type ChartItem = { date: string; content: number; images: number };
export type ChartData = ChartItem[];
export type ImageSizeParam = '1024x1024' | '1024x1792' | '1792x1024';
export type ImageQualityParam = 'standard' | 'hd';
export type ImageParams = {
  size: ImageSizeParam;
  quality: ImageQualityParam;
};
export type TokensData = {
  totalCredits: number;
  tokensUsed: number;
  creditsRemaining: number;
  contentTokens: number;
  imageTokens: number;
};

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type GenerateData = z.infer<typeof generateSchema>;
export type ImageGenerateParams = z.infer<typeof generateImageSchema>;
export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
