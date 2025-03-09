import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface DateFilter {
  gte?: Date;
  lte?: Date;
}

interface ChartData {
  name: string;
  value: number;
}

async function getVisualizedData(
  type: string, 
  limit: number, 
  dateFilter: DateFilter = {}, 
  drugId?: string
): Promise<ChartData[]> {
  let data: ChartData[] = [];
  
  const baseWhere: any = {
    ...(Object.keys(dateFilter).length > 0 && { startDate: dateFilter }),
    ...(drugId && { drugId })
  };

  switch (type) {
    case 'phases':
      const phaseData = await prisma.clinicalTrial.groupBy({
        by: ['phase'],
        where: baseWhere,
        _count: {
          id: true
        }
      });

      data = phaseData
        .map(item => ({
          name: item.phase || 'Not Specified', 
          value: item._count.id
        }))
        .sort((a, b) => {
          const phaseOrder: Record<string, number> = {
            'Phase 1': 1,
            'Phase 1/2': 2,
            'Phase 2': 3,
            'Phase 2/3': 4,
            'Phase 3': 5,
            'Phase 4': 6,
            'Not Specified': 7
          };
          
          const aOrder = phaseOrder[a.name] || 99;
          const bOrder = phaseOrder[b.name] || 99;
          return aOrder - bOrder;
        });
      break;

    case 'status':
      const statusData = await prisma.clinicalTrial.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: {
          id: true
        }
      });

      data = statusData
        .map(item => ({
          name: item.status || 'Unknown',
          value: item._count.id
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      break;

    case 'sponsors':
      const sponsorData = await prisma.clinicalTrial.groupBy({
        by: ['sponsor'],
        where: baseWhere,
        _count: {
          id: true
        }
      });

      data = sponsorData
        .map(item => ({
          name: item.sponsor || 'Unknown Sponsor', 
          value: item._count.id
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      break;

    case 'timeline':
      const trialsByDate = await prisma.clinicalTrial.findMany({
        where: {
          ...baseWhere,
          startDate: {
            not: null, 
          }
        },
        select: {
          startDate: true
        },
        orderBy: {
          startDate: 'asc'
        }
      });

      const timelineCounts = new Map<string, number>();
      trialsByDate.forEach(trial => {
        if (trial.startDate) {
          const date = new Date(trial.startDate);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          timelineCounts.set(key, (timelineCounts.get(key) || 0) + 1);
        }
      });

      data = Array.from(timelineCounts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'conditions':
      const trialsWithConditions = await prisma.clinicalTrial.findMany({
        where: baseWhere,
        select: {
          conditions: true
        }
      });

      const conditionCounts = new Map<string, number>();
      trialsWithConditions.forEach(trial => {
        (trial.conditions || []).forEach(condition => {
          if (condition) { 
            conditionCounts.set(condition, (conditionCounts.get(condition) || 0) + 1);
          }
        });
      });

      data = Array.from(conditionCounts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      break;
  }

  return data;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '20');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const drugId = searchParams.get('drugId');

  if (!type) {
    return NextResponse.json(
      { error: 'Missing visualization type' },
      { status: 400 }
    );
  }

  try {
    const dateFilter: DateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const data = await getVisualizedData(
      type, 
      limit, 
      dateFilter, 
      drugId || undefined
    );

    return NextResponse.json({ data });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}