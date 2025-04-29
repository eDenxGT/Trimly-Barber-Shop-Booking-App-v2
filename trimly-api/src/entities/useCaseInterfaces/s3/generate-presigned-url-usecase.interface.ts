export interface IGeneratePresignedUrlUseCase {
  execute({
    path,
    operation,
  }: {
    path: string;
    operation: "putObject" | "getObject";
  }): Promise<string>;
}
