import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import type { CreateProjectData } from '@/types/types';

export const FormComponent = ({
  form,
  onSubmit,
}: {
  form: UseFormReturn<CreateProjectData>;
  onSubmit: (data: CreateProjectData) => Promise<void>;
}) => {
  return (
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
                  placeholder="Type project name"
                  autoComplete="off"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Type project description"
                  autoComplete="off"
                />
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          name="color"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Color</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Select color in hex"
                  autoComplete="off"
                  type="color"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="transition-colors duration-200"
        >
          Create project
        </Button>
      </form>
    </Form>
  );
};
