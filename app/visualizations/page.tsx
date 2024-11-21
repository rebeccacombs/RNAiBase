'use client';

import React, { useCallback, memo, Suspense } from 'react';
import {
  Container,
  Title,
  Button,
  Paper,
  Stack,
  Grid,
  Select,
  NumberInput,
  Group,
  Text,
  ScrollArea,
  Badge,
  Skeleton,
  Box,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconArrowLeft, IconChartBar, IconChartPie, IconChartTreemap, IconClick } from '@tabler/icons-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Types
type VisualizationType = 'keywords' | 'journals' | 'authors' | 'timeline';
type ChartType = 'bar' | 'pie' | 'treemap';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  pub_date: Date;
  PMID: number;
  slug: string;
}

interface SelectedData {
  label: string;
  papers: Paper[];
}

interface FilterState {
  limit: number;
  startDate: string | null;
  endDate: string | null;
}

interface ChartData {
  name: string;
  value: number;
}

// Dynamic import of Charts component
const Charts = dynamic(
  () => import('./components/Charts'),
  { 
    ssr: false,
    loading: () => <Skeleton h={500} radius="md" />
  }
);

// Memoized Components
const PaperCard = memo(({ paper }: { paper: Paper }) => (
  <Box
    component={Link}
    href={`/papers/${paper.slug}?back=visualizations`}
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <Paper withBorder p="xs">
      <Stack gap="xs">
        <Text fw={500} lineClamp={2}>
          {paper.title}
        </Text>
        <Group gap="xs" wrap="nowrap">
          <Text size="sm" c="dimmed">
            {new Date(paper.pub_date).getFullYear()}
          </Text>
          <Text size="sm" c="dimmed">•</Text>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {paper.authors.join(', ')}
          </Text>
        </Group>
      </Stack>
    </Paper>
  </Box>
));

PaperCard.displayName = 'PaperCard';

const FilterControls = memo(({ 
  visualizationType,
  chartType,
  filters,
  onVisualizationTypeChange,
  onChartTypeChange,
  onLimitChange,
  onDateChange
}: {
  visualizationType: VisualizationType;
  chartType: ChartType;
  filters: FilterState;
  onVisualizationTypeChange: (value: string | null) => void;
  onChartTypeChange: (value: string | null) => void;
  onLimitChange: (value: number | string) => void;
  onDateChange: (value: [Date | null, Date | null]) => void;
}) => {
  const visualizationTypeData = [
    { value: 'keywords', label: 'Top Keywords' },
    { value: 'journals', label: 'Journal Distribution' },
    { value: 'authors', label: 'Top Authors' },
    { value: 'timeline', label: 'Publication Timeline' },
  ];

  const chartTypeData = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'treemap', label: 'Treemap' }
  ];

  const getChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case 'bar': return <IconChartBar size={16} />;
      case 'pie': return <IconChartPie size={16} />;
      case 'treemap': return <IconChartTreemap size={16} />;
    }
  };

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Grid align="flex-end">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Visualization Type"
            value={visualizationType}
            onChange={onVisualizationTypeChange}
            data={visualizationTypeData}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Chart Type"
            value={chartType}
            onChange={onChartTypeChange}
            data={chartTypeData}
            leftSection={getChartTypeIcon(chartType)}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <NumberInput
            label="Limit"
            value={filters.limit}
            onChange={onLimitChange}
            min={1}
            max={100}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <DatePickerInput
            type="range"
            label="Date Range"
            placeholder="Filter by date range"
            value={[
              filters.startDate ? new Date(filters.startDate) : null,
              filters.endDate ? new Date(filters.endDate) : null
            ]}
            onChange={onDateChange}
            clearable
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
});

FilterControls.displayName = 'FilterControls';

const SelectedPapers = memo(({ 
  selectedData, 
  loadingPapers 
}: { 
  selectedData: SelectedData;
  loadingPapers: boolean;
}) => (
  <Paper shadow="xs" p="md" withBorder>
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Selected: {selectedData.label}</Title>
        <Badge size="lg">
          {loadingPapers ? 'Loading...' : `${selectedData.papers.length} papers`}
        </Badge>
      </Group>

      <ScrollArea.Autosize mah={600}>
        {loadingPapers ? (
          <Stack gap="xs">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} h={80} radius="sm" />
            ))}
          </Stack>
        ) : (
          <Stack gap="xs">
            {selectedData.papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </Stack>
        )}
      </ScrollArea.Autosize>
    </Stack>
  </Paper>
));

SelectedPapers.displayName = 'SelectedPapers';

// Custom hook for data fetching
function useVisualizationData(visualizationType: VisualizationType, filters: FilterState) {
  const [data, setData] = React.useState<ChartData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: visualizationType,
        limit: filters.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`/api/visualizations?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      
      setData(result.data);
    } catch (error) {
      console.error('Error fetching visualization data:', error);
    } finally {
      setLoading(false);
    }
  }, [visualizationType, filters]);

  React.useEffect(() => {
    const abortController = new AbortController();
    fetchData();
    return () => abortController.abort();
  }, [fetchData]);

  return { data, loading };
}

// Main Component
export default function VisualizationsPage() {
  const [mounted, setMounted] = React.useState(false);
  const [visualizationType, setVisualizationType] = React.useState<VisualizationType>('keywords');
  const [chartType, setChartType] = React.useState<ChartType>('bar');
  const [selectedData, setSelectedData] = React.useState<SelectedData | null>(null);
  const [loadingPapers, setLoadingPapers] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({
    limit: 20,
    startDate: null,
    endDate: null,
  });

  const { data, loading } = useVisualizationData(visualizationType, filters);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPapersData = React.useCallback(async (label: string) => {
    setLoadingPapers(true);
    try {
      const params = new URLSearchParams({
        type: visualizationType,
        value: label,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`/api/visualizations?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch papers');
      const result = await response.json();
      
      if (result.papers) {
        setSelectedData(prev => ({
          label,
          papers: result.papers
        }));
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoadingPapers(false);
    }
  }, [visualizationType, filters.startDate, filters.endDate]);

  const handleDataClick = useCallback((entry: any) => {
    if (entry && entry.name) {
      setSelectedData(prev => ({
        label: entry.name,
        papers: prev?.papers || []
      }));
      fetchPapersData(entry.name);
    }
  }, [fetchPapersData]);

  if (!mounted) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <Skeleton height={40} width={200} />
          <Skeleton height={60} />
          <Skeleton height={500} />
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack >
        <Group>
          <Button
            component={Link}
            href="/"
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
          >
            Back to Home
          </Button>
        </Group>

        <Title order={1}>Research Paper Visualizations</Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: selectedData ? 8 : 12 }}>
            <Stack gap="md">
              <FilterControls
                visualizationType={visualizationType}
                chartType={chartType}
                filters={filters}
                onVisualizationTypeChange={(value) => {
                  if (value) {
                    setVisualizationType(value as VisualizationType);
                    setSelectedData(null);
                  }
                }}
                onChartTypeChange={(value) => {
                  if (value) {
                    setChartType(value as ChartType);
                  }
                }}
                onLimitChange={(value) => 
                  setFilters(prev => ({ ...prev, limit: Number(value) }))
                }
                onDateChange={(value) => 
                  setFilters(prev => ({
                    ...prev,
                    startDate: value[0]?.toISOString() || null,
                    endDate: value[1]?.toISOString() || null
                  }))
                }
              />

              <Paper shadow="xs" p="md" withBorder>
                <Suspense fallback={<Skeleton h={500} radius="md" />}>
                  {!loading && !selectedData && data.length > 0 && (
                    <Box pb="sm">
                      <Group justify="center" gap="xs">
                        <IconClick size={16} />
                        <Text size="sm" c="dimmed">
                          Click on any item to see related papers
                        </Text>
                      </Group>
                    </Box>
                  )}
                  <Charts
                    data={data}
                    loading={loading}
                    chartType={chartType}
                    visualizationType={visualizationType}
                    onDataClick={handleDataClick}
                  />
                </Suspense>
              </Paper>
            </Stack>
          </Grid.Col>

          {selectedData && (
            <Grid.Col span={{ base: 12, md: 4 }}>
              <SelectedPapers
                selectedData={selectedData}
                loadingPapers={loadingPapers}
              />
            </Grid.Col>
          )}
        </Grid>
      </Stack>
    </Container>
  );
}