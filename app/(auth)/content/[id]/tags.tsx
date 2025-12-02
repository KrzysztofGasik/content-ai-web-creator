'use client';

import { EmptyState } from '@/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  addTagToConent,
  getAllTags,
  getContentTags,
  removeTagFromContent,
} from '@/lib/actions';
import { cn } from '@/lib/utils';
import { TagsData, TagsWithContentData } from '@/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeMinusIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const Tags = ({ contentId }: { contentId: string }) => {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const { data: allTagsData } = useQuery<TagsData>({
    queryKey: ['all-tags'],
    queryFn: () => getAllTags(),
  });
  const { data } = useQuery<TagsWithContentData>({
    queryKey: ['tags'],
    queryFn: () => getContentTags(contentId),
  });
  const queryClient = useQueryClient();

  if (!contentId) return;
  if (!data) {
    return <EmptyState title={'Tags'} text={'No tags'} />;
  }

  const handleAddTag = async (tagName: string) => {
    try {
      if (!tagName) {
        toast.error('Tag cannot be empty');
        return;
      }
      const result = await addTagToConent(contentId, tagName);
      if (result.success) {
        toast.success('Tag successfully added to content');
        queryClient.invalidateQueries({ queryKey: ['tags'] });
      } else {
        toast.error('Error during adding tag to content');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during adding tag to content');
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      if (!tagId) {
        toast.error('Must provide tag with id');
        return;
      }
      const result = await removeTagFromContent(contentId, tagId);
      if (result.success) {
        toast.success('Tag successfully deleted from content');
        queryClient.invalidateQueries({ queryKey: ['tags'] });
      } else {
        toast.error('Error during deletion tag from content');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during deletion tag from content');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 my-4">
        {data?.content?.tags?.map((tag) => (
          <Badge key={tag.id} className="text-md">
            {tag.name}{' '}
            <Button
              className="p-0"
              onClick={() => {
                handleRemoveTag(tag.id);
              }}
            >
              <BadgeMinusIcon />
            </Button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[200px] justify-between"
          >
            Select tag...
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              className="h-9"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty className="flex flex-col gap-2 items-center">
                <p className="text-sm">No tags found.</p>
                <Button
                  onClick={() => handleAddTag(searchValue)}
                  className="mb-2"
                >
                  Create {searchValue}
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {allTagsData?.tags?.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={(tagName) => {
                      handleAddTag(tagName);
                      setOpen(false);
                    }}
                  >
                    {tag.name}
                    <Check className={cn('ml-auto', 'opacity-100')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
