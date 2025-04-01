import { inject, injectable } from "tsyringe";
import { IUpdateUserStatusUseCase } from "../../entities/useCaseInterfaces/users/update-user-status-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
	constructor(
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository
	) {}
	async execute(userType: string, userId: any): Promise<void> {
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
		const user = await repo.findOne({ userId });

		if (!user) {
			throw new CustomError(
				ERROR_MESSAGES.USER_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND
			);
		}

		const newStatus = user.status === "active" ? "blocked" : "active";

		await repo.update(
			{ userId },
			{
				status: newStatus,
			}
		);
	}
}
