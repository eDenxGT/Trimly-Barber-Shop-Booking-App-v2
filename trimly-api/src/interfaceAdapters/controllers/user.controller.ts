import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { IUserController } from "../../entities/controllerInterfaces/users/user-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import {
	ERROR_MESSAGES,
	HTTP_STATUS,
	SUCCESS_MESSAGES,
} from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import { IUpdateUserDetailsUseCase } from "../../entities/useCaseInterfaces/users/update-user-details-usecase.interface.js";

@injectable()
export class UserController implements IUserController {
	constructor(
		// @inject("IGetAllUsersUseCase")
		// private _getAllUsersUseCase: IGetAllUsersUseCase,
		// @inject("IUpdateUserStatusUseCase")
		// private _updateUserStatusUseCase: IUpdateUserStatusUseCase,
		// @inject("IChangeUserPasswordUseCase")
		// private _changePasswordUseCase: IChangeUserPasswordUseCase,
		@inject("IUpdateUserDetailsUseCase")
		private _updateUserDetailsUseCase: IUpdateUserDetailsUseCase
	) {}

	//* ─────────────────────────────────────────────────────────────
	//*               🛠️ Get All Users (Role Based)
	//* ─────────────────────────────────────────────────────────────
	// async getAllUsers(req: Request, res: Response): Promise<void> {
	// 	try {
	// 		const { page = 1, limit = 10, search = "", userType } = req.query;
	// 		const pageNumber = Number(page);
	// 		const pageSize = Number(limit);
	// 		const userTypeString =
	// 			typeof userType === "string" ? userType : "client";
	// 		const searchTermString = typeof search === "string" ? search : "";

	// 		const { user, total } = await this._getAllUsersUseCase.execute(
	// 			userTypeString,
	// 			pageNumber,
	// 			pageSize,
	// 			searchTermString
	// 		);

	// 		res.status(HTTP_STATUS.OK).json({
	// 			success: true,
	// 			users: user,
	// 			totalPages: total,
	// 			currentPage: pageNumber,
	// 		});
	// 	} catch (error) {
	// 		handleErrorResponse(res, error);
	// 	}
	// }

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ Update User Status
	//* ─────────────────────────────────────────────────────────────
	// async updateUserStatus(req: Request, res: Response): Promise<void> {
	// 	try {
	// 		const { userType, userId } = req.query as {
	// 			userType: string;
	// 			userId: any;
	// 		};

	// 		await this._updateUserStatusUseCase.execute(userType, userId);

	// 		res.status(HTTP_STATUS.OK).json({
	// 			success: true,
	// 			message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
	// 		});
	// 	} catch (error) {
	// 		handleErrorResponse(res, error);
	// 	}
	// }

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ Change User Password
	//* ─────────────────────────────────────────────────────────────
	// async changeUserPassword(req: Request, res: Response): Promise<void> {
	// 	try {
	// 		const { oldPassword, newPassword } = req.body;
	// 		const { email, role } = (req as CustomRequest).user;

	// 		await this._changePasswordUseCase.execute({
	// 			oldPassword,
	// 			newPassword,
	// 			email,
	// 			role,
	// 		});
	// 		res.status(HTTP_STATUS.OK).json({
	// 			success: true,
	// 			message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
	// 		});
	// 	} catch (error) {
	// 		handleErrorResponse(res, error);
	// 	}
	// }

	//* ─────────────────────────────────────────────────────────────
	//*                  🛠️ Update User Details
	//* ─────────────────────────────────────────────────────────────
	async updateUserDetails(req: Request, res: Response): Promise<void> {
		try {
			const data = req.body;
			const { userId, role } = (req as CustomRequest).user;
			const updatedUser = await this._updateUserDetailsUseCase.execute(
				userId,
				role,
				data
			);
			if (!updatedUser) {
				throw new CustomError(
					ERROR_MESSAGES.USER_NOT_FOUND,
					HTTP_STATUS.NOT_FOUND
				);
			}
			const { password, ...userWithoutPassword } = updatedUser;
			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
				user: userWithoutPassword,
			});
		} catch (error) {
			handleErrorResponse(res, error);
		}
	}
}
