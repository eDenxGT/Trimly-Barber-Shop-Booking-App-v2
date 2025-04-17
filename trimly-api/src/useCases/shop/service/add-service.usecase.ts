import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface.js";
import { IServiceEntity } from "../../../entities/models/service.enity.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
import { IAddServiceUseCase } from "../../../entities/useCaseInterfaces/shop/service/add-service-usecase.interface.js";

@injectable()
export class AddServiceUseCase implements IAddServiceUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository
	) {}
	async execute(data: Partial<IServiceEntity>): Promise<void> {
		const isServiceExisting = await this._serviceRepository.findOne({
			barberId: data.barberId,
			name: { $regex: `^${data.name?.trim()}$`, $options: "i" }, 
		});
		
		if (isServiceExisting) {
			throw new CustomError(
				ERROR_MESSAGES.SERVICE_EXISTS,
				HTTP_STATUS.CONFLICT
			);
		}

		const serviceId = generateUniqueId("service");

		await this._serviceRepository.save({ ...data, serviceId });
	}
}
