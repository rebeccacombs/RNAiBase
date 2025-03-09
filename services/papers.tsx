import prisma from '@/lib/db';

export type Paper = {
  id: string;
  PMID: number;
  title: string;
  slug: string;
  abstract: string;
  authors: string[];
  journal: string;
  pub_date: Date;
  keywords: string[];
  url: string;
  affiliations: string[];
};

export interface SearchTerms {
  titleTerms: string[];
  authorTerms: string[];
}

export interface SearchFilters {
  page?: number;
  limit?: number;
  searchTerms?: SearchTerms;
  sortBy?: string | null;
  journal?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export const getJournals = async (): Promise<string[]> => {
  try {
    const results = await prisma.paper.findMany({
      select: { journal: true },
      distinct: ['journal'],
      orderBy: { journal: 'asc' },
    });

    return results.map((result) => result.journal);
  } catch (error) {
    console.error('Error fetching journals:', error);
    throw new Error('Failed to fetch journals');
  }
};

export const getPapers = async (filters: SearchFilters) => {
  const {
    page = 1,
    limit = 10,
    searchTerms = { titleTerms: [], authorTerms: [] },
    sortBy,
    journal,
    startDate,
    endDate,
  } = filters;

  try {
    const where: any = {};
    const conditions = [];

    if (searchTerms.titleTerms.length > 0) {
      const titleConditions = searchTerms.titleTerms.map((term) => ({
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { abstract: { contains: term, mode: 'insensitive' } },
          { keywords: { hasSome: [term] } },
        ],
      }));
      conditions.push(...titleConditions);
    }

    let authorMatches: string[] = [];
    if (searchTerms.authorTerms.length > 0) {
      const allPapers = await prisma.paper.findMany({
        select: { authors: true },
      });

      const searchTermsLower = searchTerms.authorTerms.map((term) => term.toLowerCase());

      const matchingAuthorsSet = new Set<string>();
      allPapers.forEach((paper) => {
        paper.authors.forEach((author) => {
          if (searchTermsLower.some((term) => author.toLowerCase().includes(term))) {
            matchingAuthorsSet.add(author);
          }
        });
      });

      authorMatches = Array.from(matchingAuthorsSet);

      if (authorMatches.length > 0) {
        conditions.push({
          authors: {
            hasSome: authorMatches,
          },
        });
      }
    }

    if (journal) {
      conditions.push({
        journal: { equals: journal, mode: 'insensitive' },
      });
    }

    if (startDate || endDate) {
      const dateFilter: any = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      conditions.push({
        pub_date: dateFilter,
      });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const orderBy = (() => {
      switch (sortBy) {
        case 'pub_date_asc':
          return { pub_date: 'asc' as const };
        case 'pub_date_desc':
          return { pub_date: 'desc' as const };
        case 'title_asc':
          return { title: 'asc' as const };
        case 'title_desc':
          return { title: 'desc' as const };
        default:
          return { pub_date: 'desc' as const };
      }
    })();

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        orderBy,
        select: {
          id: true,
          PMID: true,
          title: true,
          slug: true,
          abstract: true,
          authors: true,
          journal: true,
          pub_date: true,
          keywords: true,
          url: true,
          affiliations: true,
        },
      }),
      prisma.paper.count({ where }),
    ]);

    return {
      papers,
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Error in getPapers:', error);
    throw new Error('Failed to fetch papers');
  }
};

export function parseSearchQuery(searchQuery: string): SearchTerms {
  const terms: SearchTerms = {
    titleTerms: [],
    authorTerms: [],
  };

  if (!searchQuery) return terms;

  try {
  
    const components = searchQuery.split(';').map((comp) => comp.trim());

    components.forEach((component) => {
      if (!component) return;

      if (component.toLowerCase().startsWith('author:')) {
        const authorPart = component.substring(7).trim();
        if (authorPart) {
          terms.authorTerms.push(...authorPart.split(/\s+/).filter(Boolean));
        }
      } else {
        terms.titleTerms.push(...component.split(/\s+/).filter(Boolean));
      }
    });

    return terms;
  } catch (error) {
    console.error('Error parsing search query:', error);
    return {
      titleTerms: [],
      authorTerms: [],
    };
  }
}

export const getPaper = async (slug: string): Promise<Paper | null> => {
  try {
    return await prisma.paper.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error('Error fetching paper:', error);
    throw new Error('Failed to fetch paper');
  }
};
