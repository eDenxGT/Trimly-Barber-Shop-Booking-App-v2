export interface ICancelMeetingUseCase {
  execute({ meetingId }: { meetingId: string }): Promise<void>;
}
