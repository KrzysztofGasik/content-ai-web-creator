import { Button } from '../ui/button';

type ContentActionsProps = {
  handleView: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
  handleSave: () => Promise<void>;
  generatedContent: string;
  editedContent: string | null;
  isEditing: boolean;
};

export function ContentActions({
  handleView,
  handleDelete,
  handleEdit,
  handleSave,
  generatedContent,
  editedContent,
  isEditing,
}: ContentActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleView}>View</Button>
      <Button onClick={handleEdit}>{isEditing ? 'Cancel' : 'Edit'}</Button>
      <Button
        onClick={handleSave}
        disabled={generatedContent === editedContent}
      >
        Save
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
