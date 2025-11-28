'use client';

import DeleteContentDialog from '@/components/delete-content-dialog';
import { Label } from '@/components/ui/label';
import { getContentDetails } from '@/lib/actions';
import type { ContentDetailsData } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { DetailsLeftSection } from './details-left-section';
import { DetailsRightSection } from './details-right-section';
import useContentDetailsActions from '@/hooks/useContentDetailsActions';
import { EmptyState } from '@/components/empty-state';
import { ContentDetailsSkeleton } from '@/components/loaders/content-details-skeleton';

export default function ContentDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError } = useQuery<ContentDetailsData>({
    queryKey: ['content-details', id],
    queryFn: () => getContentDetails(id),
  });
  const textContent = (data?.content?.editedText ??
    data?.content?.generatedText) as string;

  const {
    handleCopy,
    handleEdit,
    handleSave,
    handleDownload,
    handleFavorite,
    handleArchived,
    handleDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    deleteContentId,
    setDeleteContentId,
  } = useContentDetailsActions({
    contentId: id,
    content: data?.content,
    textContent,
    editedContent,
    setEditedContent,
    isEditing,
    setIsEditing,
  });

  if (isLoading) {
    return <ContentDetailsSkeleton />;
  }

  if (isError) {
    return <Label>Something went wrong - error!</Label>;
  }

  if (!data) {
    return <EmptyState title="Details" text="No details for given item" />;
  }

  const { content } = data;

  return (
    <section className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 lg:flex-[2]">
        <DetailsLeftSection
          content={content}
          isEditing={isEditing}
          editedContent={editedContent}
          setEditedContent={setEditedContent}
          textContent={textContent}
        />
      </div>
      <div className="flex-1 lg:flex-[1]">
        <DetailsRightSection
          content={content}
          textContent={textContent}
          handleCopy={handleCopy}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleDownload={handleDownload}
          handleFavorite={handleFavorite}
          handleArchived={handleArchived}
          handleDelete={handleArchived}
          generatedContent={content?.generatedText || ''}
          editedContent={editedContent}
          isEditing={isEditing}
          isFavorite={Boolean(content?.isFavorite)}
          isArchived={Boolean(content?.isArchived)}
          setDeleteContentId={setDeleteContentId}
          setShowDeleteDialog={setShowDeleteDialog}
        />
      </div>
      {showDeleteDialog && (
        <DeleteContentDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          deleteContentId={deleteContentId}
        />
      )}
      <Toaster position="top-center" />
    </section>
  );
}
