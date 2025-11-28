'use client';

import { getUserImages } from '@/lib/actions';
import { ImageContentData } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Toaster } from 'sonner';
import { CardImage } from '@/components/card-image';
import { ImagesSkeleton } from '@/components/loaders/images-skeleton';

export default function Images() {
  const { data: session } = useSession();
  const { data, isLoading } = useQuery<ImageContentData>({
    queryKey: ['user-images', session?.user.id],
    queryFn: () => getUserImages(session?.user.id as string),
  });

  if (isLoading) {
    return <ImagesSkeleton />;
  }

  if (!data) {
    return <div>No images? Just go to Generate Images and create some :)</div>;
  }

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
        {data?.images?.map((image) => (
          <CardImage key={image.id} image={image} />
        ))}
        <Toaster position="top-center" />
      </section>
    </>
  );
}
