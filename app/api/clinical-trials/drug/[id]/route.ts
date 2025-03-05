// app/api/clinical-trials/drug/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    if (isNaN(skip) || isNaN(take) || skip < 0 || take <= 0 || take > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Load additional trials
    const trials = await prisma.clinicalTrial.findMany({
      where: {
        drugId: id,
      },
      orderBy: {
        updateDate: 'desc',
      },
      skip,
      take,
    });

    return NextResponse.json(
      { 
        trials,
        count: trials.length 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching additional trials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trials' },
      { status: 500 }
    );
  }
}