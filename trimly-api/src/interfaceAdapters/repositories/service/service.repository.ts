import { injectable } from "tsyringe";
import {
  IServiceModel,
  ServiceModel,
} from "../../../frameworks/database/mongoDb/models/service.model.js";
import { BaseRepository } from "../base.repository.js";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface.js";

@injectable()
export class ServiceRepository
  extends BaseRepository<IServiceModel>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel);
  }
}
