// If your model name is different, adjust this code accordingly
// app/api/clinical-trials/drugs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check what models are available in your schema
    // If the model name is different, change it here
    // For example, if your drug model is just "Drug" instead of "RNAiDrug"
    const drugs = await prisma.rNAiDrug.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ drugs });
  } catch (error) {
    console.error('Error fetching drugs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drugs' },
      { status: 500 }
    );
  }
}