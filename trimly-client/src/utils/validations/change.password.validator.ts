import * as Yup from "yup";

export const changePasswordSchema = Yup.object({
	oldPassword: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
		)
		.required("Password is required"),
	newPassword: Yup.string()
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
		)
		.notOneOf([Yup.ref("oldPassword")], "New password cannot be the same as the old password")
		.required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("newPassword")], "Passwords must match")
		.required("Confirm password is required"),
});
