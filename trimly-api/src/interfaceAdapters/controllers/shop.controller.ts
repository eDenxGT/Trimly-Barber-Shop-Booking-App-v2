import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IShopController } from "../../entities/controllerInterfaces/shop/shop-controller.interface.js";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	SUCCESS_MESSAGES,
} from "../../shared/constants.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IGetAllShopsUseCase } from "../../entities/useCaseInterfaces/shop/get-all-shops-usecase.interface.js";
import { IUpdateShopStatusUseCase } from "../../entities/useCaseInterfaces/shop/update-shop-status-usecase.interface.js";

@injectable()
export class ShopController implements IShopController {
	constructor(
		@inject("IGetAllShopsUseCase")
		private _getAllShopsUseCase: IGetAllShopsUseCase,
		@inject("IUpdateShopStatusUseCase")
		private _updateShopStatusUseCase: IUpdateShopStatusUseCase
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*                     🛠️ Get All Shops
	//* ─────────────────────────────────────────────────────────────
	async getAllShops(req: Request, res: Response): Promise<void> {
		try {
			const { page = 1, limit = 10, search = "", forType } = req.query;
			const pageNumber = Number(page);
			const pageSize = Number(limit);
			const forTypeString =
				typeof forType === "string" ? forType : "non-active";
			const searchTermString = typeof search === "string" ? search : "";

			const { shops, total } = await this._getAllShopsUseCase.execute(
				forTypeString,
				pageNumber,
				pageSize,
				searchTermString
			);
			console.log(shops, total);
			res.status(HTTP_STATUS.OK).json({
				success: true,
				shops,
				totalPages: total,
				currentPage: pageNumber,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}

	//* ─────────────────────────────────────────────────────────────
	//*                   🛠️ Update Shop Status
	//* ─────────────────────────────────────────────────────────────
	async updateShopStatus(req: Request, res: Response): Promise<void> {
		try {
			const { shopId } = req.params;
			const { status, message } = req.body;
			if (!shopId || !status) {
				res.status(HTTP_STATUS.BAD_REQUEST).json({
					message: ERROR_MESSAGES.MISSING_PARAMETERS,
					success: false,
				});
				return;
			}
			const barberShop = await this._updateShopStatusUseCase.execute(
				shopId,
				status,
				message || ""
			);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
			});
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	}
}
