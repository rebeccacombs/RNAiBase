// app/visualizations/PaperVisualizations.tsx
'use client';

import React, { useCallback, memo, Suspense, useState, useEffect } from 'react';
import {
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
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconChartBar, IconChartPie, IconChartTreemap, IconClick } from '@tabler/icons-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChartType, FilterState, ChartData } from './page';

// Types
type PaperVisualizationType = 'keywords' | 'journals' | 'authors' | 'timeline';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  pub_date: Date;
  PMID: number;
  slug: string;
}

interface SelectedPaperData {
  label: string;
  papers: Paper[];
}

// Props interfaces for chart components
interface PaperChartsProps {
  data: ChartData[];
  loading: boolean;
  chartType: ChartType;
  visualizationType: PaperVisualizationType;
  onDataClick: (entry: any) => void;
}

// Dynamic import of Charts components with proper typing
const PaperCharts = dynamic<PaperChartsProps>(
  () => import('./components/Charts'),
  { 
    ssr: false,
    loading: () => <Skeleton h={500} radius="md" />
  }
);

// Memoized Components for Papers
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

// Filter controls component
const FilterControls = memo(({ 
  visualizationType,
  chartType,
  filters,
  onVisualizationTypeChange,
  onChartTypeChange,
  onLimitChange,
  onDateChange,
}: {
  visualizationType: PaperVisualizationType;
  chartType: ChartType;
  filters: FilterState;
  onVisualizationTypeChange: (value: string | null) => void;
  onChartTypeChange: (value: string | null) => void;
  onLimitChange: (value: number | string) => void;
  onDateChange: (value: [Date | null, Date | null]) => void;
}) => {
  // Paper visualization types
  const paperVisualizationTypes = [
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
            data={paperVisualizationTypes}
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

// Selected items display component
const SelectedPapers = memo(({ 
  selectedData, 
  loadingPapers 
}: { 
  selectedData: SelectedPaperData;
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

// Custom hook for data fetching - papers
function usePaperVisualizationData(visualizationType: PaperVisualizationType, filters: FilterState) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
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
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [visualizationType, filters]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData();
    return () => abortController.abort();
  }, [fetchData]);

  return { data, loading };
}

// Main Paper Visualizations Component
export default function PaperVisualizations() {
  const [paperVisualizationType, setPaperVisualizationType] = useState<PaperVisualizationType>('keywords');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedPaperData, setSelectedPaperData] = useState<SelectedPaperData | null>(null);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    limit: 20,
    startDate: null,
    endDate: null,
  });

  // Get data based on the currently selected type
  const paperData = usePaperVisualizationData(paperVisualizationType, filters);

  // Fetch papers data when a visualization item is clicked
  const fetchPapersData = useCallback(async (label: string) => {
    setLoadingPapers(true);
    try {
      const params = new URLSearchParams({
        type: paperVisualizationType,
        value: label,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`/api/visualizations?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch papers');
      const result = await response.json();
      
      if (result.papers) {
        setSelectedPaperData({
          label,
          papers: result.papers
        });
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
      setSelectedPaperData({
        label,
        papers: []
      });
    } finally {
      setLoadingPapers(false);
    }
  }, [paperVisualizationType, filters.startDate, filters.endDate]);

  // Handle click on a data point
  const handleDataClick = useCallback((entry: any) => {
    if (entry && entry.name) {
      fetchPapersData(entry.name);
    }
  }, [fetchPapersData]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: selectedPaperData ? 8 : 12 }}>
        <Stack gap="md">
          <FilterControls
            visualizationType={paperVisualizationType}
            chartType={chartType}
            filters={filters}
            onVisualizationTypeChange={(value) => {
              if (value) {
                setPaperVisualizationType(value as PaperVisualizationType);
                setSelectedPaperData(null);
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
              {!paperData.loading && !selectedPaperData && paperData.data.length > 0 && (
                <Box pb="sm">
                  <Group justify="center" gap="xs">
                    <IconClick size={16} />
                    <Text size="sm" c="dimmed">
                      Click on any item to see related papers
                    </Text>
                  </Group>
                </Box>
              )}
              
              <PaperCharts
                data={paperData.data}
                loading={paperData.loading}
                chartType={chartType}
                visualizationType={paperVisualizationType}
                onDataClick={handleDataClick}
              />
            </Suspense>
          </Paper>
        </Stack>
      </Grid.Col>

      {/* Show selected papers panel if papers are selected */}
      {selectedPaperData && (
        <Grid.Col span={{ base: 12, md: 4 }}>
          <SelectedPapers
            selectedData={selectedPaperData}
            loadingPapers={loadingPapers}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}