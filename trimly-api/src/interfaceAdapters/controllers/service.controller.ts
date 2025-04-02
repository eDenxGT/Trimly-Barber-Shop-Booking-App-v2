import { inject, injectable } from "tsyringe";
import { IServiceController } from "../../entities/controllerInterfaces/service/service-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { Request, Response } from "express";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	SUCCESS_MESSAGES,
} from "../../shared/constants.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IAddServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/add-service-usecase.interface.js";
import { IGetAllServicesUseCase } from "../../entities/useCaseInterfaces/shop/service/get-all-services-usecase.interface.js";
import { IUpdateServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/update-service-usecase.interface.js";
import { IDeleteServiceUseCase } from "../../entities/useCaseInterfaces/shop/service/delete-service-usecase.interface.js";
import { IServiceEntity } from "../../entities/models/service.enity.js";

@injectable()
export class ServiceController implements IServiceController {
	constructor(
		@inject("IAddServiceUseCase")
		private _addServiceUseCase: IAddServiceUseCase,
		@inject("IGetAllServicesUseCase")
		private _getAllServicesUseCase: IGetAllServicesUseCase,
		@inject("IUpdateServiceUseCase")
		private _updateServiceUseCase: IUpdateServiceUseCase,
		@inject("IDeleteServiceUseCase")
		private _deleteServiceUseCase: IDeleteServiceUseCase
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ Add Service
	//* ─────────────────────────────────────────────────────────────
	async addService(req: Request, res: Response): Promise<void> {
		try {
			const data = req.body;
			const { userId, role } = (req as CustomRequest).user;
			if (!userId || role !== "barber") {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}

			await this._addServiceUseCase.execute({
				...data,
				barberId: userId,
			});

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.ADDED,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                    🛠️ Get All Services
	//* ─────────────────────────────────────────────────────────────
	async getAllServicesByBarberId(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = (req as CustomRequest).user;
			if (!userId) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}
			const services = await this._getAllServicesUseCase.execute({
				barberId: userId,
			});
			res.status(HTTP_STATUS.OK).json({
				success: true,
				services,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ Update Service
	//* ─────────────────────────────────────────────────────────────
	async updateServiceById(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = (req as CustomRequest).user;
			const data: Partial<IServiceEntity> = req.body;
			if (!userId) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}
			await this._updateServiceUseCase.execute(
				{
					barberId: userId,
					serviceId: data.serviceId,
				},
				data
			);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ Delete Service
	//* ─────────────────────────────────────────────────────────────
	async deleteServiceById(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = (req as CustomRequest).user;
			const { serviceId } = req.params;
			if (!userId || !serviceId) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
				});
				return;
			}
			await this._deleteServiceUseCase.execute(serviceId, userId);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.DELETE_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}
}
