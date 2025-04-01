import { inject, injectable } from "tsyringe";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IPaginatedShops } from "../../entities/models/paginated/paginated-shops.entity.js";
import { IGetAllShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-shops-usecase.interface.js";

@injectable()
export class GetAllShopsUseCase implements IGetAllShopsUseCase {
	constructor(
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository
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
				{ firstName: { $regex: searchTerm, $options: "i" } },
				{ lastName: { $regex: searchTerm, $options: "i" } },
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
						: "active",
			},
			skip,
			limit
		);

		const response: IPaginatedShops = {
			shops: items,
			total: Math.ceil(total / validPageSize),
		};

		return response;
	}
}
