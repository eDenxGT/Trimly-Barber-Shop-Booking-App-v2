import { useCallback, useState } from "react";
import { Info, Plus, Edit, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { ICommunityChat } from "@/types/Chat";
import { CommunityDetailsModal } from "@/components/modals/AdminCommunityDetailsModal";
import { MdBlock } from "react-icons/md";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { Input } from "@/components/ui/input";

export const CommunitiesTable = ({
  communities,
  onDelete,
  onStatusChange,
  searchTerm,
  setSearchTerm,
}: {
  communities: ICommunityChat[];
  onDelete: (communityId: string) => void;
  onStatusChange: (communityId: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) => {
  const navigate = useNavigate();
  const [selectedCommunity, setSelectedCommunity] =
    useState<ICommunityChat | null>(null);
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(
    null
  );
  console.log(selectedCommunity);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

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
        <MuiButton onClick={() => navigate("/admin/communities/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </MuiButton>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search communities..."
          className="pl-10 bg-white"
          value={searchTerm}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communities.map((community, index) => (
              <TableRow key={community.communityId}>
                <TableCell className="font-medium">{index + 1}</TableCell>
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
                <TableCell className="capitalize">
                  {community.status === "active" ? (
                    <span className="bg-green-500 text-white font-medium px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white font-medium px-2 py-1 rounded">
                      Blocked
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {getSmartDate(community.createdAt.toString())}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedCommunity(community)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        navigate(
                          `/admin/communities/edit/${community.communityId}`
                        )
                      }
                      className="text-zinc-600 hover:text-zinc-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onStatusChange(community.communityId)}
                      className="text-zinc-600 hover:text-zinc-900"
                    >
                      <MdBlock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCommunityToDelete(community.communityId);
                        setIsConfirmModalOpen(true);
                      }}
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

      <CommunityDetailsModal
        community={selectedCommunity}
        isOpen={!!selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setCommunityToDelete(null);
          setIsConfirmModalOpen(false);
        }}
        title="Delete Community"
        description="Are you sure you want to delete this community?"
        onConfirm={() => {
          onDelete(communityToDelete || "");
          setCommunityToDelete(null);
        }}
      />
    </div>
  );
};
