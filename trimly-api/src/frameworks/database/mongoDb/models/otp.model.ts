import { model, ObjectId } from "mongoose";
import { otpSchema } from "../schemas/otp.schema.js";
import { IOtpEntity } from "../../../../entities/models/opt.entity.js";

export interface IOtpModel extends IOtpEntity, Document {
	_id: ObjectId;
}

export const OtpModel = model<IOtpModel>("Otp", otpSchema);