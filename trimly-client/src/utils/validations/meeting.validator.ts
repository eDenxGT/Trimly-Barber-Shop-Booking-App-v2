import * as Yup from "yup";

export const meetingSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  meetLink: Yup.string()
    .required("Meeting link is required")
    .matches(
      /^https:\/\/[^\s$.?#].[^\s]*$/,
      "Invalid meeting link. It must be a valid HTTPS URL."
    ),
  meetingDate: Yup.date().required("Meeting date is required").nullable(),
  startHour: Yup.string().required("Start hour is required"),
  startMinute: Yup.string().required("Start minute is required"),
  startPeriod: Yup.string().required("AM/PM is required"),
  endHour: Yup.string().required("End hour is required"),
  endMinute: Yup.string().required("End minute is required"),
  endPeriod: Yup.string().required("AM/PM is required"),
});
