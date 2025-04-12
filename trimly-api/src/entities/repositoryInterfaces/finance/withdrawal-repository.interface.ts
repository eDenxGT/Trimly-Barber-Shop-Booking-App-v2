import { IWithdrawalEntity } from "../../models/withdrawal.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IWithdrawalRepository
  extends IBaseRepository<IWithdrawalEntity> {}
