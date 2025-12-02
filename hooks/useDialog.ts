import { useState } from 'react';

export default function useDialog() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const open = (id: string) => {
    setShowDeleteDialog(true);
    setDeleteId(id);
  };
  const close = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  return { open, close, isOpen: showDeleteDialog, deleteId };
}
