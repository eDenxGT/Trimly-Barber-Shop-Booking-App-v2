import { ZodError } from "zod";
import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import chalk from "chalk";
import logger from "./error.logger.js";

export const handleErrorResponse = (
	req: Request,
	res: Response,
	error: unknown
) => {
	logger.error(`[${req.method}] ${req.url} - ${(error as Error).message}`, {
		ip: req.ip,
		userAgent: req.headers["user-agent"],
		stack: (error as Error).stack,
	});

	if (error instanceof ZodError) {
		console.error(chalk.bgRedBright(error.name), ": ", error);
		const errors = error.errors.map((err) => ({
			message: err.message,
		}));

		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			success: false,
			message: ERROR_MESSAGES.VALIDATION_ERROR,
			errors,
		});
	}

	if (error instanceof CustomError) {
		console.error(chalk.bgRedBright(error.name), ": ", error);
		return res.status(error.statusCode).json({
			success: false,
			message: error.message,
		});
	}
	if (error instanceof Error) {
		console.error(chalk.bgRedBright(error.name), ": ", error);
	} else {
		console.error(chalk.bgRedBright("Unknown Error: "), error);
	}

	return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
		success: false,
		message: ERROR_MESSAGES.SERVER_ERROR,
	});
};
