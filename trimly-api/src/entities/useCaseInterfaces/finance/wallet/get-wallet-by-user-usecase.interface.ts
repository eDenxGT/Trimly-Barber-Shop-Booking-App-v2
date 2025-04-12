import { TRole } from "../../../../shared/constants.js";
import { IWalletEntity } from "../../../models/wallet.entity.js";

export interface IGetWalletByUserUseCase {
  execute(userId: string, role: TRole): Promise<IWalletEntity | null>;
}
