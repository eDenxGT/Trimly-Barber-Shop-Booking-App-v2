import { IWalletOverviewDTO } from "../../../../shared/dtos/user.dto.js";


export interface IGetWalletOverviewUseCase {
  execute(userId: string, role: "client" | "barber"): Promise<IWalletOverviewDTO | null>;
}
