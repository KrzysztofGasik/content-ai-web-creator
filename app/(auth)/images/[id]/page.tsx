import { EmptyState } from '@/components/empty-state';
import { getUserImageById } from '@/lib/actions/image-actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ImageDetails } from './image-details';
import { Toaster } from 'sonner';

export default async function ImagesDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const data = await getUserImageById(session?.user.id as string, id);

  if (!data || !data.image) {
    return (
      <EmptyState title="Image details" text="No details for given image" />
    );
  }

  const { image } = data;

  return (
    <>
      <ImageDetails image={image} />
      <Toaster position="top-center" />
    </>
  );
}
