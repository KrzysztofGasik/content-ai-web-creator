import { getUserImages } from '@/lib/actions/image-actions';
import { Toaster } from 'sonner';
import { CardImage } from '@/components/card-image';
import { ImageInput } from './image-input';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Images | Content AI Web Creator app',
  description: 'Created by Krzysztof &copy; 2025',
};

export default async function Images() {
  const session = await getServerSession(authOptions);
  const data = await getUserImages(session?.user?.id as string);

  if (!data) {
    return (
      <span>No images? Just go to Generate Images and create some :)</span>
    );
  }

  return (
    <>
      <div className="my-4 mx-auto">
        <ImageInput />
        {data.images?.length === 0 && (
          <h6 className="my-4">
            No images - either upload or go to Generate Images to create
          </h6>
        )}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full animate-in fade-in duration-500">
        {data?.images?.map((image) => (
          <CardImage
            key={image.id}
            image={image}
            defaultHeight={200}
            defaultWidth={200}
          />
        ))}
      </section>

      <Toaster position="top-center" />
    </>
  );
}
