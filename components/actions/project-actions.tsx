import { Button } from '../ui/button';

type ProjectActionsProps = {
  handleView: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
};

export function ProjectActions({
  handleView,
  handleDelete,
  handleEdit,
}: ProjectActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleView} className="transition-colors duration-200">
        View
      </Button>
      <Button onClick={handleEdit} className="transition-colors duration-200">
        Edit
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
