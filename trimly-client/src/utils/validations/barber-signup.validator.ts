import * as Yup from "yup";

export const barberSignupSchema = Yup.object({
	shopName: Yup.string().required("Shop name is required"),
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	phoneNumber: Yup.string()
		.required("Phone number is required")
		.matches(/^[0-9]+$/, "Must be only digits")
		.min(10, "Must be at least 10 digits"),
	password: Yup.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters"),
	confirmPassword: Yup.string()
		.required("Please confirm your password")
		.oneOf([Yup.ref("password")], "Passwords must match"),
	location: Yup.object({
		name: Yup.string().required("Location name is required"),
		zipCode: Yup.string().required("Zip code is required. Choose another location"),
		latitude: Yup.number().nullable(),
		longitude: Yup.number().nullable(),
	}),
});
