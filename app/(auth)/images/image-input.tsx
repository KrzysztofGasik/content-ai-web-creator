'use client';

import { LabelInputWrapper } from '@/components/label-input-wrapper';
import { Input } from '@/components/ui/input';
import useFileUpload from '@/hooks/useFileUpload';
import { uploadAndSaveFile } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const ImageInput = () => {
  const { isUploading, uploadFile } = useFileUpload();
  const queryClient = useQueryClient();
  const session = useSession();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadAndSaveFile({
      e,
      userId: session.data?.user.id as string,
      uploadFile,
      contentId: undefined,
      queryClient,
      queryKey: ['user-images', session.data?.user.id],
    });
  };

  return (
    <LabelInputWrapper label="Select file to upload to your gallery">
      <Input
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={(e) => handleUpload(e)}
      />
    </LabelInputWrapper>
  );
};
