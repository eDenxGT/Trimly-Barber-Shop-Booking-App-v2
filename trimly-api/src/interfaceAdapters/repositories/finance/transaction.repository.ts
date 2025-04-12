import {
  ITransactionModel,
  TransactionModel,
} from "../../../frameworks/database/mongoDb/models/transaction.model.js";
import { BaseRepository } from "../base.repository.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";

export class TransactionRepository
  extends BaseRepository<ITransactionModel>
  implements ITransactionRepository
{
  constructor() {
    super(TransactionModel);
  }
}
