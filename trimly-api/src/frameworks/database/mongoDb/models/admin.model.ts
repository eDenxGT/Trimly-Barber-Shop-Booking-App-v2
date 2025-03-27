import { Document, model, ObjectId } from "mongoose";
import { adminSchema } from "../schemas/admin.schema.js";
import { IAdminEntity } from "../../../../entities/models/admin.entity.js";

export interface IAdminModel extends IAdminEntity, Document {
	_id: ObjectId;
}

export const AdminModel = model<IAdminModel>("Admin", adminSchema);
