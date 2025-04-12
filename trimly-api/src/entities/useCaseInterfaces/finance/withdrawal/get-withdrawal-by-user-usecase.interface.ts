import { IWithdrawalEntity } from "../../../models/withdrawal.entity.js";

export interface IGetWithdrawalByUserUseCase {
  execute(userId: string): Promise<IWithdrawalEntity[] | null>;
}
