import { saveGeneratedContent } from '@/lib/actions/content-actions';
import { generatePromptText } from '@/lib/utils';
import { GenerateData } from '@/types/types';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useContentGeneration() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedContentId, setSavedContentId] = useState<string | null>(null);

  const generateContent = async (data: GenerateData) => {
    try {
      setGeneratedContent('');
      setIsGenerating(true);

      const response = await fetch('/api/auth/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast.error('Error during sending query to AI');
        return;
      }

      const result = await response.json();
      const { content, tokens } = result;
      setGeneratedContent(content);

      const saveResult = await saveGeneratedContent({
        data: {
          title: data.topic || 'No topic',
          type: data.contentType,
          prompt: generatePromptText({
            topic: data.topic,
            tone: data.tone,
            contentType: data.contentType,
            context: data.context,
          }),
          generatedText: content,
          model: 'gpt-3.5-turbo',
          tokens: tokens || 0,
        },
      });
      if (saveResult.success && saveResult.contentId) {
        setSavedContentId(saveResult?.contentId);
      }
      toast.success('Successfully generated content to AI ');
    } catch (error) {
      console.error('Error during sending query to AI', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatedContent, isGenerating, savedContentId, generateContent };
}
