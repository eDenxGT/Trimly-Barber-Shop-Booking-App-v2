import { IHairstyleEntity } from "../../models/hairstyle.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IHairstyleRepository
  extends IBaseRepository<IHairstyleEntity> {
  searchHairstylesWithPagination(params: {
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ hairstyles: IHairstyleEntity[]; totalPages: number }>;
}
