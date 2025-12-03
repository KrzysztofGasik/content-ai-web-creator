import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { StatCardDataProps } from '@/types/types';

export const CardStats = ({ data }: { data: StatCardDataProps }) => {
  return (
    <Card className="w-full" id={`${data.id}`}>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          <p>{data.title}</p>
          <p>{data.icon}</p>
        </CardTitle>
        <CardDescription className="flex flex-col gap-2"></CardDescription>
      </CardHeader>
      <CardContent>{data?.content}</CardContent>
    </Card>
  );
};
