import { TRole } from "../../../../shared/constants.js";
import { IWalletOverviewDTO } from "../../../../shared/dtos/user.dto.js";


export interface IGetWalletOverviewUseCase {
  execute(userId: string, role: TRole): Promise<IWalletOverviewDTO | null>;
}
