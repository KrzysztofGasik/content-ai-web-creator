'use client';

import { WrapperCenter } from '@/components/wrapper-center';
import { deleteContent, getUserContent, updateContent } from '@/lib/actions';
import { ContentFullData, ContentTypeParams, SortOptions } from '@/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import CardComponent from '../../../components/card';
import { ContentActions } from '@/components/actions/content-actions';
import { SetStateAction, useMemo, useState } from 'react';
import DeleteContentDialog from '@/components/delete-content-dialog';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { ContentSkeleton } from '@/components/loaders/content-skeleton';
import useSetSearchParams from '@/hooks/useSetSearchParams';
import { SearchFilter } from './search-filter';
import useDialog from '@/hooks/useDialog';

export default function Content() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editedContents, setEditedContents] = useState<Record<string, string>>(
    {}
  );
  const { close, open, isOpen, deleteId } = useDialog();
  const { data: session } = useSession();
  const { project, type, tags, favorite, archived, sort, handleParamsChange } =
    useSetSearchParams();
  const { data, isLoading } = useQuery<ContentFullData>({
    queryKey: [
      'content',
      session?.user.id,
      project,
      type,
      tags,
      favorite,
      archived,
      sort,
    ],
    queryFn: () =>
      getUserContent({
        project,
        type: type as ContentTypeParams,
        tags: tags as string[],
        favorite,
        archived,
        sort: sort as SortOptions,
      }),
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
    return <ContentSkeleton />;
  }

  if (!data) {
    return (
      <div>No content? Just go to Generate Content and create some :)</div>
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
        close();
        toast.success('Content deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['content'] });
      } else {
        toast.error('Error during content deleting');
      }
    } catch (error) {
      console.error(error);
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
        console.error(error);
        toast.error('Error during attempt to update content');
      }
    }
  };

  return (
    <>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        params={{
          project,
          type,
          tags,
          favorite,
          archived,
          sort: sort as SortOptions,
        }}
        handleParamsChange={handleParamsChange}
      />
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
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
                    handleView={() => {
                      router.push(`/content/${content.id}`);
                    }}
                    handleDelete={() => open(content.id)}
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
        {isOpen && (
          <DeleteContentDialog
            open={isOpen}
            onClose={close}
            onConfirm={() => handleDelete(deleteId as string)}
            deleteContentTypeId={deleteId}
            contentType="content"
          />
        )}
        <Toaster position="top-center" />
      </section>
      {data?.contents?.length === 0 && (
        <WrapperCenter>
          <h3 className="text-center">No content</h3>
        </WrapperCenter>
      )}
    </>
  );
}
