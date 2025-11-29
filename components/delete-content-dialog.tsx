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

type DeleteContentDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (contentId: string) => Promise<void>;
  deleteContentTypeId: string | null;
  contentType: string;
};

export default function DeleteContentDialog({
  open,
  onClose,
  onConfirm,
  deleteContentTypeId,
  contentType,
}: DeleteContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              if (deleteContentTypeId) {
                onConfirm(deleteContentTypeId);
              }
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
