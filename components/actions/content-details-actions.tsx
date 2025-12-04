import { ExportFile } from '@/types/types';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { GenericButton } from '../generic-button';

type ContentDetailsActionsProps = {
  handleCopy: (text: string) => void;
  handleEdit: () => void;
  handleSave: () => void;
  handleDownload: (data: ExportFile) => void;
  handleFavorite: () => void;
  handleArchived: () => void;
  handleDelete: () => void;
  generatedContent: string;
  editedContent: string;
  isEditing: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  exportData: ExportFile;
  isSaving: boolean;
};

export function ContentDetailsActions({
  handleCopy,
  handleEdit,
  handleSave,
  handleDownload,
  handleFavorite,
  handleArchived,
  handleDelete,
  generatedContent,
  editedContent,
  isEditing,
  isFavorite,
  isArchived,
  exportData,
  isSaving,
}: ContentDetailsActionsProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button
        className="transition-colors duration-200 w-full"
        onClick={() => handleCopy(generatedContent)}
      >
        Copy
      </Button>
      <Button
        className="transition-colors duration-200 w-full"
        onClick={handleEdit}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
      <GenericButton
        label="Save"
        loadingLabel="Saving..."
        isLoading={isSaving}
        className="w-full"
        onClick={handleSave}
        disabled={
          isSaving ||
          !editedContent ||
          editedContent === generatedContent ||
          editedContent.trim() === ''
        }
      />
      <Separator className="my-4" />
      <Button
        variant="outline"
        onClick={() => handleDownload(exportData)}
        className="transition-colors duration-200"
      >
        Download (.md)
      </Button>
      <Button
        variant="outline"
        onClick={handleFavorite}
        className="transition-colors duration-200"
      >
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </Button>
      <Button
        variant="outline"
        onClick={handleArchived}
        className="transition-colors duration-200"
      >
        {isArchived ? 'Remove from archived' : 'Add to archived'}
      </Button>
      <Separator className="my-4" />
      <Button
        onClick={handleDelete}
        variant="destructive"
        className="transition-colors duration-200"
      >
        Delete
      </Button>
    </div>
  );
}
