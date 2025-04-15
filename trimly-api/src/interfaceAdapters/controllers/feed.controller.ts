import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IFeedController } from "../../entities/controllerInterfaces/feed/feed-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IAddPostUseCase } from "../../entities/useCaseInterfaces/feed/add-post-usecase.interface.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants.js";
import { IGetAllPostsByBarberUseCase } from "../../entities/useCaseInterfaces/feed/get-all-posts-by-barber-usecase.interface.js";
import { IGetSinglePostByPostIdUseCase } from "../../entities/useCaseInterfaces/feed/get-single-post-by-postid-usecase.interface.js";
import { IUpdatePostUseCase } from "../../entities/useCaseInterfaces/feed/update-post-usecase.interface.js";
import { IDeletePostUseCase } from "../../entities/useCaseInterfaces/feed/delete-post-usecase.interface.js";

@injectable()
export class FeedController implements IFeedController {
  constructor(
    @inject("IAddPostUseCase") private _addPostUseCase: IAddPostUseCase,
    @inject("IGetAllPostsByBarberUseCase")
    private _getAllPostsByBarberUseCase: IGetAllPostsByBarberUseCase,
    @inject("IGetSinglePostByPostIdUseCase")
    private _getSinglePostByPostIdUseCase: IGetSinglePostByPostIdUseCase,
    @inject("IUpdatePostUseCase")
    private _updatePostUseCase: IUpdatePostUseCase,
    @inject("IDeletePostUseCase") private _deletePostUseCase: IDeletePostUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                     🛠️ Add Post
  //* ─────────────────────────────────────────────────────────────
  async addPost(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const { caption, description, image } = req.body;
      if (!userId || !caption || !description || !image) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      await this._addPostUseCase.execute(userId, caption, description, image);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.POST_ADDED,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                  🛠️ Get All Posts For Barbers
  //* ─────────────────────────────────────────────────────────────
  async getAllPostsForBarber(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const { page, limit } = req.query;
      if (!userId || !page || !limit) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      const { items, total } = await this._getAllPostsByBarberUseCase.execute(
        userId,
        Number(page),
        Number(limit)
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        items,
        total,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️ Get Post By PostId
  //* ─────────────────────────────────────────────────────────────
  async getPostByPostId(req: Request, res: Response): Promise<void> {
    try {
      const { userId, role } = (req as CustomRequest).user;
      const { postId } = req.params;

      if (!userId || !postId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      const post = await this._getSinglePostByPostIdUseCase.execute(
        userId,
        role,
        postId
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        post,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                      🛠️ Edit Post
  //* ─────────────────────────────────────────────────────────────
  async editPost(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as CustomRequest).user;
      const { postId } = req.params;
      const { caption, description, image } = req.body;

      if (!postId || !caption || !description || !image || !userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      await this._updatePostUseCase.execute({
        userId,
        postId,
        caption,
        description,
        image,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                       🛠️ Delete Post
  //* ─────────────────────────────────────────────────────────────
  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { userId } = (req as CustomRequest).user;
      if (!postId || !userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      await this._deletePostUseCase.execute({
        postId,
        userId,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DELETE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
