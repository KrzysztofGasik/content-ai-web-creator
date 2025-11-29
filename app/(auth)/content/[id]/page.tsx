import { getContentDetails } from '@/lib/actions';
import { EmptyState } from '@/components/empty-state';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DetailsWrapper from './details-wrapper';

export default async function ContentDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getServerSession(authOptions);
  const data = await getContentDetails(id);
  const textContent = (data?.content?.editedText ??
    data?.content?.generatedText) as string;

  if (!data) {
    return <EmptyState title="Details" text="No details for given item" />;
  }

  const { content } = data;

  return <DetailsWrapper initialData={{ content, textContent, id }} />;
}
