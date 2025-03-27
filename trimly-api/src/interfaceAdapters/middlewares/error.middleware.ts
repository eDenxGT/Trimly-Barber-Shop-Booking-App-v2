import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode: number =
		err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
	const message = err.message || ERROR_MESSAGES.SERVER_ERROR;
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
};
