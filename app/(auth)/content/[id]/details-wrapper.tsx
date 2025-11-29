'use client';

import useContentDetailsActions from '@/hooks/useContentDetailsActions';
import { Content } from '@prisma/client';
import { useState } from 'react';
import { DetailsLeftSection } from './details-left-section';
import { DetailsRightSection } from './details-right-section';
import DeleteContentDialog from '@/components/delete-content-dialog';
import { Toaster } from 'sonner';

export default function DetailsWrapper({
  initialData,
}: {
  initialData: {
    content: Content | null | undefined;
    textContent: string;
    id: string;
  };
}) {
  const { content, textContent, id } = initialData;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

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
    content,
    textContent,
    editedContent,
    setEditedContent,
    isEditing,
    setIsEditing,
  });

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
          deleteContentTypeId={deleteContentId}
          contentType="content"
        />
      )}
      <Toaster position="top-center" />
    </section>
  );
}
