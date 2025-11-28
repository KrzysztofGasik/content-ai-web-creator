import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const ImagesSkeleton = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[20px] w-[200px]" />
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <div className="flex gap-1">
              <Skeleton className="h-[22px] w-[118px]" />
              <Skeleton className="h-[22px] w-[82px]" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-[200px]" />
        </CardContent>
        <CardFooter className="flex justify-start gap-2">
          <CardAction>
            <Skeleton className="h-[36px] w-[64px]" />
          </CardAction>
          <CardAction>
            <Skeleton className="h-[36px] w-[100px]" />
          </CardAction>
          <CardAction>
            <Skeleton className="h-[36px] w-[74px]" />
          </CardAction>
        </CardFooter>
      </Card>
      <Card className="h-[520px] w-[400px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[20px] w-[200px]" />
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <div className="flex gap-1">
              <Skeleton className="h-[22px] w-[118px]" />
              <Skeleton className="h-[22px] w-[82px]" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-[200px]" />
        </CardContent>
        <CardFooter className="flex justify-start gap-2">
          <CardAction>
            <Skeleton className="h-[36px] w-[64px]" />
          </CardAction>
          <CardAction>
            <Skeleton className="h-[36px] w-[100px]" />
          </CardAction>
          <CardAction>
            <Skeleton className="h-[36px] w-[74px]" />
          </CardAction>
        </CardFooter>
      </Card>
      <Card className="h-[520px] w-[400px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-[20px] w-[200px]" />
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <Skeleton className="h-[20px] w-[340px]" />
            <div className="flex gap-1">
              <Skeleton className="h-[22px] w-[118px]" />
              <Skeleton className="h-[22px] w-[82px]" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-[200px]" />
        </CardContent>
        <CardFooter className="flex justify-start gap-2">
          <CardAction>
            <Skeleton className="h-[36px] w-[64px]" />
          </CardAction>
          <CardAction>
            <Skeleton className="h-[36px] w-[100px]" />
          </CardAction>
          <CardAction>
            <Skeleton className="h-[36px] w-[74px]" />
          </CardAction>
        </CardFooter>
      </Card>
    </section>
  );
};
