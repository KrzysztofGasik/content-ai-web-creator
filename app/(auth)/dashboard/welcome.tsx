'use client';

import WelcomeDialog from '@/components/dialogs/welcome-dialog';
import { useState } from 'react';

export default function WelcomePage({ lastLogin }: { lastLogin: boolean }) {
  const [open, setOpen] = useState(lastLogin);

  return <WelcomeDialog onClose={() => setOpen(false)} open={open} />;
}
