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
import { CSSProperties, SetStateAction } from 'react';
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from './ui/accordion';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { filesize } from 'filesize';

type CardProps = {
  data: CardDataProps;
  edit?: boolean;
  editedContent?: string;
  setEditedContent?: React.Dispatch<SetStateAction<string>>;
  id?: string;
  style?: CSSProperties;
};

const empty = '---';

export default function CardComponent({
  data,
  edit = false,
  editedContent,
  setEditedContent,
  id,
  style,
}: CardProps) {
  const { title, icon, description, action, content, footer } = data;
  return (
    <Card
      className="w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      id={id}
      style={style}
    >
      <CardHeader>
        {icon}
        <CardTitle>{title || empty}</CardTitle>
        <CardDescription>{description || empty}</CardDescription>
        <CardAction>{action}</CardAction>
      </CardHeader>
      <CardContent>
        {content ? (
          <Accordion type="single" collapsible>
            <AccordionItem value={`card-${id}`}>
              <AccordionTrigger>Expand content</AccordionTrigger>
              <AccordionContent>
                {edit && typeof content === 'string' ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent?.(e.target.value)}
                  />
                ) : typeof content === 'string' ? (
                  <pre className="whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                    {content as string}
                  </pre>
                ) : null}
                {typeof content === 'object' && (
                  <>
                    <Image
                      src={content.url}
                      alt={content.filename}
                      height={300}
                      width={300}
                      className="mx-auto"
                    />
                    <p className="p-3">Prompt: {content?.prompt}</p>
                    <Badge className="p-3 mx-1" variant="outline">
                      Size: {filesize(content?.size)}
                    </Badge>
                    <Badge className="p-3" variant="outline">
                      Quality: {content?.quality}
                    </Badge>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : null}
      </CardContent>
      <CardFooter>
        <p>{footer}</p>
      </CardFooter>
    </Card>
  );
}
