import { Document, model, ObjectId } from "mongoose";
import { barberSchema } from "../schemas/barber.schema.js";
import { IBarberEntity } from "../../../../entities/models/barber.entity.js";

export interface IBarberModel extends IBarberEntity, Document {
   _id: ObjectId;
}

export const BarberModel = model<IBarberModel>("Barber", barberSchema);
