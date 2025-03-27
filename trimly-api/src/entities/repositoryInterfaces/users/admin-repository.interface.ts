import { IAdminEntity } from "../../models/admin.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IAdminRepository extends IBaseRepository<IAdminEntity> {}
