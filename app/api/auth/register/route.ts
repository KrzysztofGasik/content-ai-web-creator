import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = registerSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid body' },
        { status: 400 }
      );
    }
    const { email, password, name } = parsedBody.data;
    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error during registration', error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
