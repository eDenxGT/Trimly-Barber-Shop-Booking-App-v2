import { AnimatePresence, motion } from "framer-motion";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { CommunitiesTable } from "@/components/admin/community/CommunitiesTable";
import { useGetAllCommunities } from "@/hooks/admin/useCommunity";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { useState } from "react";

const ITEMS_PER_PAGE = 2;

export const AdminCommunityListPage = () => {
  const [page, setPage] = useState(1);

  const { data } = useGetAllCommunities({ page, limit: ITEMS_PER_PAGE });


  const handleEdit = (groupId: string) => {
    console.log("Edit community:", groupId);
  };

  const handleDelete = (groupId: string) => {
    console.log("Delete community:", groupId);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = data?.totalPages || 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"admin-community-list"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <CommunitiesTable
          communities={data?.communities || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getSmartDate={getSmartDate}
        />
        {/* Pagination component */}
        {totalPages > 1 && (
          <div className="mt-6 mb-8">
            <Pagination1
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
