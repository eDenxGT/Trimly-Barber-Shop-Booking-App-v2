import {
	IRefreshTokenModel,
	RefreshTokenModel,
} from "../../../frameworks/database/mongoDb/models/refresh-token.model.js";
import { BaseRepository } from "../base.repository.js";

export class RefreshTokenRepository extends BaseRepository<IRefreshTokenModel> {
	constructor() {
		super(RefreshTokenModel);
	}
	async revokeRefreshToken(token: string): Promise<void> {
		await RefreshTokenModel.deleteOne({ token });
	}
}
