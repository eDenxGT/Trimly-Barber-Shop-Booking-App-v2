import { getAllHairstyles } from "@/services/admin/adminService";
import { IHairstylePaginationResponse } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";

export const useGetAllHairstyle = ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  
  return useQuery<IHairstylePaginationResponse>({
    queryKey: ["all-hairstyles", search, page, limit],
    queryFn: () => getAllHairstyles({ search, page, limit }),
  });
}
