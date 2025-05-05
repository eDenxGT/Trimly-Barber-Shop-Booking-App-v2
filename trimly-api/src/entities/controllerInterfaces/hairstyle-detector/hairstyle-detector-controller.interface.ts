import { Request, Response } from "express";

export interface IHairstyleDetectorController {
    getHairstylesByFaceShape(req: Request, res: Response): Promise<void>;
    addHairstyle(req: Request, res: Response): Promise<void>;
    getAllHairstyles(req: Request, res: Response): Promise<void>;
    updateHairstyle(req: Request, res: Response): Promise<void>;
    deleteHairstyle(req: Request, res: Response): Promise<void>;
}
