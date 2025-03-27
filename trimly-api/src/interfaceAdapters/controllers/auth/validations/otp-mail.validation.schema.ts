import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation.js";

export const otpMailValidationSchema = z.object({
	email: strongEmailRegex,
	otp: z
		.string()
		.length(4, "OTP must be exactly 4 digits")
		.regex(/^\d{4}$/, "OTP must contain only numbers"),
});
