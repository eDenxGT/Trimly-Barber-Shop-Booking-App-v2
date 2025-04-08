import { IBarberEntity } from "../../models/barber.entity.js";
import { IBaseRepository } from "../base-repository.interface.js";

export interface IBarberRepository extends IBaseRepository<IBarberEntity> {
	findAllNearbyShopsWithFilters(
		filters: {
			search?: string;
			amenities: string[];
		},
		sorting: {
			sortBy: "rating";
			sortOrder: "asc" | "desc";
		},
		pagination: {
			page: number;
			limit: number;
		},
		// userLocation: number[] // [longitude, latitude]
	): Promise<IBarberEntity[]>;
}
