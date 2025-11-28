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
import { generateImageSchema } from '@/lib/schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { imageQuality, imageSize, imageStyle } from '@/lib/utils';

export const FormComponent = ({
  form,
  onSubmit,
}: {
  form: UseFormReturn<z.infer<typeof generateImageSchema>>;
  onSubmit: (data: z.infer<typeof generateImageSchema>) => Promise<void>;
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          name="prompt"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Prompt</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Prompt"
                  autoComplete="off"
                />
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <FormField
          name="size"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Size</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select image size" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageSize?.map((size) => (
                      <SelectItem value={size} key={size}>
                        {size}
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
          name="quality"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Image quality</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select image quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageQuality.map((quality) => (
                      <SelectItem value={quality} key={quality}>
                        {quality}
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
          name="style"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Image style</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select image style" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageStyle.map((style) => (
                      <SelectItem value={style} key={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Generate image
        </Button>
      </form>
    </Form>
  );
};
