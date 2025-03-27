import { Document, model, ObjectId } from "mongoose";
import { barberShopSchema } from "../schemas/barber-shop.schema.js";
import { IBarberShopEntity } from "../../../../entities/models/barber-shop.entity.js";

export interface IBarberShopModel extends IBarberShopEntity, Document {
   _id: ObjectId;
}

export const BarberShopModel = model<IBarberShopModel>("BarberShop", barberShopSchema);
