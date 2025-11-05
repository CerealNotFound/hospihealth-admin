import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash } from "lucide-react";

interface ResumeActionsProps {
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function ResumeActions({
  onPreview,
  onDownload,
  onDelete,
}: ResumeActionsProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreview}
        title="Preview Resume"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDownload}
        title="Download PDF"
      >
        <FileText className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Delete Application"
      >
        <Trash className="w-4 h-4" />
      </Button>
    </>
  );
}
