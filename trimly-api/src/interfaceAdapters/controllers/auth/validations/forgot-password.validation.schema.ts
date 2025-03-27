import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation.js";
import { ERROR_MESSAGES } from "../../../../shared/constants.js";

export const forgotPasswordValidationSchema = z.object({
	email: strongEmailRegex,
	role: z.enum(["client", "admin", "barberShop"], {
		message: ERROR_MESSAGES.INVALID_ROLE,
	}),
});
