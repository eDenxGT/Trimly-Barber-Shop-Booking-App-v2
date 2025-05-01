import { getBarberDashboardData } from "@/services/barber/barberService";
import { IBarberDashboardResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useGetBarberDashboardData = () => {
  return useQuery<IBarberDashboardResponse>({
    queryKey: ["barber-dashboard-data"],
    queryFn: () =>
      getBarberDashboardData(),
    placeholderData: (prev) => prev ?? undefined,
    refetchOnWindowFocus: true,
  });
};
