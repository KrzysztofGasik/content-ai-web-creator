'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export function QuickActions() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={() => router.push('/generate')}>
        Generate Content
      </Button>
      <Button variant="outline" onClick={() => router.push('/generate/image')}>
        Generate Image
      </Button>
      <Button variant="outline" onClick={() => router.push('/projects/new')}>
        Create Project
      </Button>
      <Button variant="outline" onClick={() => router.push('/content')}>
        View All Content
      </Button>
      <Button variant="outline" onClick={() => router.push('/images')}>
        View All Images
      </Button>
    </div>
  );
}
