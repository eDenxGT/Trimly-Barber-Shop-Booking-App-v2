import { getSmartDate } from "@/utils/helpers/timeFormatter";
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

  const notifyToast = (notification: any) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title || "Notification"}
                </p>
                <p className="text-sm text-gray-800">{notification.message}</p>
                {notification.createdAt && (
                  <p className="mt-1 text-xs text-gray-400">
                    {getSmartDate(notification.createdAt.toString())}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div> */}
        </div>
      ),
      {
        duration: 3000,
      }
    );
  };
  return { successToast, errorToast, infoToast, notifyToast };
}
