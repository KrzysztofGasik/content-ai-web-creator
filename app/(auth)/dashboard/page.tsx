import CardComponent from '../../../components/card';
import { getUserContent } from '@/lib/actions';
import { ContentTypeParams } from '@/types/types';
import { QuickActions } from '@/components/actions/quick-actions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    favorite?: string;
    archived?: string;
  }>;
}) {
  await getServerSession(authOptions);
  const params = await searchParams;
  const type = params.type;
  const favorite = params.favorite;
  const archived = params.archived;

  const data = await getUserContent({
    type: type as ContentTypeParams,
    favorite: Boolean(favorite),
    archived: Boolean(archived),
  });

  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-start w-full gap-5 p-10">
      <div className="flex-shrink-0 min-w-[300px]">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
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
