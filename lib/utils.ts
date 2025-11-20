import { ExportFile, GenerateData } from '@/types/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type PromptTextProps = {
  topic: string;
  tone: GenerateData['tone'];
  contentType: GenerateData['contentType'];
  context: string | undefined;
};

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
