import { IHairstyleEntity } from "../../models/hairstyle.entity.js";

export interface IGetHairstylesByFaceShapeUseCase {
  execute({
    faceShape,
    gender,
  }: {
    faceShape: string;
    gender: string;
  }): Promise<IHairstyleEntity[]>;
}
