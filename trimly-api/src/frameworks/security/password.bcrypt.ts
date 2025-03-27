import { injectable } from "tsyringe";
import { IBcrypt } from "./bcrypt.interface.js";
import bcrypt from "bcryptjs";
import { config } from "../../shared/config.js";

@injectable()
export class PasswordBcrypt implements IBcrypt {
	async hash(original: string) {
		return bcrypt.hash(original, config.bcryptSaltRounds);
	}
	async compare(current: string, original: string) {
		return bcrypt.compare(current, original);
	}
}
