import { CommunityCreationForm } from "@/components/admin/community/CommunityCreationForm";
import { ICommunityChat } from "@/types/Chat";
import { AnimatePresence, motion } from "framer-motion";
import { useCreateCommunityMutation } from "../../../hooks/admin/useCommunity";
import { useToaster } from "@/hooks/ui/useToaster";
import { useNavigate } from "react-router-dom";

export const AdminCreateCommunityPage = () => {
  const { successToast, errorToast } = useToaster();
  const navigate = useNavigate();

  const {
    mutate: createCommunity,
    isPending: isCreating,
    isError: isCreatingError,
  } = useCreateCommunityMutation();
  const handleSubmitCreate = (values: Partial<ICommunityChat>) => {
    createCommunity(values, {
      onSuccess: (data) => {
        successToast(data.message);
        navigate("/admin/communities");
      },
      onError: (error: any) => {
        errorToast(error.response.data.message);
      },
    });
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={"admin-community-list"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mt-22"
      >
        <CommunityCreationForm
          onSubmit={handleSubmitCreate}
          isLoading={isCreating && !isCreatingError}
        />
      </motion.div>
    </AnimatePresence>
  );
};
