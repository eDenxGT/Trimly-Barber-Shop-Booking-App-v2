export interface IMeetingRoomEntity {
  meetingId: string;
  title: string;
  description?: string;
  communityId: string;
  scheduledBy: string;
  startTime: Date;
  endTime: Date;
  meetLink: string;
  status?: "scheduled" | "cancelled" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}
