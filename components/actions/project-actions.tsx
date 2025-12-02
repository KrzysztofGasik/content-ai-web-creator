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
      <Button onClick={handleView}>View</Button>
      <Button onClick={handleEdit}>Edit</Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}
