import { model, ObjectId } from "mongoose";
import { IHairstyleEntity } from "../../../../entities/models/hairstyle.entity.js";
import { hairstyleSchema } from "../schemas/hairstyle.schema.js";

export interface IHairstyleModel extends IHairstyleEntity, Document {
  _id: ObjectId;
}

export const HairstyleModel = model<IHairstyleModel>(
  "Hairstyle",
  hairstyleSchema
);
