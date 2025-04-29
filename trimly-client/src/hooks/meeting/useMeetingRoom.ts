import { adminScheduleMeeting } from "@/services/admin/adminService";
import { fetchMeetingRoomById } from "@/services/barber/barberService";
import { IMeetingRoom } from "@/types/Chat";
import { IAxiosResponse, IMeetingRoomResponse } from "@/types/Response";
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
