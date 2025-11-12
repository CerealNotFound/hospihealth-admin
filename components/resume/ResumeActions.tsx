import { Button } from "@/components/ui/button";
import { Download, Eye, Trash } from "lucide-react";

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
        className="hover:text-[#2e0101] hover:bg-[#FCF3F3]"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDownload}
        title="Download PDF"
        className="hover:text-[#DBA622] hover:bg-[#FCF3F3]"
      >
        <Download className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Delete Application"
        className="hover:text-[#bb0b0b] hover:bg-[#FCF3F3]"
      >
        <Trash className="w-4 h-4" />
      </Button>
    </>
  );
}
