import { NextResponse } from 'next/server';
import { register } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await register(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Something went wrong',
      },
      { status: 400 }
    );
  }
}
