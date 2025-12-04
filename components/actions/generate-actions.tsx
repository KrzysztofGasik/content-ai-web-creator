import { GenericButton } from '../generic-button';
import { Button } from '../ui/button';

type GenerateActionsProps = {
  handleCopy: (text: string) => void;
  handleEdit: () => void;
  handleSave: () => void;
  generatedContent: string;
  editedContent: string;
  isEditing: boolean;
  isSaving: boolean;
};

export function GenerateActions({
  handleCopy,
  handleEdit,
  handleSave,
  generatedContent,
  editedContent,
  isEditing,
  isSaving,
}: GenerateActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => handleCopy(generatedContent)}
        className="transition-colors duration-200"
      >
        Copy
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
    </div>
  );
}
