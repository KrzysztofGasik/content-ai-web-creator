'use client';

import { ProjectDetailsActions } from '@/components/actions/project-details-actions';
import CardComponent from '@/components/card';
import DeleteContentDialog from '@/components/delete-content-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useDeleteProject from '@/hooks/useDeleteProject';
import useDialog from '@/hooks/useDialog';
import { assignContentToProject } from '@/lib/actions/project-actions';
import { ProjectWithCount } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';

export const ProjectWrapper = ({
  project,
}: {
  project: ProjectWithCount | undefined;
}) => {
  const { close, open, isOpen, deleteId } = useDialog();
  const { data: session } = useSession();
  const userId = session?.user.id || '';
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleRemoveContent = async (contentId: string) => {
    try {
      const result = await assignContentToProject(contentId, null);

      if (result.success) {
        toast.success('Content has been successfully removed from project');
        queryClient.invalidateQueries({
          queryKey: ['project', project?.id],
        });
      } else {
        toast.error('Failed to remove content from project');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove content from project');
    }
  };

  const { handleDelete } = useDeleteProject(userId, close);

  return (
    <section className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="flex flex-col flex-1 lg:flex-[2] gap-5">
        <div
          className="h-2 w-full"
          style={{ backgroundColor: project?.color || '' }}
        />
        <h2>Name: {project?.name}</h2>
        <h3>Description: {project?.description}</h3>
        <Badge>
          {project?._count.contents && project._count.contents > 0
            ? `Content no. ${project?._count.contents}`
            : 'No content yet'}
        </Badge>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project?.contents?.map((content) => (
            <CardComponent
              key={content.id}
              data={{
                id: content.id,
                title: content.title,
                description: '',
                content: content.prompt,
                footer: '',
                action: (
                  <div className="flex flex-col gap-2">
                    <Button
                      className="transition-colors duration-200"
                      onClick={() => router.push(`/content/${content.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      className="transition-colors duration-200"
                      variant="destructive"
                      onClick={() => {
                        handleRemoveContent(content.id);
                      }}
                    >
                      Remove from project
                    </Button>
                  </div>
                ),
                icon: undefined,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 lg:flex-[1]">
        <Card className="w-full">
          <CardContent>
            <ProjectDetailsActions
              handleDelete={() => {
                open(project?.id as string);
              }}
              handleEdit={() => router.push(`/projects/edit/${project?.id}`)}
              isEditing={false}
            />
          </CardContent>
        </Card>
      </div>
      {isOpen && (
        <DeleteContentDialog
          open={isOpen}
          onClose={close}
          onConfirm={() => handleDelete(deleteId as string)}
          deleteContentTypeId={deleteId}
          contentType="project"
        />
      )}
      <Toaster position="top-center" />
    </section>
  );
};
