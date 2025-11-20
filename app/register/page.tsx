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
import { email, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/schemas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { RegisterData } from '@/types/types';

export default function Register() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Successfully registered');
      router.push('/login');
    },
    onError: () => {
      toast.error('Error during registration');
    },
  });

  const onSubmit = async (data: RegisterData) => {
    registerMutation.mutate(data);
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
                <FormLabel htmlFor={field.name}>Your name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Your username"
                    autoComplete="off"
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
                  />
                </FormControl>
                {fieldState.error && <FormMessage />}
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Your password"
                    autoComplete="off"
                    type="password"
                  />
                </FormControl>
                {fieldState.error && <FormMessage />}
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Already have an account?{' '}
            </span>
            <Button
              variant="link"
              onClick={() => router.push('/login')}
              className="p-0 h-auto"
            >
              Login
            </Button>
          </div>
        </form>
      </Form>
      <Toaster position="top-center" />
    </Card>
  );
}
