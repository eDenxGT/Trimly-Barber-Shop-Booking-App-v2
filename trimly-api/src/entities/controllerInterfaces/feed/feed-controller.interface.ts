import { Request, Response } from "express";

export interface IFeedController {
  addPost(req: Request, res: Response): Promise<void>;
  getAllPostsForBarber(req: Request, res: Response): Promise<void>;
  getPostByPostId(req: Request, res: Response): Promise<void>;
  editPost(req: Request, res: Response): Promise<void>;
  updatePostStatus(req: Request, res: Response): Promise<void>;
  deletePost(req: Request, res: Response): Promise<void>;
}
