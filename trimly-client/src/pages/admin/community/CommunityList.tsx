import { useNavigate } from "react-router-dom";
import { MOCK_COMMUNITY_GROUPS } from "@/data/mockChatData";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { CommunitiesTable } from "@/components/admin/community/CommunitiesTable";

export const AdminCommunityListPage = () => {
  const navigate = useNavigate();

  const handleEdit = (groupId: string) => {
    console.log("Edit community:", groupId);
  };

  const handleDelete = (groupId: string) => {
    console.log("Delete community:", groupId);
  };

  return (
    <CommunitiesTable
      communities={MOCK_COMMUNITY_GROUPS}
      onEdit={handleEdit}
      onDelete={handleDelete}
      getSmartDate={getSmartDate}
    />);
};
