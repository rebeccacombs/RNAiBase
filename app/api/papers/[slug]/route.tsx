import { NextRequest, NextResponse } from 'next/server';
import { getPaper } from '@/services/papers';

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = context; 
    const paper = await getPaper(params.slug);

    if (!paper) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json(paper);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
