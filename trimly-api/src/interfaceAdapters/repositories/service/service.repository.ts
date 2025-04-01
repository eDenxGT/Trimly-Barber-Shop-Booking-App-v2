import { injectable } from "tsyringe";
import {
	IServiceModel,
	ServiceModel,
} from "../../../frameworks/database/mongoDb/models/service.model.js";
import { BaseRepository } from "../base.repository.js";

@injectable()
export class ServiceRepository extends BaseRepository<IServiceModel> {
	constructor() {
		super(ServiceModel);
	}
}
