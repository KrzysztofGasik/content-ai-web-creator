'use client';

import { Card } from '@/components/ui/card';
import { getUserProjectById, updateProject } from '@/lib/actions';
import { createProjectSchema } from '@/lib/schemas';
import type { CreateProjectData, CreateProjectType } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import { FormComponent } from './form';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Edit() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const userId = session?.user.id || '';
  const { id: projectId } = params;
  const { data } = useQuery<CreateProjectType>({
    queryKey: ['edit-project', userId],
    queryFn: () => getUserProjectById(userId, projectId as string),
  });
  const form = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '',
    },
  });

  useEffect(() => {
    if (data?.project) {
      form.reset({
        name: data.project.name || '',
        description: data.project.description || '',
        color: data.project.color || '#ffffff',
      });
    }
  }, [data, form]);

  const onSubmit = async (data: CreateProjectData) => {
    try {
      const result = await updateProject(projectId as string, data);
      if (result.success) {
        toast.success('Project updated successfully');
        router.push('/projects');
      } else {
        toast.error('Project update failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Project update failed');
    }
  };

  return (
    <Card className="flex flex-col p-10 w-full lg:w-[50%] justify-around md:flex-row">
      <div className="flex-1">
        <FormComponent form={form} onSubmit={onSubmit} />
      </div>
      <Toaster position="top-center" />
    </Card>
  );
}
