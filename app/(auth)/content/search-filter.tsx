import { LabelInputWrapper } from '@/components/label-input-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ContentType } from '@/prisma/app/generated/prisma/client/enums';
import { ContentTypeParams, SearchParamsProps } from '@/types/types';
import { SetStateAction } from 'react';

type SearchFilterProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
  params: {
    type?: string;
    favorite?: boolean;
    archived?: boolean;
  };
  handleParamsChange: ({
    newType,
    favorite,
    archived,
  }: SearchParamsProps) => void;
};

export const SearchFilter = ({
  searchQuery,
  setSearchQuery,
  params,
  handleParamsChange,
}: SearchFilterProps) => {
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
          <LabelInputWrapper label="Content">
            <Select
              name="content-type-input"
              value={params.type}
              onValueChange={(value) =>
                handleParamsChange({ newType: value as ContentTypeParams })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'ALL'}>ALL</SelectItem>
                {Object.values(ContentType)?.map((content) => (
                  <SelectItem value={content} key={content}>
                    {content.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
      </div>
    </>
  );
};
