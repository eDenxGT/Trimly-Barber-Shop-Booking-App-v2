import { adminAxiosInstance } from "@/api/admin.axios";
import { FetchUsersParams, UsersResponse } from "@/hooks/admin/useAllUsers";
import { FetchShopsParams } from "@/hooks/barber/useAllBarberShops";
import { ICommunityChat, IMeetingRoom } from "@/types/Chat";
import { IHairstyle } from "@/types/Hairstyle";
import {
  IAdminDashboardResponse,
  IAdminResponse,
  IAllBarberShopsResponse,
  IAllCommunitiesResponse,
  IAllMeetingRoomResponse,
  IAuthResponse,
  IAxiosResponse,
  ICommunityChatResponse,
  IHairstylePaginationResponse,
  WithdrawalResponse,
} from "@/types/Response";
import { IAdmin, IBarber, IClient, UpdatePasswordData } from "@/types/User";
import { WithdrawalQueryParams } from "@/types/Wallet";

export type IUpdateAdminData = Pick<
  IAdmin,
  "fullName" | "email" | "phoneNumber" | "avatar"
>;

export const refreshAdminSession = async (): Promise<IAuthResponse> => {
  const response = await adminAxiosInstance.get<IAuthResponse>(
    "/admin/refresh-session"
  );
  return response.data;
};

export const getAllUsers = async <T extends IClient | IBarber>({
  userType,
  page = 1,
  limit = 10,
  search = "",
}: FetchUsersParams): Promise<UsersResponse<T>> => {
  const response = await adminAxiosInstance.get("/admin/users", {
    params: { userType, page, limit, search },
  });

  return {
    users: response.data.users,
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
};

export const getAllShops = async ({
  forType = "non-active",
  page = 1,
  limit = 10,
  search = "",
}: FetchShopsParams): Promise<IAllBarberShopsResponse> => {
  const response = await adminAxiosInstance.get("/admin/shops", {
    params: { forType, page, limit, search },
  });

  return {
    shops: response.data.shops as IBarber[],
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
};

export const updateBarberShopStatusById = async ({
  id,
  status,
  message,
}: {
  id: string;
  status: string;
  message?: string;
}): Promise<IAxiosResponse> => {
  const response = await adminAxiosInstance.put<IAxiosResponse>(
    `/admin/shop/${id}`,
    { status, message }
  );
  return response.data;
};

export const updateUserStatus = async (data: {
  userType: string;
  userId: string;
}): Promise<IAxiosResponse> => {
  const response = await adminAxiosInstance.patch(
    "/admin/user-status",
    {},
    {
      params: {
        userType: data.userType,
        userId: data.userId,
      },
    }
  );
  return response.data;
};

export const updateAdminPassword = async ({
  oldPassword,
  newPassword,
}: UpdatePasswordData): Promise<IAxiosResponse> => {
  const response = await adminAxiosInstance.put<IAxiosResponse>(
    "/admin/update-password",
    {
      oldPassword,
      newPassword,
    }
  );
  return response.data;
};

export const updateAdminProfile = async (
  data: IUpdateAdminData
): Promise<IAdminResponse> => {
  const response = await adminAxiosInstance.put<IAdminResponse>(
    "/admin/details",
    data
  );
  return response.data;
};

export const fetchUserWithdrawals = async (
  params: WithdrawalQueryParams
): Promise<WithdrawalResponse> => {
  const response = await adminAxiosInstance.get<WithdrawalResponse>(
    "/admin/withdrawals",
    { params }
  );
  return response.data;
};

export const rejectWithdrawal = async (
  withdrawalId: string,
  remarks: string
) => {
  const response = await adminAxiosInstance.put("/admin/withdrawals", {
    withdrawalId,
    remarks,
  });

  return response.data;
};

export const approveWithdrawal = async (withdrawalId: string) => {
  const response = await adminAxiosInstance.patch("/admin/withdrawals", {
    withdrawalId,
  });
  return response.data;
};

export const adminGetCommunityById = async (communityId: string) => {
  const response = await adminAxiosInstance.get<ICommunityChatResponse>(
    "/admin/community",
    { params: { communityId } }
  );
  return response.data;
};

export const adminCreateCommunity = async (data: Partial<ICommunityChat>) => {
  const response = await adminAxiosInstance.post<IAxiosResponse>(
    "/admin/community",
    data
  );
  return response.data;
};

export const adminEditCommunity = async (data: Partial<ICommunityChat>) => {
  const response = await adminAxiosInstance.put<IAxiosResponse>(
    "/admin/community",
    data
  );
  return response.data;
};

export const adminDeleteCommunity = async ({
  communityId,
}: {
  communityId: string;
}) => {
  console.log(communityId);
  const response = await adminAxiosInstance.delete<IAxiosResponse>(
    "/admin/community",
    { params: { communityId } }
  );
  return response.data;
};

export const adminToggleCommunityStatus = async ({
  communityId,
}: {
  communityId: string;
}) => {
  const response = await adminAxiosInstance.patch<IAxiosResponse>(
    "/admin/community",
    { communityId }
  );
  return response.data;
};

export const adminGetAllCommunities = async ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  const response = await adminAxiosInstance.get<IAllCommunitiesResponse>(
    "/admin/communities",
    { params: { search, page, limit } }
  );
  return response.data;
};

export const adminScheduleMeeting = async (data: Partial<IMeetingRoom>) => {
  const response = await adminAxiosInstance.post<IAxiosResponse>(
    "/admin/meeting",
    data
  );
  return response.data;
};

export const adminGetAllMeetings = async ({
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
  const response = await adminAxiosInstance.get<IAllMeetingRoomResponse>(
    "/admin/all-meetings",
    { params: { search, status, date, page, limit } }
  );
  return response.data;
};

export const adminUpdateMeeting = async (data: Partial<IMeetingRoom>) => {
  const response = await adminAxiosInstance.put<IAxiosResponse>(
    "/admin/meeting",
    data
  );
  return response.data;
};

export const adminDeleteMeeting = async ({
  meetingId,
}: {
  meetingId: string;
}) => {
  const response = await adminAxiosInstance.delete<IAxiosResponse>(
    "/admin/meeting",
    { params: { meetingId } }
  );
  return response.data;
};

export const adminCompleteMeeting = async ({
  meetingId,
}: {
  meetingId: string;
}) => {
  const response = await adminAxiosInstance.patch<IAxiosResponse>(
    "/admin/meeting",
    { meetingId }
  );
  return response.data;
};

export const getAdminDashboardData =
  async (): Promise<IAdminDashboardResponse> => {
    const response = await adminAxiosInstance.get<{
      data: IAdminDashboardResponse;
    }>("/admin/dashboard");
    return response.data.data;
  };

export const addHairstyle = async (data: Partial<IHairstyle>) => {
  const response = await adminAxiosInstance.post<IAxiosResponse>(
    "/admin/hairstyle",
    data
  );
  return response.data;
};

export const updateHairstyle = async (data: Partial<IHairstyle>) => {
  const response = await adminAxiosInstance.put<IAxiosResponse>(
    `/admin/hairstyle/${data.hairstyleId}`,
    data
  );
  return response.data;
};

export const getAllHairstyles = async ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  const response = await adminAxiosInstance.get<IHairstylePaginationResponse>(
    "/admin/all-hairstyles",
    { params: { search, page, limit } }
  );
  return response.data;
};

export const deleteHairstyle = async ({
  hairstyleId,
}: {
  hairstyleId: string;
}) => {
  const response = await adminAxiosInstance.delete<IAxiosResponse>(
    `/admin/hairstyle/${hairstyleId}`
  );
  return response.data;
};
