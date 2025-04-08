import { IBarberEntity } from "../../models/barber.entity.js";

export interface IGetAllNearestShopsUseCase {
	execute(
		search?: string,
		amenities?: string,
		userLocation?: number[],
		sortBy?: "rating",
		sortOrder?: "asc" | "desc",
		page?: number,
		limit?: number
	): Promise<IBarberEntity[] | null>;
}
