import { IRefreshTokenEntity } from "../../models/refresh-token.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IRefreshTokenRepository
	extends IBaseRepository<IRefreshTokenEntity> {
	revokeRefreshToken(token: string): Promise<void>;
}
