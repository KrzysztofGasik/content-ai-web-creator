import {
  ExportFile,
  ExtractFromStringProps,
  ImageDataType,
  PromptTextProps,
} from '@/types/types';
import type { Image } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { saveImageMetadata } from './actions/image-actions';
import { QueryClient } from '@tanstack/react-query';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePromptText = ({
  topic,
  tone,
  contentType,
  context,
}: PromptTextProps) => `
You are an expert in creating creative content. You will be provided with topic, content type, tone and context (tone and context is optional).


Write a ${contentType} about ${topic} in a ${tone} tone.

${context}
`;

export const extractValuesFromString = ({
  text,
  topic,
  tone,
  context,
}: ExtractFromStringProps) => {
  let modifyString = text.replace(/{topic}/g, topic);
  modifyString = modifyString.replace(/{tone}/g, tone);
  modifyString = modifyString.replace(/{context}/g, context || '');
  return modifyString;
};

export const exportAsMarkdown = ({
  title,
  content,
  createdAt,
  contentType,
  model,
}: ExportFile) => {
  const sanitizeTitle = title
    ?.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const markdown = `# ${title || 'No title'}

**Created:** ${createdAt}
**Type:** ${contentType?.toLowerCase().replace('_', ' ')}
**Model:** ${model}

## Content body

${content}`.trim();

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const urlObj = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = urlObj;
  anchor.download = `${sanitizeTitle}.md`;
  anchor.click();
  URL.revokeObjectURL(urlObj);
};

export const exportAsImage = (image: Image) => {
  const anchor = document.createElement('a');
  anchor.href = image.url;
  anchor.download = image.filename;
  anchor.target = '_blank';
  anchor.click();
};

export const imageSize = [
  '1024x1024',
  'auto',
  '1536x1024',
  '1024x1536',
  '256x256',
  '512x512',
  '1792x1024',
  '1024x1792',
] as const;
export const imageQuality = ['auto', 'standard', 'hd', 'low', 'medium', 'high'];
export const imageStyle = ['vivid', 'natural'];

type uploadAndSaveFileProps = {
  e: React.ChangeEvent<HTMLInputElement>;
  userId: string;
  uploadFile: (file: File) => Promise<
    | {
        success: boolean;
        data: {
          url: string;
          key: string;
          bucket: string;
        };
        error?: undefined;
      }
    | {
        success: boolean;
        error: string;
        data?: undefined;
      }
  >;
  contentId?: string | undefined;
  queryClient: QueryClient;
  queryKey: [string, string | undefined];
};

export async function uploadAndSaveFile({
  e,
  userId,
  uploadFile,
  contentId,
  queryClient,
  queryKey,
}: uploadAndSaveFileProps) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!userId) {
    toast.error('You must be logged in to upload images');
    return;
  }

  const uploadResult = await uploadFile(file);

  if (uploadResult.success) {
    const { url, key, bucket } = uploadResult.data as ImageDataType;
    const fileName = file.name;
    const size = file.size;
    const contentType = file.type;

    const { width, height } = await extractImageDim(file);

    const saveImageMetadataResult = await saveImageMetadata({
      key,
      bucket,
      url,
      filename: fileName,
      size,
      contentType,
      userId,
      width,
      height,
      isGenerated: false,
      contentId: contentId || undefined,
      prompt: undefined,
      quality: undefined,
      style: undefined,
    });

    if (saveImageMetadataResult.success) {
      toast.success('Successfully file uploaded');
      queryClient.invalidateQueries({
        queryKey,
      });
      e.target.files = null;
    } else {
      toast.error(
        `Error during file upload - ${saveImageMetadataResult.message}`
      );
    }
  } else {
    toast.error(`Error during file upload - ${uploadResult.error}`);
  }
}

export async function extractImageDim(
  file: File
): Promise<{ width: number; height: number }> {
  const image = new Image();
  const result: { width: number; height: number } = await new Promise(
    (resolve) => {
      const objUrl = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(image.src);
        resolve({ width: image.width, height: image.height });
      };
      image.src = objUrl;
    }
  );

  return result;
}
