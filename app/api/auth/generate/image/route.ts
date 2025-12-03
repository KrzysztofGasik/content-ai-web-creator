import { NextResponse } from 'next/server';
import { generateImageSchema } from '@/lib/schemas';
import { OpenAI } from 'openai';
import { getUserSession } from '@/lib/actions/actions';
import { randomUUID } from 'crypto';
import { generateGetPreSignUrl, s3Client } from '@/lib/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { ImageQuality, ImageSize, ImageStyle } from '@/types/types';

export async function POST(req: Request) {
  try {
    const { session } = await getUserSession();
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const body = await req.json();
    const parsedBody = generateImageSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid body',
          error: parsedBody.error,
        },
        { status: 400 }
      );
    }
    const { prompt, size, quality, style } = parsedBody.data;

    const generateImage = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: (size || '1024x1024') as ImageSize,
      quality: (quality || 'standard') as ImageQuality,
      style: (style || 'vivid') as ImageStyle,
      n: 1,
    });

    if (!generateImage.data) {
      throw new Error('No image URL returned from DALL-E');
    }

    const url = generateImage.data[0]?.url;

    const getImage = await fetch(url as string);
    const imageBuffer = await getImage.arrayBuffer();
    const uniqueKey = `${session.user.id}/images/${Date.now()}-${randomUUID()}.png`;

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueKey,
      Body: Buffer.from(imageBuffer),
      ContentType: 'image/png',
    });

    await s3Client.send(putCommand);

    const region = process.env.AWS_REGION;
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const permanentUrl = `https://${bucket}.s3.${region}.amazonaws.com/${uniqueKey}`;

    const image = await prisma.image.create({
      data: {
        userId: session.user.id,
        s3Key: uniqueKey,
        s3Bucket: process.env.AWS_S3_BUCKET_NAME!,
        url: permanentUrl,
        filename: `dalle-${Date.now()}.png`,
        size: Buffer.from(imageBuffer).length, // file size in bytes
        mimeType: 'image/png',
        width: parseInt(size?.split('x')[0] || '1024'), // extract from size string
        height: parseInt(size?.split('x')[1] || '1024'),
        isGenerated: true,
        prompt: prompt,
        quality: quality || 'standard',
        style: style || 'vivid',
        model: 'dall-e-3',
      },
    });

    const presignedUrl = await generateGetPreSignUrl({
      key: uniqueKey,
    });

    return NextResponse.json(
      { success: true, image: { ...image, url: presignedUrl } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during sending request to Open AI api', error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
