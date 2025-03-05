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


//so i want a trials page and i want that to display the drugs that are within my RNAiDrug Table
// for each RNAidrug, i want a user to be able to click onto it and for there to be a subpage listing all of the clinical trials information pertaining to that drug, which can be found in the ClinicalTrial table of the database