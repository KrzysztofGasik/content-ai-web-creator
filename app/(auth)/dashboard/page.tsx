'use client';

import { Button } from '@/components/ui/button';
import CardComponent from './card';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getUserContent } from '@/lib/actions';
import { ContentFullData } from '@/types/types';
import { QuickActions } from '@/components/quick-actions';

export default function Dashboard() {
  const { data: session } = useSession();
  const { data } = useQuery<ContentFullData>({
    queryKey: ['content', session?.user.id],
    queryFn: () => getUserContent(),
  });
  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-start w-full gap-5 p-10">
      <div className="flex-1 flex-shrink-0 min-w-[300px]">
        <CardComponent
          data={{
            id: 7,
            title: 'Quick actions',
            description: '',
            content: `This quick actions will help you.`,
            footer: '',
            action: <QuickActions />,
          }}
          key={7}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {data?.contents?.map((card) => (
          <CardComponent
            data={{
              id: card.id,
              title: card.title,
              description: '',
              content: card.editedText ?? card.generatedText,
              footer: `CONTENT - created at ${card.createdAt.toLocaleDateString()}`,
              action: undefined,
              icon: undefined,
            }}
            key={card.id}
          />
        ))}
      </div>
    </section>
  );
}
