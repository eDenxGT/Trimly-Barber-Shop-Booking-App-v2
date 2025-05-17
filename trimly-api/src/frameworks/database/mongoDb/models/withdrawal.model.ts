import { Document, model, ObjectId } from "mongoose";
import { IWithdrawalEntity } from "../../../../entities/models/withdrawal.entity.js";
import { withdrawalSchema } from "../schemas/withdrawal.schema.js";

export interface IWithdrawalModel extends IWithdrawalEntity, Document {
  _id: ObjectId;
}

export const WithdrawalModel = model<IWithdrawalModel>(
  "Withdrawal",
  withdrawalSchema
);
