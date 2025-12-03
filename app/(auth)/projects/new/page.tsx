'use client';

import { Card } from '@/components/ui/card';
import { createProject } from '@/lib/actions/project-actions';
import { createProjectSchema } from '@/lib/schemas';
import type { CreateProjectData } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import { FormComponent } from './form';
import { useRouter } from 'next/navigation';

export default function New() {
  const router = useRouter();
  const form = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#1414ff',
    },
  });

  const onSubmit = async (data: CreateProjectData) => {
    try {
      const result = await createProject(data);
      if (result.success) {
        toast.success('Project created successfully');
        router.push('/projects');
      } else {
        toast.error('Project creation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Project creation failed');
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
