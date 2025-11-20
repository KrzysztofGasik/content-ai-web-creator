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
    <Card className="w-full max-w-sm" id={id}>
      <CardHeader>
        {icon}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>{action}</CardAction>
      </CardHeader>
      <CardContent>
        {edit ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent?.(e.target.value)}
          />
        ) : (
          <p>{content}</p>
        )}
      </CardContent>
      <CardFooter>
        <p>{footer}</p>
      </CardFooter>
    </Card>
  );
}
