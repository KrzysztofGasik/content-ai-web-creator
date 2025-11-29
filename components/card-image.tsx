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
import { deleteImage } from '@/lib/actions';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import DeleteContentDialog from './delete-content-dialog';

const empty = '-';

export const CardImage = ({ image }: { image: ImageType }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteContentId, setDeleteContentId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const handleDelete = async (imageId: string) => {
    try {
      setIsDeleting(true);

      const result = await deleteImage(imageId);
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['user-images', session?.user?.id],
        });
        toast.success('Image deleted successfully');
      } else {
        toast.error('Error during attempt to delete image');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during attempt to delete image');
    } finally {
      setShowDeleteDialog(false);
      setIsDeleting(false);
    }
  };
  return (
    <Card className="w-full" id={image.id}>
      <CardHeader>
        <CardTitle className="truncate w-[200px]">{image.prompt}</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <p className="truncate w-[340px]">Prompt: {image.prompt}</p>
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
          <Button
            variant="destructive"
            onClick={() => {
              setDeleteContentId(image.id);
              setShowDeleteDialog(true);
            }}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </CardAction>
      </CardFooter>
      {showDeleteDialog && (
        <DeleteContentDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => handleDelete(image.id)}
          deleteContentTypeId={deleteContentId}
          contentType="image"
        />
      )}
    </Card>
  );
};
