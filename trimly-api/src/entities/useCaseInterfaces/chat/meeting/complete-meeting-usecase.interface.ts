export interface ICompleteMeetingUseCase {
  execute({ meetingId }: { meetingId: string }): Promise<void>;
}
