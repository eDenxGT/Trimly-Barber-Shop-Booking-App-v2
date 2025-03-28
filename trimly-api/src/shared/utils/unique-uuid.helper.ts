import { randomUUID } from "crypto";

export const generateUniqueId = (prefix: string = "user"): string => {
	return `trimly-${prefix}-${randomUUID().slice(10)}`;
};
