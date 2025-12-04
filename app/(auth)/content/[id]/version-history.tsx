'use client';

import { EmptyState } from '@/components/empty-state';
import { VersionHistorySkeleton } from '@/components/loaders/version-history-skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getContentVersions,
  restoreContentVersion,
} from '@/lib/actions/content-actions';
import { VersionsData } from '@/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export const VersionHistory = ({
  contentId,
}: {
  contentId: string | undefined;
}) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const { data, isLoading } = useQuery<VersionsData>({
    queryKey: ['content-version', contentId],
    queryFn: () => getContentVersions(contentId || ''),
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!contentId) return;

  const handleRestore = async (versionId: string) => {
    try {
      setIsRestoring(true);
      const result = await restoreContentVersion(versionId, contentId);
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['content-version', contentId],
        });
        queryClient.invalidateQueries({
          queryKey: ['content-details', contentId],
        });
        router.refresh();
        toast.success('Version restored successfully');
        setIsRestoring(false);
      } else {
        toast.error('Version restoration failed');
        setIsRestoring(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Version restoration failed');
      setIsRestoring(false);
    }
  };

  if (isLoading) {
    return <VersionHistorySkeleton />;
  }

  if (!data?.versions || data.versions.length === 0) {
    return (
      <EmptyState
        title="Versions"
        text="No version history yet. Edit this content to create versions."
        fullHeight={false}
      />
    );
  }

  const { versions } = data;

  return (
    <Card className="w-full mt-4">
      <Accordion type="single" collapsible>
        {versions?.map((version) => (
          <AccordionItem value={version.id} key={version.id} className="p-4">
            <AccordionTrigger>
              <p>Created at: {version.createdAt.toLocaleDateString()}</p>
              <p className="truncate w-[200px]"> Preview: {version.text}</p>
            </AccordionTrigger>
            <AccordionContent>
              <pre className="whitespace-pre-wrap break-words overflow-x-auto max-w-full">
                {version.text}
              </pre>
              <Button
                className="transition-colors duration-200 mt-4"
                onClick={() => handleRestore(version.id)}
                disabled={isRestoring}
              >
                Restore
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Toaster position="top-center" />
    </Card>
  );
};
