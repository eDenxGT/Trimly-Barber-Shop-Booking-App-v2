import { z } from "zod";

export const phoneNumberSchema = z
	.string()
	.length(10, { message: "Phone number must be exactly 10 digits" })
	.regex(/^\d{10}$/, { message: "Phone number must contain only digits" });
