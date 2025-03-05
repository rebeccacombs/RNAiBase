// app/api/update-drug-info/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateRNAiDrugInfo } from '@/lib/update-drug-info';

export async function GET(request: NextRequest) {
  try {
  
    const authHeader = request.headers.get('authorization');
    if (process.env.UPDATE_API_KEY && (!authHeader || authHeader !== `Bearer ${process.env.UPDATE_API_KEY}`)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await updateRNAiDrugInfo();
    
    return new NextResponse(JSON.stringify({ 
      success: true,
      message: 'RNAi drug information updated successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return new NextResponse(JSON.stringify({ 
      success: false,
      error: 'Failed to update RNAi drug information',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}