import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";

export interface IGetBarberDashboardDataUseCase {
  execute({ userId }: { userId: string }): Promise<IBarberDashboardResponse>;
}
