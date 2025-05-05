export interface IDeleteHairstyleUseCase {
  execute({ hairstyleId }: { hairstyleId: string }): Promise<void>;
}
