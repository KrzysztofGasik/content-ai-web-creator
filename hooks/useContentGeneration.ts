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
    const result = await fetch('/api/auth/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      toast.error('Error during sending query to AI');
      return;
    }

    setGeneratedContent('');
    setIsGenerating(true);

    const reader = result.body?.getReader();
    if (!reader) {
      return null;
    }
    const decoder = new TextDecoder();
    let finalContent = '';
    try {
      let chunkCounter = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }
        // eslint-disable-next-line
        chunkCounter++;

        const chunk = decoder.decode(value, { stream: true });
        finalContent += chunk;
        setGeneratedContent((prev) => prev + chunk);
      }
    } catch (error) {
      console.error('Error during sending query to AI', error);
    } finally {
      setIsGenerating(false);
      reader.releaseLock();
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
          generatedText: finalContent,
          model: 'gpt-3.5-turbo',
        },
      });
      if (saveResult.success && saveResult.contentId) {
        setSavedContentId(saveResult?.contentId);
      }
      toast.success('Successfully generated content to AI ');
    }
  };

  return { generatedContent, isGenerating, savedContentId, generateContent };
}
