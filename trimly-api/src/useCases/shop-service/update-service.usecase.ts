import { inject, injectable } from "tsyringe";
import { IServiceEntity } from "../../entities/models/service.enity.js";
import { IUpdateServiceUseCase } from "../../entities/useCaseInterfaces/shop-service/update-service-usecase.interface.js";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface.js";

@injectable()
export class UpdateServiceUseCase implements IUpdateServiceUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository
	) {}
	async execute(
		filter: Partial<IServiceEntity>,
		data: Partial<IServiceEntity>
	): Promise<IServiceEntity | null> {
		const service = await this._serviceRepository.update(filter, data);
		return service;
	}
}
