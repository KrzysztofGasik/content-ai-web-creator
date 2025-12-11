import { useState } from 'react';
import { GenericButton } from '../generic-button';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

type DeleteContentDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (contentId: string) => Promise<void>;
  deleteContentTypeId: string | null;
  contentType: string;
  isDeletingProp?: boolean;
};

export default function DeleteContentDialog({
  open,
  onClose,
  onConfirm,
  deleteContentTypeId,
  contentType,
  isDeletingProp,
}: DeleteContentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (contentId: string) => {
    setIsDeleting(true);
    await onConfirm(contentId);
    setIsDeleting(false);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this {contentType}?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            {contentType} and remove your data from database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={onClose}
              className="transition-colors duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <GenericButton
            label="Delete"
            loadingLabel="Deleting..."
            isLoading={isDeletingProp || isDeleting}
            type="button"
            variant="destructive"
            onClick={async () => handleDelete(deleteContentTypeId as string)}
            disabled={isDeletingProp || isDeleting}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
