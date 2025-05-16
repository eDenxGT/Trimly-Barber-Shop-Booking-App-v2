import { inject, injectable } from "tsyringe";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface.js";
import { IGetAllServicesUseCase } from "../../entities/useCaseInterfaces/shop/service/get-all-services-usecase.interface.js";
import { IGetAllNearestShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-nearest-shops-usecase.interface.js";
import { IBarberEntity } from "../../entities/models/barber.entity.js";

@injectable()
export class GetAllNearestShopsUseCase implements IGetAllNearestShopsUseCase {
	constructor(
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IGetAllServicesUseCase")
		private _getAllServicesUseCase: IGetAllServicesUseCase
	) {}
	async execute(
		search?: string,
		amenities?: string,
		userLocation?: number[],
		sortBy?: "rating",
		sortOrder?: "asc" | "desc",
		page?: number,
		limit?: number
	): Promise<IBarberEntity[] | null> {
		const amenitiesArray = amenities?.split(",") || [];

		const filters: {
			search?: string;
			amenities: string[];
			location?: Object;
		} = {
			search,
			amenities: amenitiesArray,
		};
		if (userLocation && userLocation.length === 2) {
			filters.location = {
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [userLocation?.[0], userLocation?.[1]],
					},
					distanceField: "distance",
					// maxDistance: 50000, // 50km (in meters)
					spherical: true,
				},
			};
		}
		const pagination = {
			page: page || 1,
			limit: limit || 9,
		};
		const sort = {
			sortBy: sortBy === "rating" ? "averageRating" : "",
			sortOrder: sortOrder || "asc",
		};
		const shops =
			await this._barberRepository.findAllNearbyShopsWithFilters(
				filters,
				sort,
				pagination
			);
		if (!shops) return null;
		return shops;
	}
}
