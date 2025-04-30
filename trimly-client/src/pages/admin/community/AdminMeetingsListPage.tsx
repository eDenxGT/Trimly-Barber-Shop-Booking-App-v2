import { useState, useEffect } from "react";
import { format } from "date-fns";
import { EditMeetingModal } from "@/components/modals/EditMeetingModal";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { IMeetingRoom } from "@/types/Chat";
import {
  useCancelMeeting,
  useCompleteMeeting,
  useGetAllMeetings,
  useUpdateMeeting,
} from "@/hooks/meeting/useMeetingRoom";
import { Pagination1 } from "@/components/common/paginations/Pagination1";
import { MeetingsComponent } from "@/components/admin/community/MeetingsList";
import { useToaster } from "@/hooks/ui/useToaster";

export function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<IMeetingRoom[]>();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCompletedDialogOpen, setIsCompletedDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<IMeetingRoom | null>(
    null
  );

  const { data, isLoading } = useGetAllMeetings({
    search: searchQuery,
    status: statusFilter !== "all" ? statusFilter : "",
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    page,
    limit: 10,
  });

  const { mutate: updateMeeting } = useUpdateMeeting();
  const { mutate: completeMeeting } = useCompleteMeeting();
  const { mutate: cancelMeeting } = useCancelMeeting();

  const { successToast, errorToast } = useToaster();

  const totalPages = data?.totalPages;

  useEffect(() => {
    setMeetings(data?.meetings);
  }, [searchQuery, statusFilter, selectedDate, data?.meetings]);

  const handleEditMeeting = (meeting: IMeetingRoom) => {
    setSelectedMeeting(meeting);
    setIsEditModalOpen(true);
  };

  const handleCancelMeeting = (meeting: IMeetingRoom) => {
    setSelectedMeeting(meeting);
    setIsCancelDialogOpen(true);
  };

  const handleCompleteMeeting = (meeting: IMeetingRoom) => {
    setSelectedMeeting(meeting);
    setIsCompletedDialogOpen(true);
  };

  const saveEditedMeeting = (editedMeeting: IMeetingRoom) => {
    updateMeeting(editedMeeting, {
      onSuccess: (data) => {
        setIsEditModalOpen(false);
        successToast(data?.message);
      },
      onError: (error: any) => {
        errorToast(error.response.data.message);
      },
    });
  };

  const confirmMeetingCompletion = () => {
    if (selectedMeeting) {
      completeMeeting(
        { meetingId: selectedMeeting.meetingId },
        {
          onSuccess: (data) => {
            setIsCompletedDialogOpen(false);
            successToast(data?.message);
          },
          onError: (error: any) => {
            errorToast(error.response.data.message);
          },
        }
      );
    }
  };

  const confirmCancelMeeting = () => {
    if (selectedMeeting) {
      cancelMeeting(
        { meetingId: selectedMeeting.meetingId },
        {
          onSuccess: (data) => {
            setIsCancelDialogOpen(false);
            successToast(data?.message);
          },
          onError: (error: any) => {
            errorToast(error.response.data.message);
          },
        }
      );
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedDate(undefined);
  };

  const startIndex = (page - 1) * 10;
  const noMeetingsFound = !meetings || meetings.length === 0;

  return (
    <div className="container mx-auto mt-16 py-8 px-4">
      <MeetingsComponent
        meetings={meetings || []}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        resetFilters={resetFilters}
        handleEditMeeting={handleEditMeeting}
        handleCancelMeeting={handleCancelMeeting}
        handleCompleteMeeting={handleCompleteMeeting}
        startIndex={startIndex}
      />

      {/* Edit Meeting Modal */}
      {selectedMeeting && (
        <EditMeetingModal
          meeting={selectedMeeting}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMeeting(null);
          }}
          onSave={saveEditedMeeting}
        />
      )}

      {/* Cancel Meeting Dialog */}
      {selectedMeeting && (
        <ConfirmationModal
          title="Cancel Meeting"
          description="Are you sure you want to cancel this meeting? This action cannot be undone."
          isOpen={isCancelDialogOpen}
          onClose={() => {
            setIsCancelDialogOpen(false);
            setSelectedMeeting(null);
          }}
          onConfirm={confirmCancelMeeting}
        />
      )}

      {/* Complete Meeting Dialog */}
      {selectedMeeting && (
        <ConfirmationModal
          title="Meeting Completed?"
          description="Are you sure you want to complete this meeting? This action cannot be undone."
          isOpen={isCompletedDialogOpen}
          onClose={() => {
            setIsCompletedDialogOpen(false);
            setSelectedMeeting(null);
          }}
          onConfirm={confirmMeetingCompletion}
        />
      )}

      {/* Only render pagination if there are meetings */}
      {!noMeetingsFound && (
        <div className="mt-4">
          <Pagination1
            currentPage={page}
            totalPages={totalPages || 1}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
