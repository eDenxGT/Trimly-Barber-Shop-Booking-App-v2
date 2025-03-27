import { z } from "zod";

export const passwordSchema = z
	.string()
	.min(8, { message: "Password must be at least 8 characters long" })
	.regex(/[A-Z]/, {
		message: "Password must contain at least one uppercase letter",
	})
	.regex(/[0-9]/, { message: "Password must contain at least one digit" })
	.regex(/[@$!%*?&]/, {
		message: "Password must contain at least one special character",
	});
