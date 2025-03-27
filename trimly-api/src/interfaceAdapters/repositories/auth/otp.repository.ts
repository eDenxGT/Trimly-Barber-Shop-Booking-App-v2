import { IOtpEntity } from "../../../entities/models/opt.entity.js";
import {
	IOtpModel,
	OtpModel,
} from "../../../frameworks/database/mongoDb/models/otp.model.js";
import { BaseRepository } from "../base.repository.js";

export class OtpRepository extends BaseRepository<IOtpModel> {
	constructor() {
		super(OtpModel);
	}
	async findLatestOtp(email: string): Promise<IOtpEntity | null> {
		return this.model.findOne({ email }).sort({ createdAt: -1 }).exec();
	}
}
