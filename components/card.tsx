'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CardDataProps } from '@/types/types';
import { SetStateAction } from 'react';
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from './ui/accordion';

type CardProps = {
  data: CardDataProps;
  edit?: boolean;
  editedContent?: string;
  setEditedContent?: React.Dispatch<SetStateAction<string>>;
  id?: string;
};

export default function CardComponent({
  data,
  edit = false,
  editedContent,
  setEditedContent,
  id,
}: CardProps) {
  const { title, icon, description, action, content, footer } = data;
  return (
    <Card className="w-full" id={id}>
      <CardHeader>
        {icon}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>{action}</CardAction>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value={`card-${id}`}>
            <AccordionTrigger>Expand content</AccordionTrigger>
            <AccordionContent>
              {edit ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent?.(e.target.value)}
                />
              ) : (
                <pre className="whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                  {content}
                </pre>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <p>{footer}</p>
      </CardFooter>
    </Card>
  );
}
