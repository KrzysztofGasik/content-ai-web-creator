import { LabelInputWrapper } from '@/components/label-input-wrapper';
import { Input } from '@/components/ui/input';
import { SetStateAction } from 'react';

type SearchFilterProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
};

export const SearchFilter = ({
  searchQuery,
  setSearchQuery,
}: SearchFilterProps) => {
  return (
    <>
      <LabelInputWrapper>
        <Input
          id="search-content-input"
          type="search"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </LabelInputWrapper>
    </>
  );
};
