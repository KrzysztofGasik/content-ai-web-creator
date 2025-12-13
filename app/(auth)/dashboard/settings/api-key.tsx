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
import { updateApiKeySchema } from '@/lib/schemas';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiKeyData, UpdateKeyData } from '@/types/types';
import { useRouter } from 'next/navigation';
import { GenericButton } from '@/components/generic-button';
import {
  getUserApiKey,
  updateUserApiKey,
} from '@/lib/actions/settings-actions';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApiPage() {
  const [toggle, setToggle] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const { data } = useQuery<ApiKeyData>({
    queryKey: ['get-key', session?.user?.id],
    queryFn: () => getUserApiKey(),
  });
  const form = useForm<z.infer<typeof updateApiKeySchema>>({
    resolver: zodResolver(updateApiKeySchema),
    defaultValues: {
      key: data?.key || '',
    },
  });

  useEffect(() => {
    if (data?.key) {
      form.reset({
        key: data?.key || '',
      });
    }
  }, [data?.key, form]);

  const updateKeyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateApiKeySchema>) => {
      const result = await updateUserApiKey(data);
      return result;
    },
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      await update();
      toast.success('Key updated successfully');
      form.reset();
      router.push('/dashboard/settings');
    },
    onError: () => {
      toast.error('Error during key updated action');
    },
  });

  const onSubmit = async (data: UpdateKeyData) => {
    updateKeyMutation.mutate(data);
  };

  const handleCopy = async () => {
    try {
      const result = await getUserApiKey();
      if (!result.success) {
        toast.error(result.message);
      } else {
        navigator.clipboard.writeText(result.key as string);
        toast.success('API key copied successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unexpected error during copy action');
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '1rem auto', padding: '1rem' }}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            name="key"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>API key</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1">
                    <Input
                      {...field}
                      id={field.name}
                      type={`${toggle ? 'text' : 'password'}`}
                      placeholder="Your current password"
                      autoComplete="off"
                      className="transition-all duration-200 focus:scale-[1.01]"
                    />
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setToggle((prev) => !prev);
                      }}
                      variant="ghost"
                    >
                      {toggle ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
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
      <Button onClick={handleCopy}>Copy API key</Button>
      <Toaster position="top-center" />
    </Card>
  );
}
