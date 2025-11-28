import { getUserSession } from '@/lib/actions';
import { generatePreSignUrl } from '@/lib/aws';
import { uploadSchema } from '@/lib/schemas';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session } = await getUserSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Missing session' },
        { status: 401 }
      );
    }

    const parsedBody = uploadSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid body' },
        { status: 400 }
      );
    }

    const { filename, contentType } = parsedBody.data;

    const uniqueKey = `${session.user.id}/${Date.now()}-${randomUUID()}-${filename}`;

    if (!process.env.AWS_S3_BUCKET_NAME) {
      return NextResponse.json(
        {
          success: false,
          message: 'AWS_S3_BUCKET_NAME is not configured/defined',
        },
        { status: 400 }
      );
    }

    const presignedUrl = await generatePreSignUrl({
      key: uniqueKey,
      contentType,
    });

    // Construct public S3 URL for permanent storage
    const region = process.env.AWS_REGION || 'us-east-1';
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${uniqueKey}`;

    return NextResponse.json(
      {
        success: true,
        url: presignedUrl, // Presigned URL for upload
        publicUrl, // Public URL for permanent storage
        key: uniqueKey,
        bucket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration', error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
