import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import {
  HairstyleModel,
  IHairstyleModel,
} from "../../../frameworks/database/mongoDb/models/hairstyle.model.js";
import { IHairstyleRepository } from "../../../entities/repositoryInterfaces/hairstyle/hairstyle-repository.interface.js";
import { IHairstyleEntity } from "../../../entities/models/hairstyle.entity.js";

@injectable()
export class HairstyleRepository
  extends BaseRepository<IHairstyleModel>
  implements IHairstyleRepository
{
  constructor() {
    super(HairstyleModel);
  }

  async searchHairstylesWithPagination(params: {
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<{ hairstyles: IHairstyleEntity[]; totalPages: number }> {
    const { search = "", skip = 0, limit = 10 } = params;

    const query: any = {};

    if (search.trim()) {
      const regex = new RegExp(search, "i");

      query.$or = [
        { name: { $regex: regex } },
        { faceShapes: { $in: [regex] } },
        { hairstyleId: { $regex: regex } },
      ];
    }

    const [hairstyles, total] = await Promise.all([
      this.model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.model.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      hairstyles,
      totalPages,
    };
  }
}
