import { Skeleton } from '../ui/skeleton';

export const DashboardSkeleton = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-start w-full gap-5 p-10">
      <div className="flex-shrink-0 min-w-[300px]">
        <Skeleton className="w-[300px] h-[274px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Skeleton className="w-[300px] h-[200px]" />
        <Skeleton className="w-[300px] h-[200px]" />
        <Skeleton className="w-[300px] h-[200px]" />
      </div>
    </section>
  );
};
