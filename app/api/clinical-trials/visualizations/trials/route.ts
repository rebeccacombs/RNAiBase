// app/api/clinical-trials/visualizations/trials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface DateFilter {
  gte?: Date;
  lte?: Date;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const type = searchParams.get('type');
  const value = searchParams.get('value');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const drugId = searchParams.get('drugId');

  if (!type || !value) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Build date filter if provided
    const dateFilter: DateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    // Build base query
    const baseWhere: any = {
      ...(Object.keys(dateFilter).length > 0 && { startDate: dateFilter }),
      ...(drugId && { drugId })
    };

    // Add specific filter based on visualization type
    let trials;
    switch (type) {
      case 'phases':
        // For phase visualization, filter by phase
        trials = await prisma.clinicalTrial.findMany({
          where: {
            ...baseWhere,
            phase: value === 'Not Specified' ? null : value
          },
          include: {
            drug: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            updateDate: 'desc'
          }
        });
        break;

      case 'status':
        // For status visualization, filter by status
        trials = await prisma.clinicalTrial.findMany({
          where: {
            ...baseWhere,
            status: value
          },
          include: {
            drug: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            updateDate: 'desc'
          }
        });
        break;

      case 'sponsors':
        // For sponsors visualization, filter by sponsor
        trials = await prisma.clinicalTrial.findMany({
          where: {
            ...baseWhere,
            sponsor: value
          },
          include: {
            drug: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            updateDate: 'desc'
          }
        });
        break;

      case 'timeline':
        // For timeline visualization, parse the month/year
        const date = new Date(value);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        trials = await prisma.clinicalTrial.findMany({
          where: {
            ...baseWhere,
            startDate: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          },
          include: {
            drug: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            updateDate: 'desc'
          }
        });
        break;

      case 'conditions':
        // For conditions visualization, filter by condition
        trials = await prisma.clinicalTrial.findMany({
          where: {
            ...baseWhere,
            conditions: {
              has: value
            }
          },
          include: {
            drug: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            updateDate: 'desc'
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid visualization type' },
          { status: 400 }
        );
    }

    // Add drug name to each trial
    const formattedTrials = trials.map(trial => ({
      ...trial,
      drugName: trial.drug?.name
    }));

    return NextResponse.json({ trials: formattedTrials });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}