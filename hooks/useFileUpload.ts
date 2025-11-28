import { ImageDataType } from '@/types/types';
import { useState } from 'react';

export default function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const { name, type, size } = file;
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: name,
          contentType: type,
          fileSize: size,
        }),
      });
      if (!res.ok) {
        throw new Error('Image upload failed');
      }
      const data: ImageDataType = await res.json();
      const { url, publicUrl, key, bucket } = data;

      const uploadImage = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': type },
        body: file,
      });

      if (!uploadImage.ok) {
        throw new Error('Image upload failed');
      }

      setIsUploading(false);
      return { success: true, data: { url: publicUrl, key, bucket } };
    } catch (error) {
      setIsUploading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return { isUploading, uploadFile };
}
