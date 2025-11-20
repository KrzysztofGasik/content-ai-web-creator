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
  deleteContentId: string | null;
};

export default function DeleteContentDialog({
  open,
  onClose,
  onConfirm,
  deleteContentId,
}: DeleteContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this content?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            content and remove your data from database.
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
              if (deleteContentId) {
                onConfirm(deleteContentId);
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
