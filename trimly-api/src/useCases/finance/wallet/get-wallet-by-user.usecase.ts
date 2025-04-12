import { IWalletEntity } from "../../../entities/models/wallet.entity.js";
import { TRole } from "../../../shared/constants.js";
import { IGetWalletByUserUseCase } from "../../../entities/useCaseInterfaces/finance/wallet/get-wallet-by-user-usecase.interface.js";
import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";

@injectable()
export class GetWalletByUserUseCase implements IGetWalletByUserUseCase {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository
  ) {}
  async execute(userId: string, role: TRole): Promise<IWalletEntity | null> {
    return this._walletRepository.findOne({ ownerId: userId, ownerType: role });
  }
}
