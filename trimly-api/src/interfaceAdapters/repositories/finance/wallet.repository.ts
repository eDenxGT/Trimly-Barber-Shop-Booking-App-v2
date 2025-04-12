import { IWalletEntity } from "../../../entities/models/wallet.entity.js";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import {
  IWalletModel,
  WalletModel,
} from "../../../frameworks/database/mongoDb/models/wallet.model.js";
import { BaseRepository } from "../base.repository.js";

export class WalletRepository
  extends BaseRepository<IWalletModel>
  implements IWalletRepository
{
  constructor() {
    super(WalletModel);
  }
}
