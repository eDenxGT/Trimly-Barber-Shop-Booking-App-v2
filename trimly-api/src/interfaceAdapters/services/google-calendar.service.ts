import { injectable } from "tsyringe";
import { google } from "googleapis";
import { IGoogleCalendarService } from "../../entities/serviceInterfaces/google-calendar-service.interface.js";
import { JWT } from "google-auth-library";
import { config } from "../../shared/config.js";

@injectable()
export class GoogleCalendarService implements IGoogleCalendarService {
  private _authClient: JWT;

  constructor() {
    this._authClient = new JWT({
      email: config.google.GOOGLE_SERVICE_CLIENT_EMAIL,
      key: config.google.GOOGLE_SERVICE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
  }

  async createMeeting(data: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
  }): Promise<string> {
    const auth = this._authClient;
    const calendar = google.calendar({ version: "v3", auth });

    const startDate = new Date(data.start);
    const endDate = new Date(data.end);

    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: data.summary,
        description: data.description,
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}-${Math.random()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
      conferenceDataVersion: 1,
    });

    const meetLink = res.data?.conferenceData?.entryPoints?.[0]?.uri;
    return meetLink || "";
  }
}
