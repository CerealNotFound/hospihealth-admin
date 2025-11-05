import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PreviewDialogProps {
  applicationId: string | null;
  onClose: () => void;
}

export function PreviewDialog({ applicationId, onClose }: PreviewDialogProps) {
  if (!applicationId) return null;

  return (
    <Dialog open={!!applicationId} onOpenChange={() => onClose()}>
      <DialogContent aria-describedby="Preview dialog" className="max-w-7xl">
        <DialogTitle className="text-lg font-semibold">
          Resume Preview
        </DialogTitle>
        <iframe
          src={`/resume/${applicationId}`}
          className="w-full h-[80vh] border-0"
          title="Resume Preview"
        />
      </DialogContent>
    </Dialog>
  );
}
