import * as Yup from "yup";

export const clientSignupSchema = Yup.object().shape({
	fullName: Yup.string()
		.matches(
			/^[a-zA-Z\s]+$/,
			"Full name should only contain letters and spaces"
		)
		.min(1, "Full name must be at least 1 character")
		.max(50, "Full name must not exceed 50 characters")
		.required("Full name is required"),
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	phoneNumber: Yup.string()
		.matches(/^\+?[1-9]\d{9}$/, "Invalid phone number")
		.required("Contact number is required"),
	password: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
		)
		.required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf(
			[Yup.ref("password") as unknown as string],
			"Passwords must match"
		)
		.required("Confirm Password is required"),
});
