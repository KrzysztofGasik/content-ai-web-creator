'use client';

import { Button } from '@/components/ui/button';
import { Content } from '@/prisma/app/generated/prisma/client/client';
import { useRouter } from 'next/navigation';
import { Star, Archive, ArchiveX } from 'lucide-react';
import { SetStateAction } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ContentDetailsActions } from '@/components/content-details-actions';
import { Card, CardContent } from '@/components/ui/card';
import { ExportFile } from '@/types/types';
import { Separator } from '@/components/ui/separator';
import { VersionHistory } from './version-history';

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
  handleDelete,
  setDeleteContentId,
  setShowDeleteDialog,
  editedContent,
  isEditing,
}: DetailsLeftSectionProps) => {
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
        />
        <Separator />
        <VersionHistory contentId={content?.id} />
      </CardContent>
    </Card>
  );
};
