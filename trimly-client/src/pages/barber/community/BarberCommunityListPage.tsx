import { AnimatePresence, motion } from "framer-motion";
import { useGetAllCommunities } from "@/hooks/admin/useCommunity";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { useEffect, useState } from "react";
import { useToaster } from "@/hooks/ui/useToaster";
import { CommunitiesList } from "@/components/barber/community/CommunityList";
import { debounce } from "lodash";
import { barberGetAllCommunitiesForListing } from "@/services/barber/barberService";
import { useJoinCommunityMutation } from "@/hooks/barber/useBarberCommunity";

const ITEMS_PER_PAGE = 10;

export const BarberCommunityListPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const { successToast, errorToast } = useToaster();

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    handler();

    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  const { data, refetch } = useGetAllCommunities({
    queryFn: barberGetAllCommunitiesForListing,
    search: debouncedSearch,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const { mutate: barberJoinCommunity } = useJoinCommunityMutation();

  const handleJoin = (communityId: string) => {
    barberJoinCommunity(
      { communityId },
      {
        onSuccess: (data) => {
          successToast(data.message);
          refetch();
        },
        onError: (error: any) => {
          errorToast(error.response.data.message);
        },
      }
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = data?.totalPages || 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"barber-community-list"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mt-16"
      >
        <CommunitiesList
          communities={data?.communities || []}
          onJoin={handleJoin}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
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
