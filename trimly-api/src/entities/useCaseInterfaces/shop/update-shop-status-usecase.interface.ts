import { statusTypes } from "../../../shared/constants.js";

export interface IUpdateShopStatusUseCase {
	execute(id: string, status: statusTypes, message?: string): Promise<void>;
}
