import { barberAxiosInstance } from "@/api/barber.axios";
import { clientAxiosInstance } from "@/api/client.axios";

export async function getPresignedUrl(
  path: string,
  role: "barber" | "client",
  operation: "putObject" | "getObject"
) {
  const axiosInstance =
    role === "barber" ? barberAxiosInstance : clientAxiosInstance;

  const response = await axiosInstance.get(
    `${role}/s3/generate-presigned-url`,
    {
      params: {
        path,
        operation,
      },
    }
  );

  return response.data.url;
}
