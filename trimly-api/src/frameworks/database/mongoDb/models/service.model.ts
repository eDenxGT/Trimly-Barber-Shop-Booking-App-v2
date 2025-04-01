import { Document, model, ObjectId } from "mongoose";
import { IServiceEntity } from "../../../../entities/models/service.enity.js";
import { serviceSchema } from "../schemas/service.schema.js";

export interface IServiceModel extends IServiceEntity, Document {
	_id: ObjectId;
}

export const ServiceModel = model<IServiceModel>("Service", serviceSchema);
