// app/api/visualizations/route.tsx
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

interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  pub_date: Date;
  PMID: number;
  slug: string;
}

async function getVisualizedData(type: string, limit: number, dateFilter: DateFilter = {}): Promise<ChartData[]> {
  let data: ChartData[] = [];

  switch (type) {
    case 'keywords':
      const papers = await prisma.paper.findMany({
        where: {
          pub_date: dateFilter
        },
        select: {
          keywords: true
        }
      });

      const keywordCounts = new Map<string, number>();
      papers.forEach(paper => {
        paper.keywords.forEach(keyword => {
          keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
        });
      });

      data = Array.from(keywordCounts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      break;

    case 'journals':
      const journalCounts = await prisma.paper.groupBy({
        by: ['journal'],
        where: {
          pub_date: dateFilter
        },
        _count: {
          journal: true
        }
      });

      data = journalCounts
        .map(item => ({
          name: item.journal,
          value: item._count.journal
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      break;

    case 'authors':
      const authorPapers = await prisma.paper.findMany({
        where: {
          pub_date: dateFilter
        },
        select: {
          authors: true
        }
      });

      const authorCounts = new Map<string, number>();
      authorPapers.forEach(paper => {
        paper.authors.forEach(author => {
          authorCounts.set(author, (authorCounts.get(author) || 0) + 1);
        });
      });

      data = Array.from(authorCounts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      break;

    case 'timeline':
      const timelinePapers = await prisma.paper.findMany({
        where: {
          pub_date: dateFilter
        },
        select: {
          pub_date: true
        },
        orderBy: {
          pub_date: 'asc'
        }
      });

      const timelineCounts = new Map<string, number>();
      timelinePapers.forEach(paper => {
        const date = paper.pub_date;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        timelineCounts.set(key, (timelineCounts.get(key) || 0) + 1);
      });

      data = Array.from(timelineCounts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return data;
}

async function getRelatedPapers(type: string, value: string): Promise<Paper[]> {
  const select = {
    id: true,
    title: true,
    authors: true,
    journal: true,
    pub_date: true,
    PMID: true,
    slug: true,
  };

  switch (type) {
    case 'keywords':
      return await prisma.paper.findMany({
        where: {
          keywords: {
            has: value
          }
        },
        select,
        orderBy: {
          pub_date: 'desc'
        }
      });

    case 'journals':
      return await prisma.paper.findMany({
        where: {
          journal: value
        },
        select,
        orderBy: {
          pub_date: 'desc'
        }
      });

    case 'authors':
      return await prisma.paper.findMany({
        where: {
          authors: {
            has: value
          }
        },
        select,
        orderBy: {
          pub_date: 'desc'
        }
      });

    case 'timeline':
      const [year, month] = value.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      return await prisma.paper.findMany({
        where: {
          pub_date: {
            gte: startDate,
            lte: endDate
          }
        },
        select,
        orderBy: {
          pub_date: 'desc'
        }
      });

    default:
      throw new Error('Invalid visualization type');
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '50');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const selectedValue = searchParams.get('value');

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

    const data = await getVisualizedData(type, limit, dateFilter);

    let papers: Paper[] = [];
    if (selectedValue) {
      papers = await getRelatedPapers(type, selectedValue);
    }

    return NextResponse.json({ data, papers });

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error && error.message === 'Invalid visualization type') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}