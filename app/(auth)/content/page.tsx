'use client';

import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { WrapperCenter } from '@/components/wrapper-center';
import { deleteContent, getUserContent, updateContent } from '@/lib/actions';
import type { Content } from '@/prisma/app/generated/prisma/client/client';
import { ContentFullData } from '@/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import CardComponent from '../dashboard/card';
import { ContentActions } from '@/components/content-actions';
import { SetStateAction, useMemo, useState } from 'react';
import DeleteContentDialog from '@/components/delete-content-dialog';
import { toast, Toaster } from 'sonner';
import { Input } from '@/components/ui/input';

export default function Content() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedContents, setEditedContents] = useState<Record<string, string>>(
    {}
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null);
  const { data: session } = useSession();
  const { data, isLoading } = useQuery<ContentFullData>({
    queryKey: ['content', session?.user.id],
    queryFn: () => getUserContent(),
  });
  const queryClient = useQueryClient();

  const filteredContent = useMemo(() => {
    if (!searchQuery) return data?.contents || [];
    return data?.contents?.filter((element) => {
      return (
        element.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.generatedText
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        element.editedText?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data?.contents, searchQuery]);

  if (isLoading) {
    return (
      <WrapperCenter>
        <Spinner className="size-15" />
      </WrapperCenter>
    );
  }

  if (!data || data.contents?.length === 0) {
    return (
      <Label>No content? Just go to Generate Content and create some :)</Label>
    );
  }

  const handleEdit = (contentId: string, currentContent: string) => {
    if (editingCardId === contentId) {
      setEditingCardId(null);
    } else {
      setEditingCardId(contentId);
      setEditedContents((prev) => ({ ...prev, [contentId]: currentContent }));
    }
  };

  const handleDelete = async (contentId: string) => {
    try {
      const result = await deleteContent(contentId);
      if (result.success) {
        setShowDeleteDialog(false);
        toast.success('Content deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['content'] });
      } else {
        toast.error('Error during content deleting');
      }
    } catch (error) {
      toast.error('Error during content deleting');
    }
  };

  const handleSave = async (contentId: string) => {
    if (editedContents[contentId]) {
      try {
        const result = await updateContent({
          contentId,
          editedContent: editedContents[contentId],
        });
        if (result.success) {
          setEditingCardId(null);
          queryClient.invalidateQueries({ queryKey: ['content'] });
          toast.success('Successfully updated content');
        } else {
          toast.error('Error during attempt to update content');
        }
      } catch (error) {
        toast.error('Error during attempt to update content');
      }
    }
  };

  return (
    <>
      <div className="flex w-full max-w-sm items-center gap-2 my-5">
        <Input
          type="search"
          placeholder="Search content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {(filteredContent || []).map((content) => {
          const updateText = (newText: string) => {
            setEditedContents((prev) => ({
              ...prev,
              [content.id]: newText,
            }));
          };
          return (
            <CardComponent
              key={content.id}
              id={editingCardId ?? ''}
              data={{
                id: content.id,
                title: content.title,
                description: '',
                content: content.editedText ?? content.generatedText,
                footer: `CONTENT - created at ${content.createdAt.toLocaleDateString()}`,
                action: (
                  <ContentActions
                    handleDelete={() => {
                      setDeleteContentId(content.id);
                      setShowDeleteDialog(true);
                    }}
                    handleEdit={() =>
                      handleEdit(
                        content.id,
                        content.editedText || content.generatedText
                      )
                    }
                    handleSave={() => handleSave(content.id)}
                    generatedContent={
                      content.editedText ?? content.generatedText
                    }
                    editedContent={
                      editedContents[content.id] ??
                      content.editedText ??
                      content.generatedText
                    }
                    isEditing={editingCardId === content.id}
                  />
                ),
                icon: undefined,
              }}
              edit={editingCardId === content.id}
              editedContent={
                editedContents[content.id] ??
                content.editedText ??
                content.generatedText
              }
              setEditedContent={
                updateText as React.Dispatch<SetStateAction<string>>
              }
            />
          );
        })}
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
    </>
  );
}
