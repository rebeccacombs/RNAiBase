// app/api/journals/route.ts
import { getJournals } from '@/services/papers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const journals = await getJournals();
    return NextResponse.json(journals);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}