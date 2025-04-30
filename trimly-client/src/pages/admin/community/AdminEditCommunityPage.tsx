import { CommunityForm } from "@/components/admin/community/CommunityForm";
import { ICommunityChat } from "@/types/Chat";
import { AnimatePresence, motion } from "framer-motion";
import {
  useEditCommunityMutation,
  useGetCommunityForEdit,
} from "../../../hooks/admin/useCommunity";
import { useToaster } from "@/hooks/ui/useToaster";
import { useNavigate, useParams } from "react-router-dom";

export const AdminEditCommunityPage = () => {
  const { successToast, errorToast } = useToaster();
  const { communityId } = useParams();
  const navigate = useNavigate();

  const { data: communityData } = useGetCommunityForEdit(communityId || "");

  const {
    mutate: editCommunity,
    isPending: isCreating,
    isError: isCreatingError,
  } = useEditCommunityMutation();
  
  const handleSubmitCreate = (values: Partial<ICommunityChat>) => {
    editCommunity(values, {
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
        <CommunityForm
          onSubmit={handleSubmitCreate}
          isLoading={isCreating && !isCreatingError}
          formType="edit"
          initialData={communityData?.community}
        />
      </motion.div>
    </AnimatePresence>
  );
};
