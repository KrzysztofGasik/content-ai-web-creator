import {
  deleteContent,
  toggleArchived,
  toggleFavorite,
  updateContent,
} from '@/lib/actions';
import { exportAsMarkdown } from '@/lib/utils';
import { Content } from '@prisma/client';
import { ExportFile } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  contentId: string;
  content: Content | null | undefined;
  textContent: string;
  editedContent: string;
  setEditedContent: React.Dispatch<SetStateAction<string>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<SetStateAction<boolean>>;
};

export default function useContentDetailsActions({
  contentId,
  content,
  textContent,
  editedContent,
  setEditedContent,
  isEditing,
  setIsEditing,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Content copied');
  };

  const handleEdit = () => {
    if (!isEditing) {
      setEditedContent(textContent);
    } else {
      setEditedContent('');
    }
    setIsEditing((prev) => !prev);
  };

  const handleDownload = (data: ExportFile) => {
    exportAsMarkdown(data);
  };

  const handleFavorite = async () => {
    try {
      const result = await toggleFavorite(content?.id as string);
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['content-details', contentId],
        });
        toast.success(
          content?.isFavorite ? 'Removed from favorites' : 'Added to favorites'
        );
      } else {
        toast.error('Error during attempt to add to favorites');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during attempt to add to favorites');
    }
  };

  const handleArchived = async () => {
    try {
      const result = await toggleArchived(content?.id as string);
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['content-details', contentId],
        });
        toast.success(
          content?.isArchived ? 'Removed from archived' : 'Added to archived'
        );
      } else {
        toast.error('Error during attempt to add to archived');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during attempt to add to archived');
    }
  };

  const handleSave = async () => {
    if (
      editedContent.trim() !== '' &&
      editedContent !== textContent &&
      content
    ) {
      try {
        const result = await updateContent({
          contentId: content.id,
          editedContent: editedContent,
        });
        if (result.success) {
          setIsEditing(false);
          setEditedContent('');
          queryClient.invalidateQueries({
            queryKey: ['content-details', contentId],
          });
          toast.success('Successfully updated content');
        } else {
          toast.error('Error during attempt to update content');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error during attempt to update content');
      }
    }
  };

  const handleDelete = async (contentId: string) => {
    try {
      const result = await deleteContent(contentId);
      if (result.success) {
        setShowDeleteDialog(false);
        toast.success('Content deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['content'] });
        router.push('/content');
      } else {
        toast.error('Error during content deleting');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during content deleting');
    }
  };

  return {
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
  };
}
