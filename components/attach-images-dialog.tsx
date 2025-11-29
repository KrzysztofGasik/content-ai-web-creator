import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { SetStateAction, useState } from 'react';
import { Image as ImageType } from '@prisma/client';
import Image from 'next/image';
import { Checkbox } from './ui/checkbox';
import { ImageContentData } from '@/types/types';
import { attachImageToContent, getUnattachedImages } from '@/lib/actions';
import { toast, Toaster } from 'sonner';
import { Spinner } from './ui/spinner';
import { WrapperCenter } from './wrapper-center';

type AttachImagesDialogProps = {
  open: boolean;
  onClose: () => void;
  contentId: string;
  userId: string;
};

export default function AttachImagesDialog({
  open,
  onClose,
  contentId,
  userId,
}: AttachImagesDialogProps) {
  const [selectedImagesId, setSelectedImagesId] = useState<string[]>([]);
  const [attachingImages, setAttachingImages] = useState(false);
  const { data, isLoading } = useQuery<ImageContentData>({
    queryKey: ['attach-images', userId],
    queryFn: () => getUnattachedImages(userId),
  });
  const queryClient = useQueryClient();

  if (isLoading) {
    return <p>Create skeleton for that :)</p>;
  }

  const handleAttach = async () => {
    try {
      setAttachingImages(true);
      let allResolved = true;
      for (const image of selectedImagesId) {
        const result = await attachImageToContent(contentId, image);
        if (!result.success) {
          allResolved = false;
          toast.error('Attaching image(s) to content failed');
          break;
        }
      }
      if (allResolved) {
        toast.success('Image(s) attached successfully');
        queryClient.invalidateQueries({
          queryKey: ['details-image', contentId],
        });
        queryClient.invalidateQueries({
          queryKey: ['attach-images', userId],
        });
        setSelectedImagesId([]);
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error('Attaching image(s) to content failed');
    } finally {
      setAttachingImages(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select images</DialogTitle>
          <DialogDescription>
            Select images you want to attach to your content
          </DialogDescription>
        </DialogHeader>
        {attachingImages && (
          <WrapperCenter>
            <Spinner className="size-10" />
          </WrapperCenter>
        )}
        <ImageGrid
          images={data?.images || []}
          select={selectedImagesId}
          setSelected={setSelectedImagesId}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleAttach}
            disabled={selectedImagesId.length === 0}
          >
            Attach selected
          </Button>
        </DialogFooter>
      </DialogContent>
      <Toaster position="top-center" />
    </Dialog>
  );
}

const ImageGrid = ({
  images,
  select,
  setSelected,
}: {
  images: ImageType[];
  select: string[];
  setSelected: React.Dispatch<SetStateAction<string[]>>;
}) => {
  const handleChange = (imageId: string) => {
    setSelected((prev) => {
      if (select.includes(imageId)) {
        const filterOut = prev.filter((img) => img !== imageId);
        return filterOut;
      } else {
        return [...prev, imageId];
      }
    });
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((image) => (
        <div key={image.id} className="flex items-center justify-around">
          <Checkbox
            id={image.filename}
            checked={select.includes(image.id)}
            onCheckedChange={() => handleChange(image.id)}
          />
          <Image
            src={image.url}
            alt={image.filename}
            width={100}
            height={100}
            className={`${select.includes(image.id) ? 'border-black' : 'border-transparent'} border-2`}
          />
        </div>
      ))}
    </div>
  );
};
