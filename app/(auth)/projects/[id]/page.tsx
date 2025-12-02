import { EmptyState } from '@/components/empty-state';
import { getUserProjectById } from '@/lib/actions';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ProjectWrapper } from './project-wrapper';

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const data = await getUserProjectById(session?.user.id as string, id);

  if (!data) {
    return (
      <EmptyState title="Project details" text="No details for this project" />
    );
  }

  const { project } = data;

  return <ProjectWrapper project={project} />;
}
