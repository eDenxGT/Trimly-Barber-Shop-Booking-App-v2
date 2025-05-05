export interface IUpdateHairstyleUseCase {
  execute({
    hairstyleId,
    faceShapes,
    gender,
    name,
    image,
  }: {
    hairstyleId: string;
    faceShapes: string[];
    gender: string;
    name: string;
    image: string;
  }): Promise<void>;
}
