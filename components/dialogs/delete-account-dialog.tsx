'use client';

import { SetStateAction } from 'react';
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
import { Input } from '../ui/input';
import { LabelInputWrapper } from '../label-input-wrapper';
import { Checkbox } from '../ui/checkbox';
import { signOut, useSession } from 'next-auth/react';
import { Label } from '../ui/label';
import { toast } from 'sonner';

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; message: string }>;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  checked: boolean;
  setChecked: React.Dispatch<SetStateAction<boolean>>;
};

export default function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  value,
  setValue,
  checked,
  setChecked,
}: DeleteAccountDialogProps) {
  const { data: session } = useSession();

  const enableButton = session?.user?.email === value && checked;

  const handleDelete = async () => {
    try {
      const result = await onConfirm();
      if (result.success) {
        onClose();
        toast.success('Account deleted successfully');
        signOut({ callbackUrl: '/' });
      } else {
        toast.error('Error during account deletion');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during account deletion');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete account?</DialogTitle>
          <DialogDescription asChild>
            This action cannot be undone. This will permanently delete your
            account and remove all related content to this account from
            database.
          </DialogDescription>
          <div className="mt-4">
            <span className="mt-4">
              To confirm please type your email and tick the checkbox
            </span>
            <LabelInputWrapper label="Your email address">
              <Input value={value} onChange={(e) => setValue(e.target.value)} />
            </LabelInputWrapper>
            <Label
              className="px-1 py-1 text-sm font-bold my-3"
              htmlFor="confirm-delete"
            >
              <Checkbox
                id="confirm-delete"
                checked={checked}
                onCheckedChange={() => setChecked((prev) => !prev)}
              />
              I understand this is permanent
            </Label>
          </div>
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
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!enableButton}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
