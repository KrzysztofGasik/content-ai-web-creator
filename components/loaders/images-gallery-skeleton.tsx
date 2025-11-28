import { Skeleton } from '../ui/skeleton';

export const ImagesGallerySkeleton = () => {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Skeleton className="h-[100px] w-[100px] rounded-sm" />
      <Skeleton className="h-[100px] w-[100px] rounded-sm" />
      <Skeleton className="h-[100px] w-[100px] rounded-sm" />
      <Skeleton className="h-[100px] w-[100px] rounded-sm" />
    </div>
  );
};
