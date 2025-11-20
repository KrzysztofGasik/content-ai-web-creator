import { Button } from './ui/button';

type GenerateActionsProps = {
  handleCopy: (text: string) => void;
  handleEdit: () => void;
  handleSave: () => void;
  generatedContent: string;
  editedContent: string;
  isEditing: boolean;
};

export function GenerateActions({
  handleCopy,
  handleEdit,
  handleSave,
  generatedContent,
  editedContent,
  isEditing,
}: GenerateActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => handleCopy(generatedContent)}>Copy</Button>
      <Button onClick={handleEdit}>{isEditing ? 'Cancel' : 'Edit'}</Button>
      <Button
        onClick={handleSave}
        disabled={generatedContent === editedContent}
      >
        Save
      </Button>
    </div>
  );
}
