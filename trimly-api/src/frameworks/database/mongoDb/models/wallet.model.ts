import { Document, model, ObjectId } from "mongoose";
import { walletSchema } from "../schemas/wallet.schema.js";
import { IWalletEntity } from "../../../../entities/models/wallet.entity.js";

export interface IWalletModel extends IWalletEntity, Document {
   _id: ObjectId;
}

export const WalletModel = model<IWalletModel>("Wallet", walletSchema);
