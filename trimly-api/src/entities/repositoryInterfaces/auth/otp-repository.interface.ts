import { IOtpEntity } from "../../models/opt.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IOtpRepository extends IBaseRepository<IOtpEntity> {
	findLatestOtp(email: string): Promise<IOtpEntity | null>;
}
