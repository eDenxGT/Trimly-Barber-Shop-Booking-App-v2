import { clientAxiosInstance } from "@/api/client.axios";
import { ForType } from "@/hooks/barber/useAllBarberShops";
import { FetchNearestShopsParams } from "@/hooks/client/useNearestBarberShops";
import { IBookingPayload } from "@/types/Booking";
import {
  IAllChatResponse,
  IAuthResponse,
  IAxiosResponse,
  IBarberResponse,
  IBookingResponse,
  IClientHomePageResponse,
  IClientResponse,
  ISinglePostResponse,
  IWalletPageResponse,
} from "@/types/Response";
import { ReviewDTO } from "@/types/Review";
import { IBarber, IClient, UpdatePasswordData } from "@/types/User";
import { WithdrawRequestDTO } from "@/types/Wallet";

export type IUpdateClientData = Pick<
  IClient,
  "fullName" | "email" | "phoneNumber" | "avatar" | "location"
>;

export const refreshClientSession = async (): Promise<IAuthResponse> => {
  const response = await clientAxiosInstance.get<IAuthResponse>(
    "/client/refresh-session"
  );
  return response.data;
};

export const updateClientPassword = async ({
  oldPassword,
  newPassword,
}: UpdatePasswordData): Promise<IAxiosResponse> => {
  const response = await clientAxiosInstance.put<IAxiosResponse>(
    "/client/update-password",
    {
      oldPassword,
      newPassword,
    }
  );
  return response.data;
};

export const updateClientProfile = async (
  data: IUpdateClientData
): Promise<IClientResponse> => {
  const response = await clientAxiosInstance.put<IClientResponse>(
    "/client/details",
    data
  );
  return response.data;
};

export const getAllNearestBarberShops = async ({
  search = "",
  amenities = [],
  userLocation = [],
  sortBy = "rating",
  sortOrder = "asc",
  page = 1,
  limit = 3,
}: FetchNearestShopsParams): Promise<IBarber[]> => {
  const response = await clientAxiosInstance.get("/client/barber-shops", {
    params: {
      search,
      amenities: amenities.join(","),
      userLocation,
      sortBy,
      sortOrder,
      page,
      limit,
    },
  });

  return response.data.shops;
};

export const getBarberShopDetailsById = async ({
  shopId,
  forType,
}: {
  shopId: string;
  forType: ForType;
}): Promise<IBarberResponse> => {
  const response = await clientAxiosInstance.get(
    "/client/barber-shop/details",
    {
      params: {
        shopId,
        forType,
      },
    }
  );
  return response.data;
};

export const getBookingsByShopId = async (
  shopId: string
): Promise<IBookingResponse> => {
  const response = await clientAxiosInstance.get("/client/booking", {
    params: { shopId },
  });

  return response.data;
};

export const getBookingsForClient = async (): Promise<IBookingResponse> => {
  const response = await clientAxiosInstance.get("/client/booking", {
    params: { type: "client" },
  });

  return response.data;
};

export const bookingCancel = async (
  bookingId: string
): Promise<IAxiosResponse> => {
  const response = await clientAxiosInstance.patch("/client/booking", {
    bookingId,
  });

  return response.data;
};

export const createBooking = async (bookingPayload: IBookingPayload) => {
  const res = await clientAxiosInstance.post("/client/booking", bookingPayload);
  return {
    orderId: res.data.id,
    amount: res.data.amount,
    currency: res.data.currency,
    customData: { bookingId: res.data.bookingId },
  };
};

export const verifyPayment = async (res: any) => {
  const verificationData = {
    razorpay_order_id: res.razorpay_order_id,
    razorpay_payment_id: res.razorpay_payment_id,
    razorpay_signature: res.razorpay_signature,
    bookingId: res.customData.bookingId,
  };

  await clientAxiosInstance.post("/client/payment", verificationData);
};

export const handleFailureBookingPayment = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  await clientAxiosInstance.put("/client/payment", {
    orderId,
    status,
  });
};

export const getWalletPageDataForClient =
  async (): Promise<IWalletPageResponse> => {
    const response = await clientAxiosInstance.get("/client/wallet");
    return response.data;
  };

export const clientTopUpWallet = async (amount: number) => {
  const response = await clientAxiosInstance.post("/client/wallet", {
    amount,
  });
  return {
    orderId: response.data.orderId,
    amount: response.data.amount,
    currency: response.data.currency,
    customData: { transactionId: response.data.transactionId },
  };
};
export const handleVerifyClientTopUpPayment = async (res: any) => {
  const verificationData = {
    razorpay_order_id: res.razorpay_order_id,
    razorpay_payment_id: res.razorpay_payment_id,
    razorpay_signature: res.razorpay_signature,
    transactionId: res.customData.transactionId,
  };

  await clientAxiosInstance.put("/client/wallet", verificationData);
};

export const handleFailureClientTopUpPayment = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  await clientAxiosInstance.patch("/client/wallet", {
    orderId,
    status,
  });
};

export const clientWithdrawFromWallet = async (
  payload: WithdrawRequestDTO
): Promise<IAxiosResponse> => {
  const response = await clientAxiosInstance.post(
    "/client/wallet/withdraw",
    payload
  );
  return response.data;
};

export const postReviewOnBarber = async (payload: ReviewDTO) => {
  const response = await clientAxiosInstance.post("/client/review", payload);
  return response.data;
};

// * Post APIs
export const fetchPostByPostIdForClients = async (
  postId: string,
  forType: string
) => {
  const response = await clientAxiosInstance.get<ISinglePostResponse>(
    `/client/posts/${postId}`,
    { params: { forType } }
  );
  return response.data;
};

export const fetchPostsForClients = async ({
  pageParam = 1,
}: {
  pageParam: number;
}) => {
  const response = await clientAxiosInstance.get("/client/posts", {
    params: { page: pageParam, limit: 3 },
  });
  return response.data;
};

export const clientToggleLikePost = async ({ postId }: { postId: string }) => {
  const response = await clientAxiosInstance.post(
    `/client/posts/${postId}/like`
  );
  return response.data;
};

export const clientPostComment = async ({
  postId,
  comment,
}: {
  postId: string;
  comment: string;
}) => {
  const response = await clientAxiosInstance.post(
    `/client/posts/${postId}/comment`,
    { comment }
  );
  return response.data;
};

export const clientToggleCommentLike = async ({
  commentId,
}: {
  commentId: string;
}) => {
  const response = await clientAxiosInstance.patch(
    `/client/posts/comment/${commentId}/like`
  );
  return response.data;
};

export const handleWalletPayment = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  await clientAxiosInstance.patch("/client/wallet", {
    orderId,
    status,
  });
};

export const paymentWithWallet = async (payload: IBookingPayload) => {
  const res = await clientAxiosInstance.post("/client/booking/wallet", payload);

  return res.data;
};

export const getChatByUserIdForClient = async (userId: string) => {
  const response = await clientAxiosInstance.get("/client/chat", {
    params: { userId },
  });
  return response.data;
};

export const getChatByChatIdForClient = async (chatId: string) => {
  const response = await clientAxiosInstance.get("/client/chat", {
    params: { chatId },
  });
  return response.data;
};

export const getAllChatsByClientId = async (): Promise<IAllChatResponse> => {
  const response = await clientAxiosInstance.get<IAllChatResponse>(
    "/client/chats"
  );
  return response.data;
};

export const getHomePageData = async ({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) => {
  const response = await clientAxiosInstance.get<IClientHomePageResponse>(
    "/client/home-data",
    { params: { latitude, longitude } }
  );
  return response.data;
};
