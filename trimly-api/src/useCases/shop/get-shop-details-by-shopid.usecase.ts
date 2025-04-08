import { inject, injectable } from "tsyringe";
import { IGetShopDetailsByShopIdUseCase } from "../../entities/useCaseInterfaces/shop/get-shop-details-by-shopid-usecase.interface.js";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IBarberEntity } from "../../entities/models/barber.entity.js";
import { IGetAllServicesUseCase } from "../../entities/useCaseInterfaces/shop/service/get-all-services-usecase.interface.js";

@injectable()
export class GetShopDetailsByShopIdUseCase
	implements IGetShopDetailsByShopIdUseCase
{
	constructor(
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IGetAllServicesUseCase")
		private _getAllServicesUseCase: IGetAllServicesUseCase
	) {}
	async execute(
		shopId: string,
		forType: string
	): Promise<(IBarberEntity & { services: any[] }) | null> {
		const status =
			forType === "non-active"
				? "blocked"
				: forType === "pending"
				? "pending"
				: forType === "all"
				? undefined
				: "active";

		const shop = await this._barberRepository.findOne({
			userId: shopId,
			...(status ? { status } : {}),
		});

		if (!shop) return null;

		const services = await this._getAllServicesUseCase.execute({
			barberId: shop.userId,
		});

		return {
			...shop,
			services: services || [],
		};
	}
}
