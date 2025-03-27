import { z } from "zod";

export const nameSchema = z
	.string()
	.min(2, { message: "Name must be at least 2 characters long" })
	.regex(/^[a-zA-Z\s]+$/, {
		message: "Name must contain only alphabetic characters and spaces",
	});