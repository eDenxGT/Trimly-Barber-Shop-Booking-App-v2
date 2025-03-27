export class CustomError extends Error {
   statusCode: number;
   constructor(message: string, statusCode: number) {
      super(message)
      this.name = "CustomError"
      this.statusCode = statusCode || 500;
   }
}