'use client';

import { Button } from '@/components/ui/button';
import { Content } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Star, Archive, ArchiveX } from 'lucide-react';
import { SetStateAction } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { assignContentToProject, getUserProjects } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type DetailsLeftSectionProps = {
  content: Content | null | undefined;
  isEditing: boolean;
  editedContent: string;
  setEditedContent: React.Dispatch<SetStateAction<string>>;
  textContent: string;
};

export const DetailsLeftSection = ({
  content,
  isEditing,
  editedContent,
  setEditedContent,
  textContent,
}: DetailsLeftSectionProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: projectsData } = useQuery({
    queryKey: ['projects', session?.user.id as string],
    queryFn: () => getUserProjects(session?.user.id as string),
  });
  const queryClient = useQueryClient();

  const handleAssignProject = async (projectId: string) => {
    try {
      const projectIdToAssign = projectId === 'none' ? null : projectId;
      const result = await assignContentToProject(
        content?.id as string,
        projectIdToAssign
      );

      if (result.success) {
        toast.success('Content has been successfully attached to project');
        queryClient.invalidateQueries({
          queryKey: ['projects', session?.user.id as string],
        });
      } else {
        toast.error('Failed to attach content to project');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to attach content to project');
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <Button
        className="w-[200px]"
        onClick={() => {
          router.push('/content');
        }}
      >
        Back to content
      </Button>

      <div className="flex flex-col gap-2">
        <p>Assign content to project</p>
        <Select
          value={content?.projectId || 'none'}
          onValueChange={handleAssignProject}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Project</SelectItem>
            {projectsData?.projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        <p>Title: {content?.title}</p>
        {content?.isFavorite ? <Star fill="#000" /> : <Star />}
        {content?.isArchived ? <ArchiveX /> : <Archive />}
      </div>
      <Badge>{content?.type}</Badge>
      {isEditing ? (
        <div className="grid w-full h-[400px] gap-3">
          <textarea
            id="content-details-edit"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </div>
      ) : (
        <div>{textContent}</div>
      )}
    </div>
  );
};
