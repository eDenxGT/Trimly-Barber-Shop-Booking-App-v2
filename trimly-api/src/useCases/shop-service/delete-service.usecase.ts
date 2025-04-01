import { inject, injectable } from "tsyringe";
import { IDeleteServiceUseCase } from "../../entities/useCaseInterfaces/shop-service/delete-service-usecase.interface.js";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface.js";

@injectable()
export class DeleteServiceUseCase implements IDeleteServiceUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository
	) {}
	async execute(serviceId: string, barberId: string): Promise<void> {
		await this._serviceRepository.delete({ serviceId, barberId });
	}
}
