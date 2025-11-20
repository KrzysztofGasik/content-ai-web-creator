import { Button } from './ui/button';

type ContentActionsProps = {
  handleDelete: () => void;
  handleEdit: () => void;
  handleSave: () => Promise<void>;
  generatedContent: string;
  editedContent: string | null;
  isEditing: boolean;
};

export function ContentActions({
  handleDelete,
  handleEdit,
  handleSave,
  generatedContent,
  editedContent,
  isEditing,
}: ContentActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
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
