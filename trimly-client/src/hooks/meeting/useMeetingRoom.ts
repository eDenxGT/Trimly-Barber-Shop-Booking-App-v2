import {
  adminGetAllMeetings,
  adminScheduleMeeting,
} from "@/services/admin/adminService";
import { fetchMeetingRoomById } from "@/services/barber/barberService";
import { IMeetingRoom } from "@/types/Chat";
import {
  IAllMeetingRoomResponse,
  IAxiosResponse,
  IMeetingRoomResponse,
} from "@/types/Response";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useScheduleMeeting = () => {
  return useMutation<IAxiosResponse, Error, Partial<IMeetingRoom>>({
    mutationFn: adminScheduleMeeting,
  });
};

export const useGetMeetingById = (communityId: string) => {
  return useQuery<IMeetingRoomResponse>({
    queryKey: ["meeting", communityId],
    queryFn: () => fetchMeetingRoomById(communityId),
    enabled: !!communityId,
    placeholderData: (prev) => prev ?? undefined,
  });
};

export const useGetAllMeetings = ({
  search,
  status,
  date,
  page,
  limit
}: {
  search: string;
  status: string;
  date: string;
  page: number;
  limit: number;
}) => {
  return useQuery<IAllMeetingRoomResponse>({
    queryKey: ["admin-meetings", search, status, date, page, limit],
    queryFn: () => adminGetAllMeetings({
      search,
      status,
      date,
      page,
      limit,
    }),
  });
};