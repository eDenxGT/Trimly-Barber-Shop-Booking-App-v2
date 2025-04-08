import { injectable } from "tsyringe";
import {
	BarberModel,
	IBarberModel,
} from "../../../frameworks/database/mongoDb/models/barber.model.js";
import { BaseRepository } from "../base.repository.js";
import { IBarberEntity } from "../../../entities/models/barber.entity.js";
import { IBarberRepository } from "../../../entities/repositoryInterfaces/users/barber-repository.interface.js";

@injectable()
export class BarberRepository
	extends BaseRepository<IBarberModel>
	implements IBarberRepository
{
	constructor() {
		super(BarberModel);
	}
	async findAllNearbyShopsWithFilters(
		filters: {
			search?: string;
			amenities: string[];
			location?: any;
		},
		sorting: {
			sortBy: "rating";
			sortOrder: "asc" | "desc";
		},
		pagination: {
			page: number;
			limit: number;
		}
	): Promise<IBarberEntity[]> {
		const { page, limit } = pagination;
		const { sortBy, sortOrder } = sorting;
		const skip = (page - 1) * limit;
		const pipeline: any[] = [];

		if (filters.location) {
			pipeline.push(filters.location);
		}

		if (filters.search) {
			pipeline.push({
				$match: {
					$or: [
						{
							"location.displayName": {
								$regex: filters.search,
								$options: "i",
							},
						},
						{
							"location.name": {
								$regex: filters.search,
								$options: "i",
							},
						},
						{ shopName: { $regex: filters.search, $options: "i" } },
					],
				},
			});
		}

		const validAmenities = filters.amenities.filter(Boolean);
		if (validAmenities.length > 0) {
			const amenitiesFilter: any = {};
			validAmenities.forEach((amenity) => {
				amenitiesFilter[`amenities.${amenity}`] = true;
			});
			pipeline.push({ $match: amenitiesFilter });
		}

		if (sortBy) {
			pipeline.push({
				$sort: {
					[sortBy]: sortOrder === "asc" ? 1 : -1,
				},
			});
		}

		pipeline.push({ $skip: skip }, { $limit: limit });

		const shops = await BarberModel.aggregate(pipeline);
		return shops;
	}
}
