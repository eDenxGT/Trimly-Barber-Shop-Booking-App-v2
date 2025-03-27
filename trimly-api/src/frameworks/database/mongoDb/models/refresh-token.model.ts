import { model, ObjectId } from "mongoose";
import { refreshTokenSchema } from "../schemas/refresh-token.schema.js";
import { IRefreshTokenEntity } from "../../../../entities/models/refresh-token.entity.js";
export interface IRefreshTokenModel extends IRefreshTokenEntity, Document {
	_id: ObjectId;
}

export const RefreshTokenModel = model<IRefreshTokenModel>(
	"RefreshToken",
	refreshTokenSchema
);
