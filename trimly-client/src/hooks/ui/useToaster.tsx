import { toast } from "react-hot-toast";

export function useToaster() {
  const successToast = (message: string) =>
    toast.success(message, {
      position: "top-right",
      duration: 3000,
    });

  const errorToast = (message: string) =>
    toast.error(message, {
      position: "top-right",
      duration: 3000,
    });

  const infoToast = (message: string) =>
    toast(message, {
      position: "top-right",
      duration: 3000,
      style: {
        background: "#e0f7fa",
        color: "#006064",
      },
    });

  const notifyToast = ({
    title,
    content,
  }: {
    title?: string;
    content?: string;
  }) =>
    toast.custom(
      (t) => (
        <div
          className={`max-w-[300px] p-3 rounded-lg shadow-md bg-white border border-gray-200 ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="font-semibold text-gray-800">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{content}</div>
        </div>
      ),
      {
        position: "bottom-left",
        duration: 5000,
      }
    );

  return { successToast, errorToast, infoToast, notifyToast };
}
