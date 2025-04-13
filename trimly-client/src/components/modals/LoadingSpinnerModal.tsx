import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerModalProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingSpinnerModal({
  isOpen,
  message = "Processing...",
}: LoadingSpinnerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[300px] border-none bg-black/70 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
          <p className="text-white text-center">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
