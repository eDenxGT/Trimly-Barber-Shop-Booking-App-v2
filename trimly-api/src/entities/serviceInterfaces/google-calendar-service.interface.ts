export interface IGoogleCalendarService {
  createMeeting(data: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
  }): Promise<string>;
}
