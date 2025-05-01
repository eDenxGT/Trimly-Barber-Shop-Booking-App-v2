import { IAdminDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";
import { IClientEntity } from "../../models/client.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IClientRepository extends IBaseRepository<IClientEntity> {
	updateWallet(userId: string, amount: number): Promise<void>;
	getRecentClients(): Promise<IAdminDashboardResponse["recentClients"]>
}
