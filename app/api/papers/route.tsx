// app/api/papers/route.ts
import { getPapers, parseSearchQuery, type SearchTerms } from '@/services/papers';
import { NextRequest, NextResponse } from 'next/server';

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 10;
const VALID_SORT_OPTIONS = ['pub_date_desc', 'pub_date_asc', 'title_asc', 'title_desc'] as const;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    // parse + validate pagination params
    let page = 1;
    let limit = DEFAULT_PAGE_SIZE;

    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    if (pageParam) {
      const parsedPage = parseInt(pageParam);
      if (isNaN(parsedPage) || parsedPage < 1) {
        return NextResponse.json(
          { error: 'Invalid page number' },
          { status: 400 }
        );
      }
      page = parsedPage;
    }

    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          { error: 'Invalid limit value' },
          { status: 400 }
        );
      }
      limit = Math.min(parsedLimit, MAX_PAGE_SIZE);
    }

    // Parse and validate sort parameter
    const sortBy = searchParams.get('sort');
    if (sortBy && !VALID_SORT_OPTIONS.includes(sortBy as any)) {
      return NextResponse.json(
        { error: 'Invalid sort option' },
        { status: 400 }
      );
    }


    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        { error: 'Invalid start date format' },
        { status: 400 }
      );
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json(
        { error: 'Invalid end date format' },
        { status: 400 }
      );
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // parse search query w/ proper typing
    const search = searchParams.get('search');
    const initialSearchTerms: SearchTerms = { titleTerms: [], authorTerms: [] };
    let searchTerms: SearchTerms = initialSearchTerms;
    
    if (search) {
      try {
        searchTerms = parseSearchQuery(search);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid search query format' },
          { status: 400 }
        );
      }
    }

    // construct filters object
    const filters = {
      page,
      limit,
      searchTerms,
      journal: searchParams.get('journal') || undefined,
      sortBy: sortBy || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    const result = await getPapers(filters);


    return NextResponse.json({
      ...result,
      metadata: {
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
        hasNextPage: page * limit < result.total,
        hasPreviousPage: page > 1,
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Failed to fetch papers') {
        return NextResponse.json(
          { error: 'Database error occurred' },
          { status: 503 }
        );
      }
      
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

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export const config = {
  api: {
    exampleQueries: [
      '?search=neural networks',
      '?search=author:smith',
      '?search=machine learning; author:john',
      '?sort=pub_date_desc&journal=Nature',
    ],
    parameters: {
      search: 'String: Search query with optional author prefix (e.g., "keyword; author:name")',
      page: 'Number: Page number (default: 1)',
      limit: `Number: Items per page (default: ${DEFAULT_PAGE_SIZE}, max: ${MAX_PAGE_SIZE})`,
      sort: `String: One of ${VALID_SORT_OPTIONS.join(', ')}`,
      journal: 'String: Journal name filter',
      startDate: 'ISO Date: Start of date range',
      endDate: 'ISO Date: End of date range',
    },
  },
};