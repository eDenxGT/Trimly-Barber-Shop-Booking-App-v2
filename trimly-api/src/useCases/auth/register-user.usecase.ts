import { inject, injectable } from "tsyringe";
import { UserDTO } from "../../shared/dtos/user.dto.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface.js";
import { IUserEntity } from "../../entities/models/user.entity.js";
import { IBarberShopRepository } from "../../entities/repositoryInterfaces/users/barber-shop-repository.interface.js";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { IClientEntity } from "../../entities/models/client.entity.js";
import { IBarberShopEntity } from "../../entities/models/barber-shop.entity.js";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt.js";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
	constructor(
		@inject("IBarberShopRepository")
		private _barberRepository: IBarberShopRepository,
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository,
		@inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
	) {}

	async execute(
		user: UserDTO
	): Promise<IBarberShopEntity | IClientEntity | null> {
		const { role, email, password } = user;

		const [existingBarber, existingClient, existingAdmin] =
			await Promise.all([
				this._barberRepository.findOne({ email }),
				this._clientRepository.findOne({ email }),
				this._adminRepository.findOne({ email }),
			]);

		if (existingBarber || existingClient || existingAdmin) {
			throw new CustomError(
				ERROR_MESSAGES.EMAIL_EXISTS,
				HTTP_STATUS.CONFLICT
			);
		}

		const hashedPassword = password
			? await this._passwordBcrypt.hash(password)
			: null;

		const userId = generateUniqueId(role);

		let repository;
		if (role === "client") {
			repository = this._clientRepository;
		} else if (role === "barberShop") {
			repository = this._barberRepository;
		} else {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		return await repository.save({
			...user,
			password: hashedPassword ?? "",
			userId,
		});
	}
}
