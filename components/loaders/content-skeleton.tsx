import { Skeleton } from '../ui/skeleton';

export const ContentSkeleton = () => {
  return (
    <>
      <div className="flex w-full max-w-sm items-center gap-2 my-5">
        <Skeleton className="h-[36px] w-[386px]" />
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Skeleton className="h-[386px] w-[300px]" />
        <Skeleton className="h-[386px] w-[300px]" />
        <Skeleton className="h-[386px] w-[300px]" />
      </section>
    </>
  );
};
