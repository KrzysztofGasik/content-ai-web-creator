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
import { updatePasswordSchema } from '@/lib/schemas';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { UpdatePasswordData } from '@/types/types';
import { useRouter } from 'next/navigation';
import { GenericButton } from '@/components/generic-button';
import { updatePasswordTab } from '@/lib/actions/settings-actions';
import { useSession } from 'next-auth/react';

export default function SecurityPage() {
  const { update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updatePasswordSchema>) => {
      const result = await updatePasswordTab(data);
      return result;
    },
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error('Error during password update');
        return;
      }
      await update();
      toast.success('Password updated successfully');
      form.reset();
      router.push('/dashboard/settings');
    },
    onError: () => {
      toast.error('Error during password update');
    },
  });

  const onSubmit = async (data: UpdatePasswordData) => {
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
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Current password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Your current password"
                    autoComplete="off"
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </FormControl>
                {fieldState.error && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>New password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Your new password"
                    autoComplete="off"
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                </FormControl>
                {fieldState.error && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Confirm your new password"
                    autoComplete="off"
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
