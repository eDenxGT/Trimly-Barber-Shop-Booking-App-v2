import { randomUUID } from "crypto";

export const generateUniqueId = (prefix: string = "user") => {
	return `trimly-${prefix}-${randomUUID().slice(10)}`;
};
