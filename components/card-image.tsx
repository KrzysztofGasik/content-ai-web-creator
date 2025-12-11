'use client';

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
import DeleteContentDialog from './dialogs/delete-content-dialog';
import useImageDelete from '@/hooks/useImageDelete';
import { GenericButton } from './generic-button';

const empty = '-';

export const CardImage = ({
  image,
  defaultWidth,
  defaultHeight,
}: {
  image: ImageType;
  defaultWidth: number;
  defaultHeight: number;
}) => {
  const { handleDelete, isDeleting, open, close, isOpen, deleteId, router } =
    useImageDelete();

  return (
    <Card
      className="w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      id={image.id}
    >
      <CardHeader>
        <CardTitle className="truncate w-[200px]">{image.prompt}</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <p className="truncate w-[350px] lg:w-[250px]">
            Prompt: {image.prompt || empty}
          </p>
          <p>Created: {image.createdAt.toLocaleDateString() || empty}</p>
          <p>File name: {image.filename || empty}</p>
          <p>File size: {filesize(image.size || empty)}</p>
          <p>Dimensions: {`${image.width}x${image.height}` || empty}</p>
          <div className="flex gap-1">
            <Badge>Quality: {image.quality || empty}</Badge>
            <Badge variant="outline">Style: {image.style || empty}</Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={image.url}
          alt={image.filename}
          height={defaultHeight}
          width={defaultWidth}
          className="mx-auto"
        />
      </CardContent>
      <CardFooter className="flex justify-start gap-2">
        <CardAction>
          <Button
            onClick={() => router.push(`images/${image.id}`)}
            className="transition-colors duration-200"
          >
            View
          </Button>
        </CardAction>
        <CardAction>
          <Button
            variant="outline"
            onClick={() => exportAsImage(image)}
            className="transition-colors duration-200"
          >
            Download
          </Button>
        </CardAction>
        <CardAction>
          <GenericButton
            label="Delete"
            loadingLabel="Deleting..."
            variant="destructive"
            onClick={() => open(image.id)}
            disabled={isDeleting}
          />
        </CardAction>
      </CardFooter>
      {isOpen && (
        <DeleteContentDialog
          open={isOpen}
          onClose={close}
          onConfirm={() => handleDelete(deleteId as string)}
          deleteContentTypeId={deleteId}
          contentType="image"
        />
      )}
    </Card>
  );
};
