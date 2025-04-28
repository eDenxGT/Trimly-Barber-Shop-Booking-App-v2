import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Users } from "lucide-react";
import { ICommunityChat } from "@/types/Chat";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import MuiButton from "@/components/common/buttons/MuiButton";

export const CommunitiesList = ({
  communities,
  onJoin,
  searchTerm,
  setSearchTerm,
}: {
  communities: ICommunityChat[];
  onJoin: (communityId: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleJoinCommunity = (communityId: string) => {
    onJoin(communityId);
  };
  console.log(communities)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Barber Communities
        </h1>
        <p className="text-zinc-600">
          Join barber communities and connect with professionals
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <Card
            key={community.communityId}
            className="overflow-hidden hover:shadow-lg py-0 transition-shadow duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={community.imageUrl || "/placeholder.svg"}
                alt={community.name}
                className="w-full h-full hover:scale-105 transition-all object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-xl font-semibold text-white">
                  {community.name}
                </h3>
              </div>
            </div>

            <div className="p-4">
              <p className="text-zinc-600 text-sm mb-4 line-clamp-2">
                {community.description || "No description available"}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {community.membersCount} members
                  </span>
                </div>
                <MuiButton
                  disabled={community.isJoined}
                  onClick={() => {
                    setSelectedCommunityId(community.communityId);
                    setIsConfirmModalOpen(true);
                  }}
                  variant="darkblue"
                  className="max-w-fit"
                >
                  {community.isJoined ? "Joined" : "Join Community"}
                </MuiButton>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Join Community"
        description="Are you sure you want to join this community?"
        onConfirm={() => {
          handleJoinCommunity(selectedCommunityId || "");
          setSelectedCommunityId(null);
        }}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedCommunityId(null);
        }}
      />
    </div>
  );
};
