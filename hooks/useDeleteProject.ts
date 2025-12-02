import { deleteProject } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useDeleteProject(userId: string, close: () => void) {
  const router = useRouter();
  const handleDelete = async (projectId: string) => {
    try {
      const result = await deleteProject(userId, projectId);
      if (result.success) {
        close();
        toast.success('Project deleted successfully');
        router.push('/projects');
      } else {
        toast.error('Error during project deleting');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during project deleting');
    }
  };

  return { handleDelete };
}
