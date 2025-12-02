'use client';

import { SearchParamsProps } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';

export default function useSetSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project = searchParams.get('project') || 'ALL';
  const type = searchParams.get('type') || 'ALL';
  const tagsParam = searchParams.get('tags');
  const tags = tagsParam ? tagsParam.split(',') : [];
  const favorite = searchParams.get('favorite') === 'true';
  const archived = searchParams.get('archived') === 'true';
  const sort = searchParams.get('sort') || 'newest';

  const handleParamsChange = ({
    project = 'ALL',
    newType = 'ALL',
    tags = ['ALL'],
    favorite = false,
    archived = false,
    sort = 'newest',
  }: SearchParamsProps) => {
    const params = new URLSearchParams(searchParams);
    if (project === 'ALL') {
      params.delete('project');
    } else {
      params.set('project', project);
    }
    if (newType === 'ALL') {
      params.delete('type');
    } else {
      params.set('type', newType);
    }
    if (tags.length === 0) {
      params.delete('tags');
    } else {
      params.set('tags', tags.join(','));
    }
    if (favorite) {
      params.set('favorite', 'true');
    } else {
      params.delete('favorite');
    }
    if (archived) {
      params.set('archived', 'true');
    } else {
      params.delete('archived');
    }
    params.set('sort', sort);
    router.replace(`/content?${params.toString()}`);
  };

  return { project, type, tags, favorite, archived, sort, handleParamsChange };
}
