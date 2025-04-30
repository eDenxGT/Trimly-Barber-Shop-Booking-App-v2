import { format, parseISO } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Search,
  X,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IMeetingRoom } from "@/types/Chat";
import { SiGooglemeet } from "react-icons/si";

interface MeetingsComponentProps {
  meetings: IMeetingRoom[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  startIndex: number;
  resetFilters: () => void;
  handleEditMeeting: (meeting: IMeetingRoom) => void;
  handleCancelMeeting: (meeting: IMeetingRoom) => void;
  handleCompleteMeeting: (meeting: IMeetingRoom) => void;
}

export const MeetingsComponent = ({
  meetings = [],
  isLoading = false,
  searchQuery = "",
  setSearchQuery,
  statusFilter = "all",
  setStatusFilter,
  selectedDate = undefined,
  setSelectedDate,
  isFilterOpen = false,
  setIsFilterOpen,
  startIndex,
  resetFilters,
  handleEditMeeting,
  handleCancelMeeting,
  handleCompleteMeeting,
}: MeetingsComponentProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Scheduled
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const noMeetingsFound = !meetings || meetings.length === 0;

  return (
    <Card className="shadow-md border-0 rounded-lg overflow-hidden">
      <CardHeader className="bg-white px-6 py-5 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Meetings
            </CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              Manage all scheduled meetings across communities
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:w-1/3">
                <div className="flex items-center space-x-2 relative">
                  <Search className="h-4 w-4 absolute left-3 text-gray-400" />
                  <Input
                    placeholder="Search meetings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-10 border-gray-300"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 border-gray-300">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left h-9 border-gray-300",
                        !selectedDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "MMMM d, yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {meetings?.length || 0} meetings
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Meet Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noMeetingsFound ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <Users className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-lg font-medium text-gray-700">
                          No meetings found
                        </p>
                        <p className="text-sm text-gray-500 mt-1 max-w-md text-center">
                          {searchQuery || statusFilter !== "all" || selectedDate
                            ? "Try adjusting your filters to see more results"
                            : "Schedule a meeting to get started"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  meetings?.map((meeting, index) => {
                    const startTime = parseISO(meeting?.startTime.toString());
                    const endTime = parseISO(meeting?.endTime.toString());
                    const durationMinutes = Math.round(
                      (endTime.getTime() - startTime.getTime()) / (1000 * 60)
                    );
                    const hours = Math.floor(durationMinutes / 60);
                    const minutes = durationMinutes % 60;

                    return (
                      <TableRow
                        key={meeting.meetingId}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="text-center font-medium text-gray-500">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-md">
                              <AvatarImage
                                src={meeting.communityDetails?.imageUrl}
                                alt={
                                  meeting.communityDetails?.name || "Community"
                                }
                              />
                              <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
                                {meeting.communityDetails?.name?.charAt(0) ||
                                  "C"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">
                              {meeting.communityDetails?.name ||
                                "Unknown Community"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">
                              {meeting.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {meeting.description
                                ? meeting.description.length > 50
                                  ? meeting.description.slice(0, 50) + "..."
                                  : meeting.description
                                : "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {format(startTime, "MMM d, yyyy")}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(startTime, "h:mm a")} -{" "}
                              {format(endTime, "h:mm a")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {hours > 0 ? `${hours}h ` : ""}
                          {minutes > 0 ? `${minutes}m` : ""}
                        </TableCell>
                        <TableCell>{getStatusBadge(meeting.status)}</TableCell>

                        <TableCell>
                          <a
                            href={meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline max-w-[150px] truncate"
                            title={meeting.meetLink} // shows tooltip on hover
                          >
                            <SiGooglemeet className="text-xl shrink-0" />
                            {/* Google Meet icon */}
                            {/* <span className="truncate">{meeting.meetLink}</span> */}
                          </a>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[180px]"
                            >
                              <DropdownMenuItem
                                onClick={() => handleEditMeeting(meeting)}
                                disabled={
                                  meeting.status === "cancelled" ||
                                  meeting.status === "completed"
                                }
                                className={
                                  meeting.status === "cancelled" ||
                                  meeting.status === "completed"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancelMeeting(meeting)}
                                disabled={
                                  meeting.status === "cancelled" ||
                                  meeting.status === "completed"
                                }
                                className={
                                  meeting.status === "cancelled" ||
                                  meeting.status === "completed"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "text-red-600"
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCompleteMeeting(meeting)}
                                disabled={
                                  meeting.status === "cancelled" ||
                                  meeting.status === "completed"
                                }
                                className={
                                  meeting.status === "cancelled" ||
                                  meeting.status === "completed"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "text-blue-600"
                                }
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Complete Meeting
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
