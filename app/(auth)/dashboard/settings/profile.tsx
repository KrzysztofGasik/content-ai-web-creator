'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '@/lib/schemas';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UpdateProfileData } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GenericButton } from '@/components/generic-button';
import { updateProfileTab } from '@/lib/actions/settings-actions';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
      });
    }
  }, [session?.user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateProfileSchema>) => {
      const result = await updateProfileTab(data);
      return result;
    },
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error('Error during profile update');
        return;
      }
      await update();
      toast.success('Profile updated successfully');
      router.push('/dashboard/settings');
    },
    onError: () => {
      toast.error('Error during profile update');
    },
  });

  const onSubmit = async (data: UpdateProfileData) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Card style={{ maxWidth: 800, margin: '1rem auto', padding: '1rem' }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Your username"
                    autoComplete="off"
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </FormControl>
                {fieldState.error && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Your email"
                    autoComplete="off"
                    type="email"
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </FormControl>
                {fieldState.error && <FormMessage />}
              </FormItem>
            )}
          />
          <GenericButton
            type="submit"
            disabled={form.formState.isSubmitting}
            className="transition-colors duration-200"
            label="Update"
            loadingLabel="Updating..."
            isLoading={form.formState.isSubmitting}
          />
        </form>
      </Form>
      <Toaster position="top-center" />
    </Card>
  );
}
