import { deleteImage } from '@/lib/actions';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import useDialog from './useDialog';

export default function useImageDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { open, close, isOpen, deleteId } = useDialog();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const handleDelete = async (imageId: string) => {
    try {
      setIsDeleting(true);

      const result = await deleteImage(imageId);
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['user-images', session?.user?.id],
        });
        toast.success('Image deleted successfully');
        router.push('/images');
      } else {
        toast.error('Error during attempt to delete image');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during attempt to delete image');
    } finally {
      close();
      setIsDeleting(false);
    }
  };

  return {
    handleDelete,
    isDeleting,
    open,
    close,
    isOpen,
    deleteId,
    router,
  };
}
