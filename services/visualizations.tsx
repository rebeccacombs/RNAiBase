import prisma from '@/lib/db';

interface DateFilter {
  gte?: Date;
  lte?: Date;
}

export async function getVisualizationData(
  type: string,
  limit: number,
  dateFilter: DateFilter = {}
) {
  let data: any[] = [];

  switch (type) {
    case 'keywords':
      const papers = await prisma.paper.findMany({
        where: {
          pub_date: dateFilter,
        },
        select: {
          keywords: true,
        },
      });

      const keywordCounts = new Map<string, number>();
      papers.forEach((paper) => {
        paper.keywords.forEach((keyword) => {
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
          pub_date: dateFilter,
        },
        _count: {
          journal: true,
        },
      });

      data = journalCounts
        .map((item) => ({
          name: item.journal,
          value: item._count.journal,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      break;

    case 'authors':
      const authorPapers = await prisma.paper.findMany({
        where: {
          pub_date: dateFilter,
        },
        select: {
          authors: true,
        },
      });

      const authorCounts = new Map<string, number>();
      authorPapers.forEach((paper) => {
        paper.authors.forEach((author) => {
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
          pub_date: dateFilter,
        },
        select: {
          pub_date: true,
        },
        orderBy: {
          pub_date: 'asc',
        },
      });

      const timelineCounts = new Map<string, number>();
      timelinePapers.forEach((paper) => {
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

interface PaperSelect {
  id: true;
  title: true;
  authors: true;
  journal: true;
  pub_date: true;
  PMID: true;
  slug: true;
}

export async function getRelatedPapers(type: string, value: string) {
  const select: PaperSelect = {
    id: true,
    title: true,
    authors: true,
    journal: true,
    pub_date: true,
    PMID: true,
    slug: true,
  };

  let papers;

  switch (type) {
    case 'keywords':
      papers = await prisma.paper.findMany({
        where: {
          keywords: {
            has: value,
          },
        },
        select,
        orderBy: {
          pub_date: 'desc',
        },
      });
      break;

    case 'journals':
      papers = await prisma.paper.findMany({
        where: {
          journal: value,
        },
        select,
        orderBy: {
          pub_date: 'desc',
        },
      });
      break;

    case 'authors':
      papers = await prisma.paper.findMany({
        where: {
          authors: {
            has: value,
          },
        },
        select,
        orderBy: {
          pub_date: 'desc',
        },
      });
      break;

    case 'timeline':
      const [year, month] = value.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      papers = await prisma.paper.findMany({
        where: {
          pub_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select,
        orderBy: {
          pub_date: 'desc',
        },
      });
      break;

    default:
      throw new Error('Invalid visualization type');
  }

  return papers;
}
