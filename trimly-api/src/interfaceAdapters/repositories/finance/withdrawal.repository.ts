import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface.js";
import {
  IWithdrawalModel,
  WithdrawalModel,
} from "../../../frameworks/database/mongoDb/models/withdrawal.model.js";

@injectable()
export class WithdrawalRepository
  extends BaseRepository<IWithdrawalModel>
  implements IWithdrawalRepository
{
  constructor() {
    super(WithdrawalModel);
  }
}
