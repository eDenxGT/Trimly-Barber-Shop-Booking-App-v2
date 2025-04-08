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
		private _barberRepository: IBarberRepository
	) {}
	async execute(
		shopId: string,
		forType: string
	): Promise<IBarberEntity | null> {
		const status =
			forType === "non-active"
				? "blocked"
				: forType === "pending"
				? "pending"
				: forType === "all"
				? undefined
				: "active";

		const shop = await this._barberRepository.getBarberShopWithAllDetails({
			userId: shopId,
			...(status ? { status } : {}),
		});

		if (!shop) return null;

		return shop;
	}
}
