import { adminScheduleMeeting } from "@/services/admin/adminService";
import { IMeetingRoom } from "@/types/Chat";
import { IAxiosResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

export const useScheduleMeeting = () => {
  return useMutation<IAxiosResponse, Error, Partial<IMeetingRoom>>({
    mutationFn: adminScheduleMeeting,
  });
};
