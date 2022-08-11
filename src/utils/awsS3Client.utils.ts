import "dotenv/config";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const {
  AWS_S3_SECRET: secretAccessKey,
  AWS_S3_ACCESS_KEY: accessKeyId,
  AWS_S3_BUCKET_NAME: bucketName,
  AWS_S3_REGION: region,
} = process.env;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
  },
  region,
});

export interface UploadProps {
  Body: Buffer;
  Key: string;
  ContentType: any;
}
export interface GetImageProps {
  Body: Buffer;
  Key: string;
}

export const uploadToS3 = async ({ Body, ContentType, Key }: UploadProps) => {
  const params = { Bucket: bucketName, Key, Body, ContentType };
  const command = new PutObjectCommand(params);
  await s3.send(command);
};

export const getImageUrl = async (Key: string) => {
  const params = { Bucket: bucketName, Key };
  const command = new GetObjectCommand(params);

  return await getSignedUrl(s3, command, { expiresIn: 10000 });
};
