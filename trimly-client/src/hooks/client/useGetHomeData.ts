import { getHomePageData } from "@/services/client/clientService";
import { IClientHomePageResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useGetClientHomeData = ({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) => {
  return useQuery<IClientHomePageResponse>({
    queryKey: ["client-home-data", latitude, longitude],
    queryFn: () =>
      getHomePageData({
        latitude,
        longitude,
      }),
    placeholderData: (prev) => prev ?? undefined,
  });
};
