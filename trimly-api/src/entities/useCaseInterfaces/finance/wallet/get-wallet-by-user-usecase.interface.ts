import { IWalletEntity } from "../../../models/wallet.entity.js";

export interface IGetWalletByUserUseCase {
  execute(ownerId: string, role: "client" | "barber"): Promise<IWalletEntity>;
}
