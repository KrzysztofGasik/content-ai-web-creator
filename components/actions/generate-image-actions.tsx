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
      <Button
        className="transition-colors duration-200 w-full"
        onClick={handleDownload}
      >
        Download
      </Button>
      <Button
        className="transition-colors duration-200 w-full"
        onClick={handleSave}
      >
        Save
      </Button>
      <Button
        variant="outline"
        onClick={handleRegenerate}
        className="transition-colors duration-200 w-full"
      >
        Regenerate
      </Button>
    </div>
  );
}
