import { IWalletEntity } from "../../models/wallet.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IWalletRepository extends IBaseRepository<IWalletEntity> {}
