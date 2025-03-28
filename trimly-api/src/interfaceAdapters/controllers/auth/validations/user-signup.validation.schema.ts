import { z } from "zod";
import { strongEmailRegex } from "../../../../shared/validations/email.validation.js";
import { passwordSchema } from "../../../../shared/validations/password.validation.js";
import { nameSchema } from "../../../../shared/validations/name.validation.js";
import { phoneNumberSchema } from "../../../../shared/validations/phone.validation.js";

const adminSchema = z.object({
	email: strongEmailRegex,
	password: passwordSchema,
	role: z.literal("admin"),
});

const clientSchema = z.object({
	fullName: nameSchema,
	email: strongEmailRegex,
	phoneNumber: phoneNumberSchema,
	password: passwordSchema,
	role: z.literal("client"),
});

const barberSchema = z.object({
	shopName: nameSchema,
	email: strongEmailRegex,
	phoneNumber: phoneNumberSchema,
	password: passwordSchema,
	role: z.literal("barber"),
});

export const userSchemas = {
	admin: adminSchema,
	client: clientSchema,
	barber: barberSchema,
};
