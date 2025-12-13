import { NextResponse } from 'next/server';
import { generateSchema } from '@/lib/schemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { extractValuesFromString, generatePromptText } from '@/lib/utils';
import { getContentTemplateById } from '@/lib/actions/sanity-actions';
import OpenAI from 'openai';
import { getUserApiKey } from '@/lib/actions/settings-actions';

export async function POST(req: Request) {
  try {
    await getServerSession(authOptions);
    const result = await getUserApiKey();
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'No API key configured' },
        { status: 403 }
      );
    }
    const openai = new OpenAI({
      apiKey: result.key,
    });
    const body = await req.json();
    const parsedBody = generateSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid body' },
        { status: 400 }
      );
    }
    const { topic, contentType, tone, context, templateSelector, id } =
      parsedBody.data;

    let promptText;

    if (templateSelector && templateSelector !== 'none') {
      const data = await getContentTemplateById(id as string);
      if (!data.template) {
        return NextResponse.json(
          { success: false, message: 'Empty data' },
          { status: 400 }
        );
      }
      const { template } = data;

      if (!template.promptTemplate) {
        return NextResponse.json(
          { success: false, message: 'Empty prompt template prop' },
          { status: 400 }
        );
      }
      const extractValues = extractValuesFromString({
        text: template.promptTemplate as string,
        topic,
        tone,
        context,
      });
      promptText = extractValues;
    } else {
      promptText = generatePromptText({
        topic,
        tone,
        contentType,
        context,
      });
    }

    const generateAnswer = await openai.chat.completions.create({
      messages: [{ role: 'user', content: promptText }],
      model: 'gpt-3.5-turbo',
      max_completion_tokens: 1000,
    });

    const content = generateAnswer.choices[0].message.content;
    const tokens = generateAnswer.usage?.total_tokens || 0;

    return NextResponse.json({ success: true, content, tokens });
  } catch (error) {
    console.error('Error during sending request to Open AI api', error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
