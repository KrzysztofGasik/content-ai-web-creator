import Image from 'next/image';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import type { Image as ImageType } from '@prisma/client';
import { Button } from './ui/button';
import { filesize } from 'filesize';
import { Badge } from './ui/badge';
import { exportAsImage } from '@/lib/utils';

export const CardImage = ({ image }: { image: ImageType }) => {
  return (
    <Card className="w-full" id={image.id}>
      <CardHeader>
        <CardTitle className="truncate w-[200px]">{image.prompt}</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <p className="truncate w-[340px]">Prompt: {image.prompt}</p>
          <p>Created: {image.createdAt.toLocaleDateString()}</p>
          <p>File name: {image.filename}</p>
          <p>File size: {filesize(image.size)}</p>
          <p>Dimensions: {`${image.width}x${image.height}`}</p>
          <div className="flex gap-1">
            <Badge>Quality: {image.quality}</Badge>
            <Badge variant="outline">Style: {image.style}</Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={image.url}
          alt={image.filename}
          height={200}
          width={200}
          className="mx-auto"
        />
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        <CardAction>
          <Button>View</Button>
        </CardAction>
        <CardAction>
          <Button variant="outline" onClick={() => exportAsImage(image)}>
            Download
          </Button>
        </CardAction>
        <CardAction>
          <Button variant="destructive">Delete</Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
};
