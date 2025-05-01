import { IAdminDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";

export interface IGetAdminDashboardDataUseCase {
  execute(): Promise<IAdminDashboardResponse>;
}
