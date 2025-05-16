import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IFeedController } from "../../entities/controllerInterfaces/feed/feed-controller.interface.js";
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { IAddPostUseCase } from "../../entities/useCaseInterfaces/feed/post/add-post-usecase.interface.js";
import { CustomRequest } from "../middlewares/auth.middleware.js";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants.js";
import { IGetAllPostsByBarberUseCase } from "../../entities/useCaseInterfaces/feed/post/get-all-posts-by-barber-usecase.interface.js";
import { IGetSinglePostByPostIdUseCase } from "../../entities/useCaseInterfaces/feed/post/get-single-post-by-postid-usecase.interface.js";
import { IUpdatePostUseCase } from "../../entities/useCaseInterfaces/feed/post/update-post-usecase.interface.js";
import { IDeletePostUseCase } from "../../entities/useCaseInterfaces/feed/post/delete-post-usecase.interface.js";
import { IUpdatePostStatusUseCase } from "../../entities/useCaseInterfaces/feed/post/update-post-status-usecase.interface.js";
import { IToggleLikePostUseCase } from "../../entities/useCaseInterfaces/feed/post/toggle-like-post-usecase.interface.js";
import { IAddCommentUseCase } from "../../entities/useCaseInterfaces/feed/comment/add-comment-usecase.interface.js";
import { IToggleCommentLikeUseCase } from "../../entities/useCaseInterfaces/feed/comment/toggle-comment-like-usecase.interface.js";
import { IGetAllPostsForClientUseCase } from "../../entities/useCaseInterfaces/feed/post/get-all-posts-for-client-usecase.interface.js";
import { IGetPostLikedUsersUseCase } from "../../entities/useCaseInterfaces/feed/post/get-post-liked-users-usecase.interface.js";

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
    @inject("IDeletePostUseCase")
    private _deletePostUseCase: IDeletePostUseCase,
    @inject("IUpdatePostStatusUseCase")
    private _updatePostStatusUseCase: IUpdatePostStatusUseCase,
    @inject("IToggleLikePostUseCase")
    private _toggleLikePostUseCase: IToggleLikePostUseCase,
    @inject("IAddCommentUseCase")
    private _addCommentUseCase: IAddCommentUseCase,
    @inject("IToggleCommentLikeUseCase")
    private _toggleCommentLikeUseCase: IToggleCommentLikeUseCase,
    @inject("IGetAllPostsForClientUseCase")
    private _getAllPostsForClientUseCase: IGetAllPostsForClientUseCase,
    @inject("IGetPostLikedUsersUseCase")
    private _getPostLikedUsersUseCase: IGetPostLikedUsersUseCase
  ) {}

  //? ✨=========================================================✨
  //?                     📝 POST SECTION
  //? ✨=========================================================✨

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
  //*                  🛠️ Get All Posts For Clients
  //* ─────────────────────────────────────────────────────────────
  async getAllPostsForClient(req: Request, res: Response): Promise<void> {
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
      const { items, total } = await this._getAllPostsForClientUseCase.execute(
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
  //*                 🛠️ Get Post By PostId
  //* ─────────────────────────────────────────────────────────────
  async getPostByPostId(req: Request, res: Response): Promise<void> {
    try {
      const { userId, role } = (req as CustomRequest).user;
      const { postId } = req.params;
      const { forType } = req.query;

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
        postId,
        String(forType)
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
  //*                   🛠️ Update Post Status
  //* ─────────────────────────────────────────────────────────────
  async updatePostStatus(req: Request, res: Response): Promise<void> {
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

      await this._updatePostStatusUseCase.execute(postId, userId);

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

  //* ─────────────────────────────────────────────────────────────
  //*                     🛠️ Toggle Like Post
  //* ─────────────────────────────────────────────────────────────
  async toggleLikePost(req: Request, res: Response): Promise<void> {
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
      const liked = await this._toggleLikePostUseCase.execute({
        postId,
        userId,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        liked: liked,
        message: SUCCESS_MESSAGES.TOGGLE_LIKE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //? ✨=========================================================✨
  //?                     📝 COMMENT SECTION
  //? ✨=========================================================✨

  //* ─────────────────────────────────────────────────────────────
  //*                       🛠️ Post Comment
  //* ─────────────────────────────────────────────────────────────
  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { userId } = (req as CustomRequest).user;
      const { comment } = req.body;
      if (!postId || !userId || !comment) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      await this._addCommentUseCase.execute({
        postId,
        userId,
        comment,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.COMMENT_ADDED,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                       🛠️ Toggle Like Comment
  //* ─────────────────────────────────────────────────────────────
  async toggleCommentLike(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const { userId } = (req as CustomRequest).user;
      if (!commentId || !userId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS,
        });
        return;
      }
      await this._toggleCommentLikeUseCase.execute({
        commentId,
        userId,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TOGGLE_LIKE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                   🛠️ Get Post Liked Users
  //* ─────────────────────────────────────────────────────────────
  async getPostLikedUsers(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;

      if (!postId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.MISSING_PARAMETERS, 
        });
        return;
      }

      const users = await this._getPostLikedUsersUseCase.execute({
        postId,
      });


      res.status(HTTP_STATUS.OK).json({
        success: true,
        users,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
