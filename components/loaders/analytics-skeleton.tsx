import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const AnalyticsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 w-full">
      <Skeleton className="w-[150px] h-[36px] my-5" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        <Skeleton className="w-[460px] h-[150px]" />
        <Skeleton className="w-[460px] h-[150px]" />
        <Skeleton className="w-[460px] h-[150px]" />
      </div>
      <div className="grid grid-cols-1 gap-4 w-full my-4">
        <Skeleton className="w-[150px] h-[36px] my-5" />
        <Skeleton className="w-[1414px] h-[300px]" />
        <Skeleton className="w-[1414px] h-[300px]" />
        <Skeleton className="w-[1414px] h-[300px]" />
      </div>
      <Skeleton className="w-[150px] h-[36px] my-5" />
      <Card className="w-[1414px] h-[300px] border-none">
        <Skeleton className="w-[230px] h-[34px] rounded-sm" />
        <Skeleton className="w-[260px] h-[34px] rounded-sm" />
        <Skeleton className="w-[200px] h-[34px] rounded-sm" />
        <Skeleton className="w-[215px] h-[34px] rounded-sm" />
      </Card>
    </div>
  );
};
