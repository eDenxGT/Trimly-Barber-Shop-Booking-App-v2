export interface IAddHairstyleUseCase {
  execute({
    faceShapes,
    gender,
    name,
    image,
  }: {
    faceShapes: string[];
    gender: string;
    name: string;
    image: string;
  }): Promise<void>;
}
