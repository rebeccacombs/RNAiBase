// app/papers/page.tsx
'use client';

import React from 'react';
import { Container, Paper, Title, Group, Badge, Text, Stack, Skeleton, Pagination, Button } from '@mantine/core';
import SearchBar from './SearchBar';
import Link from 'next/link';
import type { Paper as PaperType } from '@/services/papers';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';

export default function PapersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [papers, setPapers] = React.useState<PaperType[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isFirstLoad, setIsFirstLoad] = React.useState<boolean>(true);

  const currentParams = React.useMemo(() => 
    new URLSearchParams(searchParams.toString()), [searchParams]);

  const handleSearch = React.useCallback(async (params: URLSearchParams) => {
    if (!isFirstLoad) {
      setLoading(true);
    }
    
    try {
      const response = await fetch(`/api/papers?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch papers');
      const data = await response.json();
      setPapers(data.papers || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setPapers([]);
      setTotal(0);
    } finally {
      setLoading(false);
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }
  }, [isFirstLoad]);

  // update URL and trigger search
  const updateSearchParams = React.useCallback((newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`);
    handleSearch(newParams);
  }, [pathname, router, handleSearch]);

  // handle pagination 
  const handlePageChange = React.useCallback((newPage: number) => {
    const newParams = new URLSearchParams(currentParams);
    newParams.set('page', newPage.toString());
    updateSearchParams(newParams);
  }, [currentParams, updateSearchParams]);

  // hndle search bar 
  const handleSearchBarChange = React.useCallback((params: URLSearchParams) => {
    // preserve page params if it exists 
    const newParams = new URLSearchParams(params);
    const currentPage = currentParams.get('page');
    
    const isOnlyPageChange = 
      Array.from(currentParams.entries()).every(([key, value]) => {
        if (key === 'page') return true;
        return params.get(key) === value;
      }) &&
      Array.from(params.entries()).every(([key, value]) => {
        if (key === 'page') return true;
        return currentParams.get(key) === value;
      });

    if (isOnlyPageChange && currentPage) {
      newParams.set('page', currentPage);
    } else {
      // reset to page 1 if search criteria changed
      newParams.set('page', '1');
    }
    
    updateSearchParams(newParams);
  }, [currentParams, updateSearchParams]);

  // initial load and URL 
  React.useEffect(() => {
    handleSearch(currentParams);
  }, [currentParams, handleSearch]);

  const LoadingSkeleton = () => (
    <Stack gap="md">
      {[1, 2, 3].map((n) => (
        <Paper key={n} p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Skeleton height={24} radius="md" style={{ width: '60%' }} />
              <Skeleton height={24} radius="md" style={{ width: '20%' }} />
            </Group>
            <Skeleton height={60} radius="md" />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );

  if (isFirstLoad) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <span>
            <Button
              component={Link}
              href="/"
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              style={{ alignSelf: 'flex-start' }}
            >
              Back to Home
            </Button>
            <Title order={1}>Research Papers</Title>
          </span>
          <Paper shadow="xs" p="md" withBorder>
            <Skeleton height={40} radius="sm" mb="md" />
            <Skeleton height={100} radius="sm" />
          </Paper>
          <LoadingSkeleton />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <span>
          <Button
            component={Link}
            href="/"
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            style={{ alignSelf: 'flex-start' }}
          >
            Back to Home
          </Button>
          <Title order={1}>Research Papers</Title>
        </span>
        <SearchBar onSearch={handleSearchBarChange} loading={loading} />

        {loading ? (
          <LoadingSkeleton />
        ) : papers.length > 0 ? (
          <Stack gap="lg">
            {papers.map((paper) => (
              <Link 
                key={paper.id} 
                href={`/papers/${paper.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Paper 
                  shadow="sm" 
                  p="md" 
                  withBorder
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Title order={3}>
                        {paper.title}
                      </Title>
                      <Badge>PMID: {paper.PMID}</Badge>
                    </Group>

                    <Text size="sm" lineClamp={3} c="dimmed">
                      {paper.abstract}
                    </Text>

                    <Group gap="xs">
                      {paper.keywords.map((keyword) => (
                        <Badge key={keyword} variant="light" size="sm">
                          {keyword}
                        </Badge>
                      ))}
                    </Group>

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Published: {new Date(paper.pub_date).toLocaleDateString()}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {paper.journal}
                      </Text>
                    </Group>

                    <Group gap="xs">
                      <Text size="sm" fw={500}>
                        Authors:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {paper.authors.join(', ')}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              </Link>
            ))}

            {total > 10 && (
              <Pagination
                total={Math.ceil(total / 10)}
                value={parseInt(searchParams.get('page') || '1')}
                onChange={handlePageChange}
                style={{ alignSelf: 'center' }}
              />
            )}
          </Stack>
        ) : (
          <Paper p="xl" withBorder>
            <Stack align="center" gap="md">
              <Title order={3}>No papers found</Title>
              <Text c="dimmed">Try adjusting your search criteria</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}