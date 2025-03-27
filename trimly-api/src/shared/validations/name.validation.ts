import { z } from "zod";

export const nameSchema = z
	.string()
	.min(1, { message: "Name must be at least 2 characters long" })
	.regex(/^[a-zA-Z]+$/, {
		message: "Name must contain only alphabetic characters",
	});
