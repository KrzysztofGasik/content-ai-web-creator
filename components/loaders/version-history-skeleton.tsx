import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';

export const VersionHistorySkeleton = () => {
  return (
    <Card className="w-full mt-4 p-4">
      <Accordion type="single">
        <AccordionItem value={'skeleton'}>
          <AccordionTrigger>
            <Skeleton className="h-[40px] w-[140px]" />
            <Skeleton className="h-[20px] w-[200px]" />
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
