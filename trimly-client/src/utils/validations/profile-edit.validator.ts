import * as Yup from "yup";
import { UserRoles } from "@/types/UserRoles";

export const getValidationSchema = (role: UserRoles) => {
	const baseSchema = {
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		phoneNumber: Yup.string()
			.required("Phone number is required")
			.matches(/^[0-9]+$/, "Must be only digits")
			.min(10, "Must be at least 10 digits"),
	};

	if (role === "admin" || role === "client") {
		return Yup.object({
			...baseSchema,
			fullName: Yup.string().required("Full name is required"),
			...(role === "client" && {
				location: Yup.object({
					name: Yup.string().required("Location name is required"),
					zipCode: Yup.string().required(
						"Zip code is required. Choose another location"
					),
					latitude: Yup.number().nullable(),
					longitude: Yup.number().nullable(),
				}),
			}),
		});
	} else if (role === "barber") {
		return Yup.object({
			...baseSchema,
			shopName: Yup.string().required("Shop name is required"),
			location: Yup.object({
				name: Yup.string().required("Location name is required"),
				zipCode: Yup.string().required(
					"Zip code is required. Choose another location"
				),
				latitude: Yup.number().nullable(),
				longitude: Yup.number().nullable(),
			}),
		});
	}

	return Yup.object(baseSchema);
};
