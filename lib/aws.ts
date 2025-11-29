import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Client = new S3Client({ region: process.env.AWS_REGION });

type Params = {
  key: string;
  contentType: string;
  expiresIn?: number;
};

export const generateGetPreSignUrl = async ({
  key,
  expiresIn = 3600,
}: {
  key: string;
  expiresIn?: number;
}): Promise<string> => {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, getCommand, { expiresIn });
    return url;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate GET presigned URL');
  }
};

export const generatePreSignUrl = async ({
  key,
  contentType,
  expiresIn = 15 * 60,
}: Params): Promise<string> => {
  try {
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const links = await getSignedUrl(s3Client, putCommand, { expiresIn });
    return links;
  } catch (e) {
    console.error(e);
    throw new Error('AWS_S3_BUCKET_NAME is not configured/defined');
  }
};

export const deleteImageFromBucket = async ({
  key,
}: {
  key: string | undefined;
}) => {
  try {
    if (!key) {
      throw new Error('Missing S3 key');
    }
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(deleteCommand);
    return 'Image successfully deleted';
  } catch (error) {
    console.error(error);
    throw new Error('AWS_S3_BUCKET_NAME is not configured/defined');
  }
};
