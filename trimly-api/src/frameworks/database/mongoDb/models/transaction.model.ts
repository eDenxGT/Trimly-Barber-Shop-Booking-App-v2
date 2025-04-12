import { model, ObjectId } from "mongoose";
import { ITransactionEntity } from "../../../../entities/models/transaction.entity.js";
import { transactionSchema } from "../schemas/transaction.schema.js";

export interface ITransactionModel extends ITransactionEntity, Document {
  _id: ObjectId;
}

export const TransactionModel = model<ITransactionModel>(
  "Transaction",
  transactionSchema
);
