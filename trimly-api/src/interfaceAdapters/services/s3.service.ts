import { injectable } from "tsyringe";
import { IS3Service } from "../../entities/servicesInterfaces/s3-service.interface.js";
import { config } from "../../shared/config.js";
import AWS from "aws-sdk";

@injectable()
export class S3Service implements IS3Service {
  async generatePresignedUrl({
    path,
    operation,
    expires,
  }: {
    path: string;
    operation: "putObject" | "getObject";
    expires: number;
  }): Promise<string> {
    const params = {
      Bucket: config.awsCfg.AWS_BUCKET_NAME!,
      Key: path,
      Expires: expires,
    };

    const s3 = new AWS.S3({
      accessKeyId: config.awsCfg.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.awsCfg.AWS_SECRET_ACCESS_KEY!,
      region: config.awsCfg.AWS_REGION!,
      signatureVersion: "v4",
    });

    const uploadURL = await s3.getSignedUrlPromise(operation, params);
    return uploadURL;
  }
}
