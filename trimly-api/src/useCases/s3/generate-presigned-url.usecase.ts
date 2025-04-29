import { inject, injectable } from "tsyringe";
import { IGeneratePresignedUrlUseCase } from "../../entities/useCaseInterfaces/s3/generate-presigned-url-usecase.interface.js";
import { IS3Service } from "./../../entities/servicesInterfaces/s3-service.interface.js";

@injectable()
export class GeneratePresignedUrlUseCase
  implements IGeneratePresignedUrlUseCase
{
  constructor(@inject("IS3Service") private _s3Service: IS3Service) {}

  async execute({
    path,
    operation,
  }: {
    path: string;
    operation: "putObject" | "getObject";
  }): Promise<string> {
    const expires = 60; 
    return await this._s3Service.generatePresignedUrl({
      path,
      operation,
      expires,
    });
  }
}
