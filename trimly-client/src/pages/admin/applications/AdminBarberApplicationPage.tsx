import { useState, useEffect } from "react";
import { useToaster } from "@/hooks/ui/useToaster";
import { BarberShopApplicationComponent } from "@/components/admin/applications/AdminBarberApplication";
import {
  useAllShopsQuery,
  useUpdateShopStatusMutation,
} from "@/hooks/barber/useAllBarberShops";
import { getAllShops } from "@/services/admin/adminService";
import { debounce } from "lodash";

export function AdminBarberShopApplicationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const limit = 10;

  useEffect(() => {
    const handler = debounce(() => setDebouncedSearch(searchQuery), 300);
    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  const { successToast } = useToaster();

  const { data, refetch, isLoading } = useAllShopsQuery(
    getAllShops,
    currentPage,
    limit,
    debouncedSearch,
    "pending"
  );
  const shops = data?.shops || [];
  const totalPages = data?.totalPages || 1;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const {
    mutate: updateStatus,
    isPending,
    isError,
  } = useUpdateShopStatusMutation();

  const handleUpdateStatus = async (
    id: string,
    status: string,
    message?: string
  ) => {
    await updateStatus(
      { id, status, message },
      {
        onSuccess: (data) => {
          successToast(data.message);
          refetch();
        },
      }
    );
  };

  return (
    <BarberShopApplicationComponent
      shops={shops}
      totalPages={totalPages}
      currentPage={currentPage}
      isLoading={isLoading || (isPending && !isError)}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onPageChange={handlePageChange}
      onUpdateStatus={handleUpdateStatus}
    />
  );
}
