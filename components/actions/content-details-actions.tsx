import { ExportFile } from '@/types/types';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

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
}: ContentDetailsActionsProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button className="w-full" onClick={() => handleCopy(generatedContent)}>
        Copy
      </Button>
      <Button className="w-full" onClick={handleEdit}>
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
      <Button
        className="w-full"
        onClick={handleSave}
        disabled={
          !editedContent ||
          editedContent === generatedContent ||
          editedContent.trim() === ''
        }
      >
        Save
      </Button>
      <Separator className="my-4" />
      <Button variant="outline" onClick={() => handleDownload(exportData)}>
        Download (.md)
      </Button>
      <Button variant="outline" onClick={handleFavorite}>
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </Button>
      <Button variant="outline" onClick={handleArchived}>
        {isArchived ? 'Remove from archived' : 'Add to archived'}
      </Button>
      <Separator className="my-4" />
      <Button onClick={handleDelete} variant="destructive">
        Delete
      </Button>
    </div>
  );
}
