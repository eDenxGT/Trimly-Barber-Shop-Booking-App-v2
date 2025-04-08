import { injectable } from "tsyringe";
import {
	BookingModel,
	IBookingModel,
} from "../../../frameworks/database/mongoDb/models/booking.model.js";
import { BaseRepository } from "../base.repository.js";
import { IBookingEntity } from "../../../entities/models/booking.entity.js";
import { PipelineStage } from "mongoose";

@injectable()
export class BookingRepository extends BaseRepository<IBookingModel> {
	constructor() {
		super(BookingModel);
	}
	async findBookingsWithDetailsForBarber(
		userId: string
	): Promise<IBookingEntity[]> {
		const pipeline = [
			{
				$match: { shopId: userId },
			},
			{
				$lookup: {
					from: "services",
					localField: "services",
					foreignField: "serviceId",
					as: "servicesDetails",
				},
			},
			{
				$lookup: {
					from: "clients",
					localField: "clientId",
					foreignField: "userId",
					as: "clientDetails",
				},
			},
			{
				$unwind: {
					path: "$clientDetails",
					preserveNullAndEmptyArrays: true,
				},
			},
		];

		return BookingModel.aggregate(pipeline).exec();
	}

	async findBookingsWithDetailsForClient(
		userId: string
	): Promise<IBookingEntity[]> {
		const pipeline: PipelineStage[] = [
			{
				$match: { clientId: userId },
			},
			{
				$lookup: {
					from: "services",
					localField: "services",
					foreignField: "serviceId",
					as: "servicesDetails",
				},
			},
			{
				$lookup: {
					from: "barbers",
					localField: "shopId",
					foreignField: "userId",
					as: "shopDetails",
				},
			},
			{
				$unwind: {
					path: "$shopDetails",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$sort: {
					// date: -1,
					// startTime: -1,
					createdAt: -1,
				},
			},
			{
				$project: {
					_id: 0,
					bookingId: 1,
					date: 1,
					startTime: 1,
					status: 1,
					total: 1,
					servicesDetails: {
						$map: {
							input: "$servicesDetails",
							as: "service",
							in: {
								name: "$$service.name",
								price: "$$service.price",
							},
						},
					},
					shopDetails: {
						shopName: "$shopDetails.shopName",
						avatar: "$shopDetails.avatar",
						location: "$shopDetails.location",
					},
				},
			},
		];

		return BookingModel.aggregate(pipeline).exec();
	}
}
