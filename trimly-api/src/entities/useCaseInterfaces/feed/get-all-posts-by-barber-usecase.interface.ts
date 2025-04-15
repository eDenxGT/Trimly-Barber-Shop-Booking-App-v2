import { IPostEntity } from "../../models/post.entity.js";

export interface IGetAllPostsByBarberUseCase {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ items: IPostEntity[]; total: number }>;
}
