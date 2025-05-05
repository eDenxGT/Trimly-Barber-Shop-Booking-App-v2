import { AnimatePresence, motion } from "framer-motion";
import { HairstylesManagement } from "@/components/admin/hairstyle-detector/HairstylesList";
import { useEffect, useState } from "react";
import { useGetAllHairstyle } from "@/hooks/hairstyle-detector/useGetHairstyle";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { HairstyleFormModal } from "../../../components/modals/AdminHairstyleFormModal";
import { useToaster } from "@/hooks/ui/useToaster";
import { IHairstyle } from "@/types/Hairstyle";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useDeleteHairstyleMutation } from "@/hooks/hairstyle-detector/useHairstyleMutation";

const itemsPerPage = 9;

export const AdminHairstylesListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedHairstyle, setSelectedHairstyle] = useState<IHairstyle | null>(
    null
  );
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const { successToast, errorToast } = useToaster();

  const { data: hairstylesData, isLoading } = useGetAllHairstyle({
    search: debouncedSearchTerm,
    page: currentPage,
    limit: itemsPerPage,
  });

  const {
    mutateAsync: deleteHairstyleMutation,
    isPending: deleteHairstyleLoading,
  } = useDeleteHairstyleMutation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleConfirmDelete = () => {
    deleteHairstyleMutation(
      {
        hairstyleId: selectedHairstyle?.hairstyleId || "",
      },
      {
        onSuccess: (data) => {
          successToast(data.message);
          setIsConfirmationModalOpen(false);
          setSelectedHairstyle(null);
        },
        onError: (error: any) => {
          errorToast(
            error?.response?.data?.message ||
              "Operation failed. Please try again."
          );
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsConfirmationModalOpen(false);
    setSelectedHairstyle(null);
  };

  const handleEdit = (hairstyle: IHairstyle) => {
    setSelectedHairstyle(hairstyle);
    setIsFormModalOpen(true);
  };

  const handleDelete = (hairstyle: IHairstyle) => {
    setSelectedHairstyle(hairstyle);
    setIsConfirmationModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedHairstyle(null);
  };

  const totalPages = hairstylesData?.totalPages || 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="admin-hairstyles-list-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mt-17"
      >
        <HairstylesManagement
          hairstyles={hairstylesData?.hairstyles || []}
          searchTerm={searchTerm}
          handleEditHairstyle={handleEdit}
          handleDeleteHairstyle={handleDelete}
          setSearchTerm={setSearchTerm}
          debouncedSearchTerm={debouncedSearchTerm}
          setIsCreationModalOpened={setIsFormModalOpen}
          isLoading={isLoading || deleteHairstyleLoading}
        />
        {/* Pagination */}
        <div className="mt-8">
          <Pagination1
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="py-4"
          />
        </div>

        {/* Hairstyle Creation Modal */}
        <HairstyleFormModal
          isModalOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedHairstyle(null);
          }}
          onSuccess={handleFormSuccess}
          hairstyleData={(selectedHairstyle as IHairstyle) || undefined}
        />

        {/* Confirmation Modal for Deleting Hairstyle */}
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          title="Delete Hairstyle"
          description="Are you sure you want to delete this hairstyle?"
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
        />
      </motion.div>
    </AnimatePresence>
  );
};
