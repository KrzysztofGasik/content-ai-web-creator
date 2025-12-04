'use client';

import { Content } from '@prisma/client';
import { SetStateAction, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ContentDetailsActions } from '@/components/actions/content-details-actions';
import { Card, CardContent } from '@/components/ui/card';
import { ExportFile, ImageContentData } from '@/types/types';
import { Separator } from '@/components/ui/separator';
import { VersionHistory } from './version-history';
import { Input } from '@/components/ui/input';
import { LabelInputWrapper } from '@/components/label-input-wrapper';
import { useSession } from 'next-auth/react';
import useFileUpload from '@/hooks/useFileUpload';
import { getContentImages } from '@/lib/actions/image-actions';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { ImagesGallerySkeleton } from '@/components/loaders/images-gallery-skeleton';
import { uploadAndSaveFile } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AttachImagesDialog from '@/components/attach-images-dialog';
import { Tags } from './tags';

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
  isSaving: boolean;
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
  isSaving,
}: DetailsLeftSectionProps) => {
  const [showAttachDialog, setShowAttachDialog] = useState(false);
  const session = useSession();
  const { isUploading, uploadFile } = useFileUpload();
  const contentId = content?.id as string;
  const { data, isLoading } = useQuery<ImageContentData>({
    queryKey: ['details-image', contentId],
    queryFn: () => getContentImages(contentId),
  });
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadAndSaveFile({
      e,
      userId: session.data?.user?.id as string,
      uploadFile,
      contentId,
      queryClient,
      queryKey: ['details-image', contentId],
    });
  };

  const exportObject = {
    title: content?.title,
    content: textContent,
    createdAt: content?.createdAt.toLocaleDateString(),
    contentType: content?.type,
    model: content?.model,
  };

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
          isSaving={isSaving}
        />
        <Separator className="my-6" />
        <Button
          className="transition-colors duration-200"
          onClick={() => setShowAttachDialog(true)}
        >
          Attach from Gallery
        </Button>
        <p className="my-2">OR</p>
        <LabelInputWrapper label="Upload locally your image">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="transition-all duration-200 focus:scale-[1.01]"
          />
          {isLoading ? (
            <ImagesGallerySkeleton />
          ) : (
            <div className="grid grid-cols-5 gap-3 mx-auto">
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
        <Separator className="my-6" />
        <Tags contentId={content?.id as string} />
      </CardContent>
      {showAttachDialog && (
        <AttachImagesDialog
          open={showAttachDialog}
          onClose={() => setShowAttachDialog(false)}
          contentId={content?.id as string}
          userId={session.data?.user.id as string}
        />
      )}
    </Card>
  );
};
