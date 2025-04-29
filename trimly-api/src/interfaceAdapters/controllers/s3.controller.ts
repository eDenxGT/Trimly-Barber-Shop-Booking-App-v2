import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IS3Controller } from "../../entities/controllerInterfaces/s3/s3-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IGeneratePresignedUrlUseCase } from "../../entities/useCaseInterfaces/s3/generate-presigned-url-usecase.interface.js";

@injectable()
export class S3Controller implements IS3Controller {
  constructor(
    @inject("IGeneratePresignedUrlUseCase")
    private _generatePresignedUrlUseCase: IGeneratePresignedUrlUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                   🛠️ Generate Presigned URL
  //* ─────────────────────────────────────────────────────────────
  async generatePresignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { path, operation } = req.query;

      if (
        typeof path !== "string" ||
        (operation !== "putObject" && operation !== "getObject")
      ) {
        res.status(400).json({ message: "Invalid parameters" });
        return;
      }

      const presignedUrl = await this._generatePresignedUrlUseCase.execute({
        path,
        operation,
      });

      res.status(200).json({ url: presignedUrl });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
