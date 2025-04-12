import { ITransactionEntity } from "../../../models/transaction.entity.js";

export interface IGetTransactionByUserUseCase {
  execute(userId: string): Promise<ITransactionEntity[] | null>;
}
