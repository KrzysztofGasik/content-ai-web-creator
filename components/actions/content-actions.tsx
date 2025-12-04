import { GenericButton } from '../generic-button';
import { Button } from '../ui/button';

type ContentActionsProps = {
  handleView: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
  handleSave: () => Promise<void>;
  generatedContent: string;
  editedContent: string | null;
  isEditing: boolean;
  isSaving: boolean;
};

export function ContentActions({
  handleView,
  handleDelete,
  handleEdit,
  handleSave,
  generatedContent,
  editedContent,
  isEditing,
  isSaving,
}: ContentActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleView} className="transition-colors duration-200">
        View
      </Button>
      <Button onClick={handleEdit} className="transition-colors duration-200">
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
      <GenericButton
        label="Save"
        loadingLabel="Saving..."
        isLoading={isSaving}
        onClick={handleSave}
        disabled={generatedContent === editedContent || isSaving}
      />
      <Button
        variant="destructive"
        onClick={handleDelete}
        className="transition-colors duration-200"
      >
        Delete
      </Button>
    </div>
  );
}
