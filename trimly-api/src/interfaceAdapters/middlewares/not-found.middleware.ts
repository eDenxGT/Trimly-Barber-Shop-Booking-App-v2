import { Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";

export const notFound = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: ERROR_MESSAGES.ROUTE_NOT_FOUND,
  });
};
