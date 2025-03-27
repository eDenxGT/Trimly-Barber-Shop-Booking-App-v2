import { IOtpModel, OtpModel } from "../../../frameworks/database/mongoDb/models/otp.model.js";
import { BaseRepository } from "../base.repository.js";

export class OtpRepository extends BaseRepository<IOtpModel> {
   constructor() {
       super(OtpModel); 
   }
}
