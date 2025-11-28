import {
  ExportFile,
  ExtractFromStringProps,
  PromptTextProps,
} from '@/types/types';
import { Image } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
