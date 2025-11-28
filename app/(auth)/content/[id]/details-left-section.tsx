'use client';

import { Button } from '@/components/ui/button';
import { Content } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Star, Archive, ArchiveX } from 'lucide-react';
import { SetStateAction } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

type DetailsLeftSectionProps = {
  content: Content | null | undefined;
  isEditing: boolean;
  editedContent: string;
  setEditedContent: React.Dispatch<SetStateAction<string>>;
  textContent: string;
};

export const DetailsLeftSection = ({
  content,
  isEditing,
  editedContent,
  setEditedContent,
  textContent,
}: DetailsLeftSectionProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-10">
      <Button
        className="w-[200px]"
        onClick={() => {
          router.push('/content');
        }}
      >
        Back to content
      </Button>
      <Label>
        Title: {content?.title}
        {content?.isFavorite ? <Star fill="#000" /> : <Star />}
        {content?.isArchived ? <ArchiveX /> : <Archive />}
      </Label>
      <Badge>{content?.type}</Badge>
      {isEditing ? (
        <div className="grid w-full h-[400px] gap-3">
          <textarea
            id="content-details-edit"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </div>
      ) : (
        <div>{textContent}</div>
      )}
    </div>
  );
};
