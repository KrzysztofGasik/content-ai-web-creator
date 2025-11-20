import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

export const ContentDetailsSkeleton = () => {
  return (
    <section className="flex flex-col lg:flex-row gap-4 w-full h-full">
      <div className="flex-1 lg:flex-[2]">
        <div className="flex flex-col gap-10">
          <Skeleton className="h-10 w-[200px]"></Skeleton>
          <Skeleton className="h-6 w-64"></Skeleton>
          <Skeleton className="h-6 w-24"></Skeleton>
          <div className="grid">
            <Skeleton className=" w-full h-[400px] gap-3"></Skeleton>
          </div>
        </div>
      </div>
      <div className="flex-1 lg:flex-[1]">
        <Card className="w-full">
          <CardContent>
            <div className="flex justify-evenly gap-2 mb-4">
              <Skeleton className="h-6 w-24"></Skeleton>
              <Skeleton className="h-6 w-24"></Skeleton>
              <Skeleton className="h-6 w-24"></Skeleton>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Skeleton className="h-10 w-full"></Skeleton>
              <Skeleton className="h-10 w-full"></Skeleton>
              <Skeleton className="h-10 w-full"></Skeleton>
              <Separator className="my-4" />
              <Skeleton className="h-10 w-full"></Skeleton>
              <Skeleton className="h-10 w-full"></Skeleton>
              <Skeleton className="h-10 w-full"></Skeleton>
              <Separator className="my-4" />
              <Skeleton className="h-10 w-full"></Skeleton>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
