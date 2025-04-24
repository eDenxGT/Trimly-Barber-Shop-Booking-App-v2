import { inject, injectable } from "tsyringe";
import { UserDTO } from "../../shared/dtos/user.dto.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface.js";
import { IUserEntity } from "../../entities/models/user.entity.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface.js";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { IClientEntity } from "../../entities/models/client.entity.js";
import { IBarberEntity } from "../../entities/models/barber.entity.js";
import { IUserExistenceService } from "../../entities/useCaseInterfaces/services/user-existence-service.interface.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { ICreateWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface.js";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject("IBarberRepository")
    private _barberRepository: IBarberRepository,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IAdminRepository") private _adminRepository: IAdminRepository,
    @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt,
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,
    @inject("ICreateWalletUseCase")
    private _createWalletUseCase: ICreateWalletUseCase
  ) {}

  async execute(user: UserDTO): Promise<IBarberEntity | IClientEntity | null> {
    const { role, email, password } = user;

    const isEmailExisting = await this._userExistenceService.emailExists(email);
    if (isEmailExisting) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const hashedPassword = password
      ? await this._passwordBcrypt.hash(password)
      : null;

    const userId = generateUniqueId(role);

    let repository;
    if (role === "client") {
      repository = this._clientRepository;
    } else if (role === "barber") {
      repository = this._barberRepository;
    } else {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await this._createWalletUseCase.execute({
      ownerId: userId,
      ownerType: role,
    });

    return await repository.save({
      ...user,
      password: hashedPassword ?? "",
      userId,
    });
  }
}
