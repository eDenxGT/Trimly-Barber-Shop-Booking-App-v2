import { IBaseRepository } from "../base-repository.interface.js";
import { IPostEntity } from "../../models/post.entity.js";

export interface IPostRepository extends IBaseRepository<IPostEntity> {}
