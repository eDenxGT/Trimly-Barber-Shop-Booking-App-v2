import { IPaginatedShops } from "../../models/paginated/paginated-shops.entity.js";

export interface IGetAllShopsUseCase {
	execute(
		forType: string,
		pageNumber: number,
		pageSize: number,
		searchTerm: string
	): Promise<IPaginatedShops>;
}
