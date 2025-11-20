import { NextResponse } from 'next/server';
import { GenerateData, generateSchema } from '@/lib/schemas';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePromptText } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const body = await req.json();
    const parsedBody = generateSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid body' },
        { status: 400 }
      );
    }
    const { topic, contentType, tone, context } = parsedBody.data;

    const promptText = generatePromptText({
      topic,
      tone,
      contentType,
      context,
    });

    const generateAnswer = streamText({
      messages: [{ role: 'user', content: promptText }],
      model: openai('gpt-3.5-turbo'),
      maxOutputTokens: 1000,
    });

    return generateAnswer.toTextStreamResponse();
  } catch (error) {
    console.error('Error during sending request to Open AI api', error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
