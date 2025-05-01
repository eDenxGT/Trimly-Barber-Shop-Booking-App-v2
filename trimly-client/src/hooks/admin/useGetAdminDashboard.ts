import { getAdminDashboardData } from "@/services/admin/adminService";
import { IAdminDashboardResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminDashboardData = () => {
  return useQuery<IAdminDashboardResponse>({
    queryKey: ["admin-dashboard-data"],
    queryFn: () => getAdminDashboardData(),
    placeholderData: (prev) => prev ?? undefined,
    refetchOnWindowFocus: true,
  });
};
