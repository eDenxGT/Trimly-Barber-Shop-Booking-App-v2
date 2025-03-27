import * as Yup from "yup";

export const emailSchema = Yup.object({
	email: Yup.string()
		.email("Please enter a valid email address")
		.required("Email is required"),
});
