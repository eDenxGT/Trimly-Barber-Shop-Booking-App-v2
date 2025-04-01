import { inject, injectable } from "tsyringe";
import { IServiceEntity } from "../../entities/models/service.enity.js";
import { IGetAllServicesUseCase } from "../../entities/useCaseInterfaces/shop-service/get-all-services-usecase.interface.js";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface.js";

@injectable()
export class GetAllServicesUseCase implements IGetAllServicesUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository
	) {}
	async execute(
		filter: Partial<IServiceEntity>
	): Promise<IServiceEntity[] | null> {
		const services = await this._serviceRepository.find(filter);
		return services;
	}
}
