import { Document, model, ObjectId } from "mongoose";
import { clientSchema } from "../schemas/client.schema.js";
import { IClientEntity } from "../../../../entities/models/client.entity.js";

export interface IClientModel extends IClientEntity, Document {
   _id: ObjectId;
}

export const ClientModel = model<IClientModel>("Client", clientSchema);
