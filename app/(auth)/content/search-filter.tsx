import { LabelInputWrapper } from '@/components/label-input-wrapper';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getAllTags, getUserProjects } from '@/lib/actions';
import {
  ContentTypeParams,
  SearchParamsProps,
  SortOptions,
  TagsData,
} from '@/types/types';
import { ContentType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { SetStateAction } from 'react';

type SearchFilterProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
  params: {
    project?: string;
    type?: string;
    tags?: string[];
    favorite?: boolean;
    archived?: boolean;
    sort?: SortOptions;
  };
  handleParamsChange: ({
    project,
    newType,
    tags,
    favorite,
    archived,
    sort,
  }: SearchParamsProps) => void;
};

export const SearchFilter = ({
  searchQuery,
  setSearchQuery,
  params,
  handleParamsChange,
}: SearchFilterProps) => {
  const { data: session } = useSession();
  const { data: projectsData } = useQuery({
    queryKey: ['projects', session?.user.id as string],
    queryFn: () => getUserProjects(session?.user.id as string),
  });
  const { data: allTagsData } = useQuery<TagsData>({
    queryKey: ['all-tags'],
    queryFn: () => getAllTags(),
  });

  const toggleTag = (tagName: string) => {
    const currentTags = params.tags || [];
    const updatedArray = currentTags.includes(tagName)
      ? currentTags.filter((item) => item !== tagName)
      : [...currentTags, tagName];
    handleParamsChange({
      project: params.project,
      newType: params.type as ContentTypeParams,
      tags: updatedArray,
      favorite: params.favorite,
      archived: params.archived,
      sort: params.sort,
    });
  };

  return (
    <>
      <LabelInputWrapper>
        <Input
          id="search-content-input"
          type="search"
          placeholder="Search content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </LabelInputWrapper>
      <Separator className="my-5 data-[orientation=horizontal]:w-[300px]" />
      <div className="flex flex-col mb-6">
        <h4>Filter by:</h4>
        <div className="flex gap-4">
          <LabelInputWrapper label="Project">
            <Select
              value={params.project}
              onValueChange={(value) => handleParamsChange({ project: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'ALL'}>All projects</SelectItem>
                {projectsData?.projects?.map((project) => (
                  <SelectItem value={project.id} key={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </LabelInputWrapper>
          <LabelInputWrapper label="Content">
            <Select
              value={params.type}
              onValueChange={(value) =>
                handleParamsChange({ newType: value as ContentTypeParams })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'ALL'}>All content</SelectItem>
                {Object.values(ContentType)?.map((content) => (
                  <SelectItem value={content} key={content}>
                    {content.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </LabelInputWrapper>
          <LabelInputWrapper label="Tags">
            <Popover>
              <PopoverTrigger className="text-sm">
                Select Tags ({params?.tags?.length} selected)
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput />
                  <CommandList>
                    {allTagsData?.tags?.map((tag) => (
                      <CommandItem key={tag.id}>
                        <Checkbox
                          checked={params?.tags?.includes(tag.name)}
                          onCheckedChange={() => toggleTag(tag.name)}
                        />
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </LabelInputWrapper>
          <LabelInputWrapper label="Archived">
            <Button
              onClick={() =>
                handleParamsChange({
                  newType: (params.type || 'ALL') as ContentTypeParams,
                  favorite: params.favorite || false,
                  archived: !params.archived,
                })
              }
              variant={params.archived ? 'default' : 'secondary'}
            >
              Archived
            </Button>
          </LabelInputWrapper>
          <LabelInputWrapper label="Favorite">
            <Button
              onClick={() =>
                handleParamsChange({
                  newType: (params.type || 'ALL') as ContentTypeParams,
                  favorite: !params.favorite,
                  archived: params.archived || false,
                })
              }
              variant={params.favorite ? 'default' : 'secondary'}
            >
              Favorite
            </Button>
          </LabelInputWrapper>
          <LabelInputWrapper label="Sort">
            <Select
              value={params.sort || 'newest'}
              onValueChange={(value) =>
                handleParamsChange({ ...params, sort: value as SortOptions })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>
          </LabelInputWrapper>
        </div>
      </div>
    </>
  );
};
