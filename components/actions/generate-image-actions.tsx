import { Button } from '../ui/button';

type GenerateImageActionsProps = {
  handleDownload: () => void;
  handleSave: () => void;
  handleRegenerate: () => void;
};

export function GenerateImageActions({
  handleDownload,
  handleSave,
  handleRegenerate,
}: GenerateImageActionsProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Button className="w-full" onClick={handleDownload}>
        Download
      </Button>
      <Button className="w-full" onClick={handleSave}>
        Save
      </Button>
      <Button variant="outline" onClick={handleRegenerate}>
        Regenerate
      </Button>
    </div>
  );
}
