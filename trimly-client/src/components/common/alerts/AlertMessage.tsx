import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertMessageProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  className?: string;
}

const iconMap = {
  info: {
    icon: Info,
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-800",
    iconColor: "text-blue-500",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-800",
    iconColor: "text-green-500",
  },
  warning: {
    icon: TriangleAlert,
    bg: "bg-yellow-100",
    border: "border-yellow-400",
    text: "text-yellow-800",
    iconColor: "text-yellow-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-800",
    iconColor: "text-red-500",
  },
};

export function AlertMessage({
  type = "info",
  title,
  message,
  className,
}: AlertMessageProps) {
  const { icon: Icon, bg, border, text, iconColor } = iconMap[type];

  return (
    <div
      className={cn(
        "rounded-md border px-4 py-3 flex items-start gap-3 shadow-sm",
        bg,
        border,
        text,
        className
      )}
    >
      <Icon className={cn("h-5 w-5 mt-1 shrink-0", iconColor)} />
      <div className="text-sm">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-xs">{message}</p>
      </div>
    </div>
  );
}
