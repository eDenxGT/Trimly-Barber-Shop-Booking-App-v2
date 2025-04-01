import { inject, injectable } from "tsyringe";
import { IGetAllUsersUseCase } from "../../entities/useCaseInterfaces/users/get-all-users-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IPaginatedUsers } from "../../entities/models/paginated/paginated-users.entity.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository
	) {}
	async execute(
		userType: string,
		pageNumber: number,
		pageSize: number,
		searchTerm: string
	): Promise<IPaginatedUsers> {
		let filter: any = {};
		if (userType) {
			filter.role = userType;
		}

		if (searchTerm) {
			filter.$or = [
				{ firstName: { $regex: searchTerm, $options: "i" } },
				{ lastName: { $regex: searchTerm, $options: "i" } },
				{ email: { $regex: searchTerm, $options: "i" } },
			];
		}
		const validPageNumber = Math.max(1, pageNumber || 1);
		const validPageSize = Math.max(1, pageSize || 10);
		const skip = (validPageNumber - 1) * validPageSize;
		const limit = validPageSize;
		let repo;
		if (userType === "client") {
			repo = this._clientRepository;
		} else if (userType === "barber") {
			repo = this._barberRepository;
		} else {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const { items, total } = await repo.findAll(filter, skip, limit);

		const response: IPaginatedUsers = {
			users: items,
			total: Math.ceil(total / validPageSize),
		};

		return response;
	}
}
