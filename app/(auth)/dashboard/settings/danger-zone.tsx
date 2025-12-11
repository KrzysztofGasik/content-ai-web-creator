'use client';

import DeleteAccountDialog from '@/components/dialogs/delete-account-dialog';
import { Button } from '@/components/ui/button';
import { deleteAccountTab } from '@/lib/actions/settings-actions';
import { useState } from 'react';

export default function DangerZonePage() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);

  const onClose = () => {
    setOpen(false);
    setValue('');
    setChecked(false);
  };

  return (
    <div className="grid content-center text-2xl gap-4 h-full">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <DeleteAccountDialog
        open={open}
        onClose={onClose}
        onConfirm={async () => await deleteAccountTab()}
        value={value}
        setValue={setValue}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
}
