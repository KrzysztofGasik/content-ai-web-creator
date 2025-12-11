'use client';

import { ContentSkeleton } from '@/components/loaders/content-skeleton';
import { getUserProjects } from '@/lib/actions/project-actions';
import type { UserProjectType } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { SearchFilter } from './search-filter';
import CardComponent from '@/components/card';
import { Toaster } from 'sonner';
import { WrapperCenter } from '@/components/wrapper-center';
import { Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProjectActions } from '@/components/actions/project-actions';
import DeleteContentDialog from '@/components/dialogs/delete-content-dialog';
import { Badge } from '@/components/ui/badge';
import useDialog from '@/hooks/useDialog';
import useDeleteProject from '@/hooks/useDeleteProject';

export default function ProjectsClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const { close, open, isOpen, deleteId } = useDialog();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id || '';
  const { data, isLoading } = useQuery<UserProjectType>({
    queryKey: ['projects', userId],
    queryFn: () => getUserProjects(userId),
  });

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return data?.projects || [];
    return (
      data?.projects?.filter((element) =>
        element.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    );
  }, [data?.projects, searchQuery]);

  const { handleDelete } = useDeleteProject(userId, close);

  if (isLoading) {
    return <ContentSkeleton />;
  }

  if (!data) {
    return <div>No projects? Just go to Create project and create one :)</div>;
  }

  return (
    <>
      <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full animate-in fade-in duration-500">
        {filteredProjects.map((project) => {
          return (
            <CardComponent
              style={{
                borderTopColor: project.color || '#ccc',
                borderLeftColor: project.color || '#ccc',
                borderTopWidth: '5px',
                borderLeftWidth: '5px',
              }}
              id={project.id}
              key={project.id}
              data={{
                id: project.id,
                title: project.name,
                description: project.description || '',
                content: `${(<Badge>{project._count?.contents || 0} contents</Badge>)}}`,
                footer: `PROJECT - created at ${project.createdAt.toLocaleDateString()}`,
                action: (
                  <ProjectActions
                    handleView={() => router.push(`/projects/${project.id}`)}
                    handleDelete={() => open(project.id)}
                    handleEdit={() =>
                      router.push(`/projects/edit/${project.id}`)
                    }
                  />
                ),
                icon: <Folder />,
              }}
            />
          );
        })}
        <Toaster position="top-center" />
      </section>
      {isOpen && (
        <DeleteContentDialog
          open={isOpen}
          onClose={close}
          onConfirm={() => handleDelete(deleteId as string)}
          deleteContentTypeId={deleteId}
          contentType="project"
        />
      )}
      {data?.projects?.length === 0 && (
        <WrapperCenter>
          <h3 className="text-center">No projects</h3>
        </WrapperCenter>
      )}
    </>
  );
}
