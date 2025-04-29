import { Request, Response } from "express";

export interface IS3Controller {
  generatePresignedUrl(req: Request, res: Response): Promise<void>;
}
