'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../ui/item';
import { ChartPie, Sparkle, Table } from 'lucide-react';
import { updateLastLogin } from '@/lib/actions/actions';
import { toast } from 'sonner';

type WelcomeDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function WelcomeDialog({ open, onClose }: WelcomeDialogProps) {
  const router = useRouter();

  const handleUpdateLastLogin = async () => {
    try {
      const result = await updateLastLogin();
      if (result.success) {
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during attempt to update last login');
    }
  };

  return (
    <Dialog open={open} onOpenChange={async () => handleUpdateLastLogin()}>
      <DialogContent className="animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="my-4">
            Welcome to Content AI Web Creator
          </DialogTitle>
          <div className="grid gap-3">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle className="font-bold text-lg">Generate</ItemTitle>
                <ItemDescription>
                  Generate AI content (text + images)
                </ItemDescription>
                <ItemMedia>
                  <Sparkle />
                </ItemMedia>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle className="font-bold text-lg">Organize</ItemTitle>
                <ItemDescription>Organize with projects & tags</ItemDescription>
                <ItemMedia>
                  <Table />
                </ItemMedia>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle className="font-bold text-lg">Track</ItemTitle>
                <ItemDescription>Track usage in analytics</ItemDescription>
                <ItemMedia>
                  <ChartPie />
                </ItemMedia>
              </ItemContent>
            </Item>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={async () => {
              await handleUpdateLastLogin();
            }}
            className="transition-colors duration-200"
          >
            Explore dashboard
          </Button>
          <Button
            onClick={async () => {
              await handleUpdateLastLogin();
              router.push('/generate');
            }}
          >
            Generate content
          </Button>
          <Button
            onClick={async () => {
              await handleUpdateLastLogin();
              router.push('/generate/image');
            }}
          >
            Generate image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
