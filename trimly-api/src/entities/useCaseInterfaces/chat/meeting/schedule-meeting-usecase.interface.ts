export interface IScheduleMeetingUseCase {
  execute(input: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    communityId: string;
    userId: string;
    meetLink: string;
  }): Promise<void>;
}
