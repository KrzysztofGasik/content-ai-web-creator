import { getUserImages } from '@/lib/actions/image-actions';
import { Toaster } from 'sonner';
import { CardImage } from '@/components/card-image';
import { ImageInput } from './image-input';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Images() {
  const session = await getServerSession(authOptions);
  const data = await getUserImages(session?.user?.id as string);

  if (!data) {
    return <div>No images? Just go to Generate Images and create some :)</div>;
  }

  return (
    <>
      <div className="my-4 mx-auto">
        <ImageInput />
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
