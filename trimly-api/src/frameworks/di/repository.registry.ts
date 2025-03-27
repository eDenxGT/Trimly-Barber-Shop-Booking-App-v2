//* ====== Module Imports ====== *//
import { container } from "tsyringe";

//* ====== Repository Imports ====== *//
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { ClientRepository } from "../../interfaceAdapters/repositories/users/client.repository.js";
import { BarberShopRepository } from "../../interfaceAdapters/repositories/users/barber-shop.repository.js";
import { IBarberShopRepository } from "../../entities/repositoryInterfaces/users/barber-shop-repository.interface.js";
import { AdminRepository } from "../../interfaceAdapters/repositories/users/admin.repository.js";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface.js";
import { IOtpRepository } from "../../entities/repositoryInterfaces/auth/otp-repository.interface.js";
import { OtpRepository } from "../../interfaceAdapters/repositories/auth/otp.repository.js";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/refresh-token-repository.interface.js";
import { RefreshTokenRepository } from "../../interfaceAdapters/repositories/auth/refresh-token.repository.js";

export class RepositoryRegistry {
	static registerRepositories(): void {
		//* ====== Register Repositories ====== *//
		container.register<IClientRepository>("IClientRepository", {
			useClass: ClientRepository,
		});

		container.register<IBarberShopRepository>("IBarberShopRepository", {
			useClass: BarberShopRepository,
		});

		container.register<IAdminRepository>("IAdminRepository", {
			useClass: AdminRepository,
		});

		container.register<IOtpRepository>("IOtpRepository", {
			useClass: OtpRepository,
		});

		container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
			useClass: RefreshTokenRepository,
		});

		// container.register<IRedisTokenRepository>("IRedisTokenRepository", {
		// 	useClass: RedisTokenRepository,
		// });

		// container.register<IBarberRepository>("IBarberRepository", {
		// 	useClass: BarberRepository,
		// });

		// container.register<IAdminRepository>("IAdminRepository", {
		// 	useClass: AdminRepository,
		// });

		// container.register<IShopRepository>("IShopRepository", {
		// 	useClass: ShopRepository,
		// });
	}
}
