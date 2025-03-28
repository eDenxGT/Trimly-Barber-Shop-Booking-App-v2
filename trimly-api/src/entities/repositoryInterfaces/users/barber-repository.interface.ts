import { IBarberEntity } from "../../models/barber.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IBarberRepository extends IBaseRepository<IBarberEntity> {}
