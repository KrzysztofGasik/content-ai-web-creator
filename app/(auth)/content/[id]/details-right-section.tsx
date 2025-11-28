'use client';

import { Content } from '@/prisma/app/generated/prisma/client/client';
import { SetStateAction } from 'react';
import { Badge } from '@/components/ui/badge';
import { ContentDetailsActions } from '@/components/content-details-actions';
import { Card, CardContent } from '@/components/ui/card';
import { ExportFile, ImageContentData, ImageDataType } from '@/types/types';
import { Separator } from '@/components/ui/separator';
import { VersionHistory } from './version-history';
import { Input } from '@/components/ui/input';
import { LabelInputWrapper } from '@/components/label-input-wrapper';
import { useSession } from 'next-auth/react';
import useFileUpload from '@/hooks/useFileUpload';
import { toast } from 'sonner';
import { getContentImages, saveImageMetadata } from '@/lib/actions';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { ImagesGallerySkeleton } from '@/components/loaders/images-gallery-skeleton';

type DetailsLeftSectionProps = {
  content: Content | null | undefined;
  textContent: string;
  handleCopy: (text: string) => void;
  handleEdit: () => void;
  handleSave: () => void;
  handleDownload: (data: ExportFile) => void;
  handleFavorite: () => void;
  handleArchived: () => void;
  handleDelete: () => void;
  setDeleteContentId: React.Dispatch<SetStateAction<string | null>>;
  setShowDeleteDialog: React.Dispatch<SetStateAction<boolean>>;
  generatedContent: string;
  editedContent: string;
  isEditing: boolean;
  isFavorite: boolean;
  isArchived: boolean;
};

export const DetailsRightSection = ({
  content,
  textContent,
  handleCopy,
  handleEdit,
  handleDownload,
  handleFavorite,
  handleArchived,
  handleSave,
  setDeleteContentId,
  setShowDeleteDialog,
  editedContent,
  isEditing,
}: DetailsLeftSectionProps) => {
  const session = useSession();
  const { isUploading, uploadFile } = useFileUpload();
  const contentId = content?.id as string;
  const { data, isLoading } = useQuery<ImageContentData>({
    queryKey: ['details-image', contentId],
    queryFn: () => getContentImages(contentId),
  });
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!session.data?.user?.id) {
      toast.error('You must be logged in to upload images');
      return;
    }

    const uploadResult = await uploadFile(file);

    if (uploadResult.success) {
      const { url, key, bucket } = uploadResult.data as ImageDataType;
      const fileName = file.name;
      const size = file.size;
      const contentType = file.type;

      const saveImageMetadataResult = await saveImageMetadata({
        key,
        bucket,
        url,
        filename: fileName,
        size,
        contentType,
        userId: session.data?.user.id as string,
        contentId: content?.id,
      });

      if (saveImageMetadataResult.success) {
        toast.success('Successfully file uploaded');
        queryClient.invalidateQueries({
          queryKey: ['details-image', contentId],
        });
      } else {
        toast.error(
          `Error during file upload - ${saveImageMetadataResult.message}`
        );
      }
    } else {
      toast.error(`Error during file upload - ${uploadResult.error}`);
    }
  };

  const exportObject = {
    title: content?.title,
    content: textContent,
    createdAt: content?.createdAt.toLocaleDateString(),
    contentType: content?.type,
    model: content?.model,
  };

  // Finish loading skeleton

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex justify-evenly gap-2 mb-4">
          <Badge className="p-3" variant="outline">
            Created at: {content?.createdAt.toLocaleDateString()}
          </Badge>
          <Badge className="p-3" variant="outline">
            Model: {content?.model}
          </Badge>
          <Badge className="p-3" variant="outline">
            Tokens: {content?.tokens || '0'}
          </Badge>
        </div>
        <ContentDetailsActions
          handleCopy={() => handleCopy(textContent)}
          handleEdit={handleEdit}
          handleDownload={(data) => handleDownload(data)}
          handleFavorite={handleFavorite}
          handleArchived={handleArchived}
          handleSave={handleSave}
          handleDelete={() => {
            setDeleteContentId(content?.id as string);
            setShowDeleteDialog(true);
          }}
          generatedContent={textContent}
          editedContent={editedContent}
          isEditing={isEditing}
          isFavorite={Boolean(content?.isFavorite)}
          isArchived={Boolean(content?.isArchived)}
          exportData={exportObject}
        />
        <Separator className="my-6" />
        <LabelInputWrapper label="Upload your images here">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isLoading ? (
            <ImagesGallerySkeleton />
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {data?.images?.map((image) => (
                <Image
                  src={image.url}
                  alt={image.filename}
                  key={image.id}
                  width={100}
                  height={100}
                  className="rounded-sm"
                />
              ))}
            </div>
          )}
        </LabelInputWrapper>
        <Separator className="my-6" />
        <VersionHistory contentId={content?.id} />
      </CardContent>
    </Card>
  );
};
