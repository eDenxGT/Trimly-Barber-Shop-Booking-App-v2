import { barberAxiosInstance } from "@/api/barber.axios";
import {
  IAuthResponse,
  IAxiosResponse,
  IBarberHoursResponse,
  IBarberResponse,
  IBookingResponse,
  IServiceResponse,
  IWalletPageResponse,
} from "@/types/Response";
import { IService } from "@/types/Service";
import { IBarber, UpdatePasswordData } from "@/types/User";
import { WithdrawRequestDTO } from "@/types/Wallet";

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
