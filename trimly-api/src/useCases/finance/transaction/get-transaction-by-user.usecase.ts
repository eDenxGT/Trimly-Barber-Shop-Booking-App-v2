import { inject, injectable } from "tsyringe";
import { IGetTransactionByUserUseCase } from "../../../entities/useCaseInterfaces/finance/transaction/get-transaction-by-user-usecase.interface.js";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { ITransactionEntity } from "../../../entities/models/transaction.entity.js";

@injectable()
export class GetTransactionByUserUseCase
  implements IGetTransactionByUserUseCase
{
  constructor(
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository
  ) {}

  async execute(userId: string): Promise<ITransactionEntity[] | null> {
    return this._transactionRepository.findSorted(
      { userId },
      { sort: { createdAt: -1 } }
    ); 
  }
}
