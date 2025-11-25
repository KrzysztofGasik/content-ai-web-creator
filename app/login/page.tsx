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
import { loginSchema } from '@/lib/schemas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoginData } from '@/types/types';

export default function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginData) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: '/dashboard',
    });

    if (result?.error) {
      toast.error('Error during loggin in');
    } else {
      toast.success('Successfully logged in');
      router.push('/dashboard');
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
            Login
          </Button>
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Not registered?{' '}
            </span>
            <Button
              variant="link"
              onClick={() => router.push('/register')}
              className="p-0 h-auto"
            >
              Register
            </Button>
          </div>
        </form>
      </Form>
      <Toaster position="top-center" />
    </Card>
  );
}
