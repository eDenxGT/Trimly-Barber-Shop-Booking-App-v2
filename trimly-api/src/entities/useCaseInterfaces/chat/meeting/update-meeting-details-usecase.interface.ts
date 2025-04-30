export interface IUpdateMeetingDetailsUseCase {
  execute({
    title,
    description,
    startTime,
    endTime,
    communityId,
    meetLink,
    meetingId,
  }: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    communityId: string;
    meetLink: string;
    meetingId: string;
  }): Promise<void>;
}
