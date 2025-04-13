import { FilterQuery } from "mongoose";
import { ITransactionEntity } from "../../models/transaction.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface ITransactionRepository
  extends IBaseRepository<ITransactionEntity> {
  findSorted(
    filter: FilterQuery<ITransactionEntity>,
    options: { sort?: any }
  ): Promise<ITransactionEntity[]>;
}
