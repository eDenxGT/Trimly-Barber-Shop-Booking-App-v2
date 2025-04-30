import {
  adminCompleteMeeting,
  adminDeleteMeeting,
  adminGetAllMeetings,
  adminScheduleMeeting,
  adminUpdateMeeting,
} from "@/services/admin/adminService";
import { fetchMeetingRoomById } from "@/services/barber/barberService";
import { IMeetingRoom } from "@/types/Chat";
import {
  IAllMeetingRoomResponse,
  IAxiosResponse,
  IMeetingRoomResponse,
} from "@/types/Response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  limit,
}: {
  search: string;
  status: string;
  date: string;
  page: number;
  limit: number;
}) => {
  return useQuery<IAllMeetingRoomResponse>({
    queryKey: ["admin-meetings", search, status, date, page, limit],
    queryFn: () =>
      adminGetAllMeetings({
        search,
        status,
        date,
        page,
        limit,
      }),
  });
};

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, Partial<IMeetingRoom>>({
    mutationFn: adminUpdateMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-meetings"],
        exact: false,
      });
    },
  });
};

export const useCancelMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, { meetingId: string }>({
    mutationFn: adminDeleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-meetings"],
        exact: false,
      });
    },
  });
};

export const useCompleteMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation<IAxiosResponse, Error, { meetingId: string }>({
    mutationFn: adminCompleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-meetings"],
        exact: false,
      });
    },
  });
};
