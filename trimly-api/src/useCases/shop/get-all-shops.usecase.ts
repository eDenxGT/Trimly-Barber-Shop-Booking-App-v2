import { inject, injectable } from "tsyringe";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IPaginatedShops } from "../../entities/models/paginated/paginated-shops.entity.js";
import { IGetAllShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-shops-usecase.interface.js";
import { IGetAllServicesUseCase } from "../../entities/useCaseInterfaces/shop/service/get-all-services-usecase.interface.js";

@injectable()
export class GetAllShopsUseCase implements IGetAllShopsUseCase {
	constructor(
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IGetAllServicesUseCase")
		private _getAllServicesUseCase: IGetAllServicesUseCase
	) {}
	async execute(
		forType: string,
		pageNumber: number,
		pageSize: number,
		searchTerm: string
	): Promise<IPaginatedShops> {
		let filter: any = {};
		if (searchTerm) {
			filter.$or = [
				{ shopName: { $regex: searchTerm, $options: "i" } },
				{ email: { $regex: searchTerm, $options: "i" } },
			];
		}
		const validPageNumber = Math.max(1, pageNumber || 1);
		const validPageSize = Math.max(1, pageSize || 10);
		const skip = (validPageNumber - 1) * validPageSize;
		const limit = validPageSize;

		const { items, total } = await this._barberRepository.findAll(
			{
				...filter,
				status:
					forType === "pending"
						? { $eq: "pending" }
						: forType === "not-active"
						? { $eq: "not-active" }
						: forType === "not-pending"
						? { $ne: "pending" }
						: "active",
			},
			skip,
			limit
		);

		const shopsWithServices = await Promise.all(
			items.map(async (shop) => {
				const services = await this._getAllServicesUseCase.execute({
					barberId: shop.userId,
				});
				return {
					...shop,
					services: services || [],
				};
			})
		);

		const response: IPaginatedShops = {
			shops: shopsWithServices,
			total: Math.ceil(total / validPageSize),
		};

		return response;
	}
}
