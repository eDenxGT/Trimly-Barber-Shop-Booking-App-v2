import { Request, Response } from "express";

export interface IFeedController {
  addPost(req: Request, res: Response): Promise<void>;
  getAllPostsForBarber(req: Request, res: Response): Promise<void>;
  getAllPostsForClient(req: Request, res: Response): Promise<void>;
  getPostByPostId(req: Request, res: Response): Promise<void>;
  editPost(req: Request, res: Response): Promise<void>;
  updatePostStatus(req: Request, res: Response): Promise<void>;
  deletePost(req: Request, res: Response): Promise<void>;
  toggleLikePost(req: Request, res: Response): Promise<void>;
  getPostLikedUsers(req: Request, res: Response): Promise<void>;
  addComment(req: Request, res: Response): Promise<void>;
  toggleCommentLike(req: Request, res: Response): Promise<void>;
}
