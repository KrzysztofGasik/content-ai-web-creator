import { GenerateData } from '@/types/types';
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
