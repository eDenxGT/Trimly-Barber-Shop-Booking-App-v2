import { inject, injectable } from "tsyringe";
import { IHairstyleDetectorController } from "../../entities/controllerInterfaces/hairstyle-detector/hairstyle-detector-controller.interface.js";
import { Request, Response } from "express";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants.js";
import { IGetHairstylesByFaceShapeUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-hairstyles-by-face-shape-usecase.interface.js";
import { IAddHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/add-hairstyle-usecase.interface.js";
import { IGetAllHairstylesUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/get-all-hairstyles-usecase.interface.js";
import { IUpdateHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/update-hairstyle-usecase.interface.js";
import { IDeleteHairstyleUseCase } from "../../entities/useCaseInterfaces/hairstyle-detector/delete-hairstyle-usecase.interface.js";

@injectable()
export class HairstyleDetectorController
  implements IHairstyleDetectorController
{
  constructor(
    @inject("IGetHairstylesByFaceShapeUseCase")
    private _getHairstylesByFaceShapeUseCase: IGetHairstylesByFaceShapeUseCase,
    @inject("IAddHairstyleUseCase")
    private _addHairstyleUseCase: IAddHairstyleUseCase,
    @inject("IGetAllHairstylesUseCase")
    private _getAllHairstylesUseCase: IGetAllHairstylesUseCase,
    @inject("IUpdateHairstyleUseCase")
    private _updateHairstyleUseCase: IUpdateHairstyleUseCase,
    @inject("IDeleteHairstyleUseCase")
    private _deleteHairstyleUseCase: IDeleteHairstyleUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*               🛠️  Get Hairstyles By Face Shape
  //* ─────────────────────────────────────────────────────────────
  async getHairstylesByFaceShape(req: Request, res: Response): Promise<void> {
    try {
      const { faceShape, gender } = req.query;

      if (!faceShape || !gender) {
        throw new CustomError(
          ERROR_MESSAGES.MISSING_PARAMETERS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const hairstyles = await this._getHairstylesByFaceShapeUseCase.execute({
        faceShape: String(faceShape),
        gender: String(gender),
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        hairstyles,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*               🛠️  Get All Hairstyles
  //* ─────────────────────────────────────────────────────────────
  async getAllHairstyles(req: Request, res: Response): Promise<void> {
    try {
      const { search, page, limit } = req.query;

      const { hairstyles, totalPages } =
        await this._getAllHairstylesUseCase.execute({
          search: String(search),
          page: Number(page),
          limit: Number(limit),
        });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        hairstyles,
        totalPages,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️  Add Hairstyle
  //* ─────────────────────────────────────────────────────────────
  async addHairstyle(req: Request, res: Response): Promise<void> {
    try {
      const { faceShapes, gender, name, image } = req.body;

      if (!faceShapes || !gender || !name || !image) {
        throw new CustomError(
          ERROR_MESSAGES.MISSING_PARAMETERS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this._addHairstyleUseCase.execute({
        faceShapes,
        gender,
        name,
        image,
      });

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.ADDED,
        success: true,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️  Update Hairstyle
  //* ─────────────────────────────────────────────────────────────
  async updateHairstyle(req: Request, res: Response): Promise<void> {
    try {
      const { hairstyleId } = req.params;
      const { faceShapes, gender, name, image } = req.body;

      if (!faceShapes || !gender || !name || !image || !hairstyleId) {
        throw new CustomError(
          ERROR_MESSAGES.MISSING_PARAMETERS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this._updateHairstyleUseCase.execute({
        hairstyleId,
        faceShapes,
        gender,
        name,
        image,
      });

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
        success: true,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️  Delete Hairstyle
  //* ─────────────────────────────────────────────────────────────
  async deleteHairstyle(req: Request, res: Response): Promise<void> {
    try {
      const { hairstyleId } = req.params;

      if (!hairstyleId) {
        throw new CustomError(
          ERROR_MESSAGES.MISSING_PARAMETERS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this._deleteHairstyleUseCase.execute({
        hairstyleId,
      });

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.DELETE_SUCCESS,
        success: true,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
