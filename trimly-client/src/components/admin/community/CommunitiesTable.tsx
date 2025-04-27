import MuiButton from "@/components/common/buttons/MuiButton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICommunityChatPreview } from "@/types/Chat";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CommunitiesTable = ({
  communities,
  onEdit,
  onDelete,
  getSmartDate,
}: {
  communities: ICommunityChatPreview[];
  onEdit: (communityId: string) => void;
  onDelete: (communityId: string) => void;
  getSmartDate: (date: string) => string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 mt-16 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Manage Communities
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your barber communities
          </p>
        </div>
        <MuiButton
          onClick={() => navigate("/admin/communities/create")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </MuiButton>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communities.map((community) => (
              <TableRow key={community.communityId}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {community.imageUrl && (
                      <img
                        src={community.imageUrl}
                        alt={community.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span>{community.name}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {community.description || "No description"}
                </TableCell>
                <TableCell>{community.membersCount} members</TableCell>
                <TableCell>
                  {getSmartDate(community.createdAt.toString())}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(community.communityId)}
                      className="text-zinc-600 hover:text-zinc-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(community.communityId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
