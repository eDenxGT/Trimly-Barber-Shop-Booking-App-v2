import { injectable } from "tsyringe";
import { BaseRepository } from "../base.repository.js";
import { IWithdrawalRepository } from "../../../entities/repositoryInterfaces/finance/withdrawal-repository.interface.js";
import {
	IWithdrawalModel,
	WithdrawalModel,
} from "../../../frameworks/database/mongoDb/models/withdrawal.model.js";

@injectable()
export class WithdrawalRepository
	extends BaseRepository<IWithdrawalModel>
	implements IWithdrawalRepository
{
	constructor() {
		super(WithdrawalModel);
	}

	async findUserWithdrawals(
		filters: {
			status?: string;
			method?: string;
			search?: string;
		},
		pagination: {
			offset: number;
			limit: number;
		},
		sort: {
			field: string;
			direction: "asc" | "desc";
		}
	): Promise<{ withdrawals: any[]; total: number }> {
		const matchStage: any = {};

		if (filters.status && filters.status !== "all") {
			matchStage.status = filters.status;
		}

		if (filters.method && filters.method !== "all") {
			matchStage.method = filters.method;
		}

		const aggregationPipeline: any[] = [
			{ $match: matchStage },
			{
				$lookup: {
					from: "clients",
					let: { userId: "$userId" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
						{ $project: { fullName: 1, avatar: 1, _id: 0 } },
					],
					as: "clientDetails",
				},
			},
			{
				$lookup: {
					from: "barbers",
					let: { userId: "$userId" },
					pipeline: [
						{ $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
						{ $project: { shopName: 1, avatar: 1, _id: 0 } },
					],
					as: "barberDetails",
				},
			},
			{
				$addFields: {
					userDetails: {
						$cond: {
							if: { $gt: [{ $size: "$clientDetails" }, 0] },
							then: {
								$mergeObjects: [
									{ $arrayElemAt: ["$clientDetails", 0] },
								],
							},
							else: {
								$mergeObjects: [
									{
										fullName: {
											$arrayElemAt: [
												"$barberDetails.shopName",
												0,
											],
										},
										avatar: {
											$arrayElemAt: [
												"$barberDetails.avatar",
												0,
											],
										},
									},
								],
							},
						},
					},
				},
			},
			{
				$project: {
					clientDetails: 0,
					barberDetails: 0,
				},
			},
			...(filters.search
				? [
						{
							$match: {
								$or: [
									{
										withdrawalId: {
											$regex: filters.search,
											$options: "i",
										},
									},
									{
										referenceId: {
											$regex: filters.search,
											$options: "i",
										},
									},
									{
										"userDetails.fullName": {
											$regex: filters.search,
											$options: "i",
										},
									},
								],
							},
						},
				  ]
				: []),
			{
				$facet: {
					data: [
						{
							$sort: {
								[sort.field]: sort.direction === "asc" ? 1 : -1,
							},
						},
						{ $skip: pagination.offset },
						{ $limit: pagination.limit },
					],
					totalCount: [{ $count: "count" }],
				},
			},
			{
				$unwind: {
					path: "$totalCount",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					data: 1,
					total: "$totalCount.count",
				},
			},
		];

		const result = await WithdrawalModel.aggregate(aggregationPipeline);
		const finalResult = result[0] || { data: [], total: 0 };

		return {
			withdrawals: finalResult.data,
			total: finalResult.total || 0,
		};
	}
}
