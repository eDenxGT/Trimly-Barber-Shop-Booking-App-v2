import { barberAxiosInstance } from "@/api/barber.axios";
import { IPostFormData } from "@/types/Feed";
import {
  IAllChatResponse,
  IAllCommunitiesResponse,
  IAuthResponse,
  IAxiosResponse,
  IBarberDashboardResponse,
  IBarberHoursResponse,
  IBarberResponse,
  IBookingResponse,
  IFaceShapeDetectionResponse,
  IHairstyleResponse,
  IMeetingRoomResponse,
  INotificationResponse,
  IServiceResponse,
  ISinglePostResponse,
  IWalletPageResponse,
} from "@/types/Response";
import { IService } from "@/types/Service";
import { IBarber, UpdatePasswordData } from "@/types/User";
import { WithdrawRequestDTO } from "@/types/Wallet";
import axios from "axios";
const faceShapeDetectionApiUrl = import.meta.env
  .VITE_FACE_SHAPE_DETECTION_API_URI;

export type IUpdateBarberData = Partial<
  Pick<
    IBarber,
    | "shopName"
    | "email"
    | "phoneNumber"
    | "avatar"
    | "description"
    | "banner"
    | "location"
    | "openingHours"
  >
>;

export const refreshBarberSession = async (): Promise<IAuthResponse> => {
  const response = await barberAxiosInstance.get<IAuthResponse>(
    "/barber/refresh-session"
  );
  return response.data;
};

export const updateBarberPassword = async ({
  oldPassword,
  newPassword,
}: UpdatePasswordData) => {
  const response = await barberAxiosInstance.put<IAxiosResponse>(
    "/barber/update-password",
    {
      oldPassword,
      newPassword,
    }
  );
  return response.data;
};

export const updateBarberProfile = async (
  data: IUpdateBarberData
): Promise<IBarberResponse> => {
  const response = await barberAxiosInstance.put<IBarberResponse>(
    "/barber/details",
    data
  );
  return response.data;
};

// * Services Apis
export const updateBarberService = async (
  data: Partial<IService>
): Promise<IAxiosResponse> => {
  const response = await barberAxiosInstance.put<IAxiosResponse>(
    `/barber/services/${data.serviceId}`,
    data
  );
  return response.data;
};

export const deleteBarberService = async (
  serviceId: string
): Promise<IAxiosResponse> => {
  const response = await barberAxiosInstance.delete<IAxiosResponse>(
    `/barber/services/${serviceId}`
  );
  return response.data;
};

export const addBarberService = async (
  data: IService
): Promise<IAxiosResponse> => {
  const response = await barberAxiosInstance.post<IAxiosResponse>(
    "/barber/services",
    data
  );
  return response.data;
};

export const getBarberServices = async (): Promise<IServiceResponse> => {
  const response = await barberAxiosInstance.get<IServiceResponse>(
    "/barber/services"
  );
  return response.data;
};

// * Services OpeningHours
export const updateOpeningHours = async (
  data: IBarber["openingHours"]
): Promise<IBarberHoursResponse> => {
  const response = await barberAxiosInstance.put<IBarberHoursResponse>(
    `/barber/opening-hours`,
    data
  );
  return response.data;
};

export const getBookingsForBarber = async (): Promise<IBookingResponse> => {
  const response = await barberAxiosInstance.get("/barber/booking", {
    params: { type: "barber" },
  });

  return response.data;
};

export const handleBookingCompleteUpdate = async (bookingId: string) => {
  const response = await barberAxiosInstance.patch("/barber/booking", {
    bookingId,
  });

  return response.data;
};

// * Wallet APIs

export const getWalletPageDataForBarber =
  async (): Promise<IWalletPageResponse> => {
    const response = await barberAxiosInstance.get("/barber/wallet");
    return response.data;
  };

export const barberTopUpWallet = async (amount: number) => {
  const response = await barberAxiosInstance.post("/barber/wallet", {
    amount,
  });
  return {
    orderId: response.data.orderId,
    amount: response.data.amount,
    currency: response.data.currency,
    customData: { transactionId: response.data.transactionId },
  };
};
export const handleVerifyBarberTopUpPayment = async (res: any) => {
  const verificationData = {
    razorpay_order_id: res.razorpay_order_id,
    razorpay_payment_id: res.razorpay_payment_id,
    razorpay_signature: res.razorpay_signature,
    transactionId: res.customData.transactionId,
  };

  await barberAxiosInstance.put("/barber/wallet", verificationData);
};

export const handleFailureBarberTopUpPayment = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  await barberAxiosInstance.patch("/barber/wallet", {
    orderId,
    status,
  });
};

export const barberWithdrawFromWallet = async (
  payload: WithdrawRequestDTO
): Promise<IAxiosResponse> => {
  const response = await barberAxiosInstance.post(
    "/barber/wallet/withdraw",
    payload
  );
  return response.data;
};

// * Post APIs
export const addPost = async (payload: IPostFormData) => {
  const response = await barberAxiosInstance.post("/barber/posts", payload);
  return response.data;
};

export const fetchPostsForBarbers = async ({
  pageParam = 1,
}: {
  pageParam: number;
}) => {
  const response = await barberAxiosInstance.get("/barber/posts", {
    params: { page: pageParam, limit: 9 },
  });
  return response.data;
};

export const fetchPostByPostIdForBarbers = async (
  postId: string,
  forType: string
) => {
  const response = await barberAxiosInstance.get<ISinglePostResponse>(
    `/barber/posts/${postId}`,
    { params: { forType } }
  );
  return response.data;
};

export const editPost = async ({
  payload,
  postId,
}: {
  payload: IPostFormData;
  postId: string;
}) => {
  const response = await barberAxiosInstance.put(
    `/barber/posts/${postId}`,
    payload
  );
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await barberAxiosInstance.delete(`/barber/posts/${postId}`);
  return response.data;
};

export const updatePostStatus = async (postId: string) => {
  const response = await barberAxiosInstance.patch(`/barber/posts/${postId}`);
  return response.data;
};

export const barberToggleLikePost = async ({ postId }: { postId: string }) => {
  const response = await barberAxiosInstance.post(
    `/barber/posts/${postId}/like`
  );
  return response.data;
};

export const barberPostComment = async ({
  postId,
  comment,
}: {
  postId: string;
  comment: string;
}) => {
  const response = await barberAxiosInstance.post(
    `/barber/posts/${postId}/comment`,
    { comment }
  );
  return response.data;
};

export const barberToggleCommentLike = async ({
  commentId,
}: {
  commentId: string;
}) => {
  const response = await barberAxiosInstance.patch(
    `/barber/posts/comment/${commentId}/like`
  );
  return response.data;
};

export const getChatByUserIdForBarber = async (userId: string) => {
  const response = await barberAxiosInstance.get("/barber/chat", {
    params: { userId },
  });
  return response.data;
};

export const getChatByChatIdForBarber = async (chatId: string) => {
  const response = await barberAxiosInstance.get("/barber/chat", {
    params: { chatId },
  });
  return response.data;
};
export const getCommunityChatByChatIdForBarber = async (chatId: string) => {
  const response = await barberAxiosInstance.get("/barber/community-chat", {
    params: { chatId },
  });
  return response.data;
};

export const getAllChatsByBarberId = async (): Promise<IAllChatResponse> => {
  const response = await barberAxiosInstance.get<IAllChatResponse>(
    "/barber/chats"
  );
  return response.data;
};

export const getAllCommunityChatsByBarberId =
  async (): Promise<IAllChatResponse> => {
    const response = await barberAxiosInstance.get<IAllChatResponse>(
      "/barber/community-chats"
    );
    return response.data;
  };

export const barberGetAllCommunitiesForListing = async ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  const response = await barberAxiosInstance.get<IAllCommunitiesResponse>(
    "/barber/communities",
    {
      params: {
        search,
        page,
        limit,
      },
    }
  );
  return response.data;
};

export const joinCommunity = async ({
  communityId,
}: {
  communityId: string;
}) => {
  const response = await barberAxiosInstance.put<IAxiosResponse>(
    "/barber/community/join",
    { communityId }
  );

  return response.data;
};

export const fetchMeetingRoomById = async (communityId: string) => {
  const response = await barberAxiosInstance.get<IMeetingRoomResponse>(
    "/barber/meeting",
    { params: { communityId } }
  );
  return response.data;
};

export const getBarberDashboardData =
  async (): Promise<IBarberDashboardResponse> => {
    const response = await barberAxiosInstance.get<{
      data: IBarberDashboardResponse;
    }>("/barber/dashboard");
    return response.data.data;
  };

export const barberDetectFaceShape = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<IFaceShapeDetectionResponse>(
    faceShapeDetectionApiUrl,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer eyJzdWIiOiIxMjM0NTY4ODkwIiwibmFtZSI6IkpqaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`,
      },
    }
  );

  return response.data;
};

export const getBarberHairstyles = async ({
  gender,
  faceShape,
}: {
  gender: string;
  faceShape: string;
}) => {
  const response = await barberAxiosInstance.get<IHairstyleResponse>(
    "/barber/hairstyles",
    {
      params: {
        gender,
        faceShape,
      },
    }
  );
  return response.data;
};

export const getBarberNotifications = async () => {
  const response = await barberAxiosInstance.get<INotificationResponse>(
    "/barber/notifications"
  );
  return response.data;
};

export const markSingleNotificationAsReadForBarber = async ({
  notificationId,
}: {
  notificationId: string;
}) => {
  const response = await barberAxiosInstance.patch(
    `/barber/notifications/${notificationId}/read`
  );
  return response.data;
};

export const markAllNotificationsAsReadForBarber = async () => {
  const response = await barberAxiosInstance.patch(
    "/barber/notifications/read"
  );
  return response.data;
};
