import { Button } from '../ui/button';

type ProjectDetailsActionsProps = {
  handleDelete: () => void;
  handleEdit: () => void;
  isEditing: boolean;
};

export function ProjectDetailsActions({
  handleDelete,
  handleEdit,
  isEditing,
}: ProjectDetailsActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleEdit} className="transition-colors duration-200">
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
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
