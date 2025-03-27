import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation.js";
import { passwordSchema } from "../../../../shared/validations/password.validation.js";

export const loginSchema = z.object({
	email: strongEmailRegex,
	password: passwordSchema,
	role: z.enum(["admin", "client", "barberShop"]),
});
