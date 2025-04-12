import { ITransactionEntity } from "../../models/transaction.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface ITransactionRepository
  extends IBaseRepository<ITransactionEntity> {}
