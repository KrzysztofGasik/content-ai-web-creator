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
import { generateSchema } from '@/lib/schemas';
import { ContentType } from '@prisma/client';
import { ContentTemplate, GenerateData } from '@/types/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

export const FormComponent = ({
  form,
  onSubmit,
  templates,
}: {
  form: UseFormReturn<z.infer<typeof generateSchema>>;
  onSubmit: (data: GenerateData) => Promise<null | undefined>;
  templates: ContentTemplate[] | null | undefined;
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          name="templateSelector"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Template</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('id', value === 'none' ? '' : value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'none'}>None (custom)</SelectItem>
                    {templates?.map((template) => (
                      <SelectItem value={template._id} key={template._id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          name="topic"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Topic</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Topic/Subject"
                  autoComplete="off"
                />
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          name="contentType"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Content Type</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(ContentType).map((content) => (
                      <SelectItem value={content} key={content}>
                        {content.toLocaleLowerCase().replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          name="tone"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Tone</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Please select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          name="context"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Context</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Additional context"
                />
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Generate
        </Button>
      </form>
    </Form>
  );
};
