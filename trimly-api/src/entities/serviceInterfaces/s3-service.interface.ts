export interface IS3Service {
  generatePresignedUrl({
    path,
    operation,
    expires,
  }: {
    path: string;
    operation: "putObject" | "getObject";
    expires: number;
  }): Promise<string>;
}
