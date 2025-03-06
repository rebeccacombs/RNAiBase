// app/visualizations/ClinicalTrialVisualizations.tsx
'use client';

import React, { memo, Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { IconChartBar, IconChartPie, IconChartTreemap, IconClick } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Grid,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { ChartData, ChartType, FilterState } from './page';

// Types
type TrialVisualizationType = 'phases' | 'status' | 'sponsors' | 'timeline' | 'conditions';

interface ClinicalTrial {
  id: string;
  nctId: string;
  title: string;
  phase: string;
  status: string;
  sponsor: string;
  startDate: Date;
  primaryCompletionDate: Date | null;
  studyType: string;
  conditions: string[];
  interventions: string[];
  drugId: string;
  drugName?: string;
}

interface SelectedTrialData {
  label: string;
  trials: ClinicalTrial[];
}

// Props interfaces for chart components
interface TrialChartsProps {
  data: ChartData[];
  loading: boolean;
  chartType: ChartType;
  visualizationType: TrialVisualizationType;
  onDataClick: (entry: any) => void;
}

// Dynamic import of Charts components with proper typing
const TrialCharts = dynamic<TrialChartsProps>(() => import('./components/TrialCharts'), {
  ssr: false,
  loading: () => <Skeleton h={500} radius="md" />,
});

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Updated TrialCard component to match PaperCard pattern
const TrialCard = memo(({ trial }: { trial: ClinicalTrial }) => (
  <Box
    component={Link}
    href={`/clinicaltrials/${encodeURIComponent(trial.drugName?.toLowerCase() || '')}?back=visualizations#trial-${trial.nctId}`}
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <Paper withBorder p="xs" className="hover:shadow-md transition-all duration-200">
      <Stack gap="xs">
        <Text fw={500} lineClamp={2}>
          {trial.title}
        </Text>
        <Group gap="xs" wrap="nowrap">
          <Badge color={getPhaseColor(trial.phase)}>{trial.phase || 'Not Specified'}</Badge>
          <Badge color={getStatusColor(trial.status)}>{trial.status || 'Unknown'}</Badge>
        </Group>
        <Group gap="xs" wrap="nowrap">
          <Text size="sm" c="dimmed">
            {trial.startDate ? new Date(trial.startDate).toLocaleDateString() : 'Date unknown'}
          </Text>
          <Text size="sm" c="dimmed">
            •
          </Text>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {trial.sponsor || 'Unknown sponsor'}
          </Text>
        </Group>
        {trial.drugName && (
          <Group gap="xs" wrap="nowrap">
            <Text size="sm" fw={700}>
              {trial.drugName}
            </Text>
          </Group>
        )}
      </Stack>
    </Paper>
  </Box>
));

TrialCard.displayName = 'TrialCard';

// Updated helper functions for styling to match DrugDetailContent.tsx
function getPhaseColor(phase: string): string {
  if (!phase) return 'gray';

  // Match phase styling with a more specific color scheme
  if (phase.includes('1/2')) return '#0ea5e9'; // cyan-500
  if (phase.includes('2/3')) return '#0d9488'; // teal-600
  if (phase.includes('1')) return '#2563eb'; // blue-600
  if (phase.includes('2')) return '#06b6d4'; // cyan-600
  if (phase.includes('3')) return '#0f766e'; // teal-700
  if (phase.includes('4')) return '#059669'; // green-600

  return '#6b7280'; // gray-500
}

function getStatusColor(status: string): string {
  if (!status) return '#9ca3af'; // gray-400

  const statusMap: Record<string, string> = {
    RECRUITING: '#2563eb', // blue-600
    ACTIVE_NOT_RECRUITING: '#696969', // gray
    COMPLETED: '#10b981', // green-500
    APPROVED_FOR_MARKETING: '#0d9488', // teal-600
    NOT_YET_RECRUITING: '#fbbf24', // amber-400
    NO_LONGER_AVAILABLE: '#6b7280', // gray-500
    TERMINATED: '#ef4444', // red-500
    WITHDRAWN: '#9ca3af', // gray-400
    SUSPENDED: '#f97316', // orange-500
    ENROLLING_BY_INVITATION: '#6366f1', // indigo-500
    UNKNOWN_STATUS: '#9ca3af', // gray-400
  };

  // Try direct match first
  if (statusMap[status.toUpperCase()]) {
    return statusMap[status.toUpperCase()];
  }

  // Then try substring match (case insensitive)
  const statusLower = status.toLowerCase();
  for (const [key, value] of Object.entries(statusMap)) {
    if (statusLower.includes(key.toLowerCase().replace(/_/g, ' '))) {
      return value;
    }
  }

  return '#3b82f6'; // blue-500 default
}

// Filter controls component
const FilterControls = memo(
  ({
    visualizationType,
    chartType,
    filters,
    onVisualizationTypeChange,
    onChartTypeChange,
    onLimitChange,
    onDateChange,
    onDrugChange,
    drugsList,
  }: {
    visualizationType: TrialVisualizationType;
    chartType: ChartType;
    filters: FilterState;
    onVisualizationTypeChange: (value: string | null) => void;
    onChartTypeChange: (value: string | null) => void;
    onLimitChange: (value: number | string) => void;
    onDateChange: (value: [Date | null, Date | null]) => void;
    onDrugChange: (value: string | null) => void;
    drugsList: { value: string; label: string }[];
  }) => {
    // Trial visualization types
    const trialVisualizationTypes = [
      { value: 'phases', label: 'Trial Phases' },
      { value: 'status', label: 'Trial Status' },
      { value: 'sponsors', label: 'Top Sponsors' },
      { value: 'timeline', label: 'Trials Timeline' },
      { value: 'conditions', label: 'Conditions Studied' },
    ];

    const chartTypeData = [
      { value: 'bar', label: 'Bar Chart' },
      { value: 'pie', label: 'Pie Chart' },
      { value: 'treemap', label: 'Treemap' },
    ];

    const getChartTypeIcon = (type: ChartType) => {
      switch (type) {
        case 'bar':
          return <IconChartBar size={16} />;
        case 'pie':
          return <IconChartPie size={16} />;
        case 'treemap':
          return <IconChartTreemap size={16} />;
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
              data={trialVisualizationTypes}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 2 }}>
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

          <Grid.Col span={{ base: 12, md: 3 }}>
            <DatePickerInput
              type="range"
              label="Date Range"
              placeholder="Filter by date range"
              value={[
                filters.startDate ? new Date(filters.startDate) : null,
                filters.endDate ? new Date(filters.endDate) : null,
              ]}
              onChange={onDateChange}
              clearable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 2 }}>
            <Select
              label="Drug"
              value={filters.drugId || null}
              onChange={onDrugChange}
              data={drugsList}
              clearable
              placeholder="All Drugs"
            />
          </Grid.Col>
        </Grid>
      </Paper>
    );
  }
);

FilterControls.displayName = 'FilterControls';

const SelectedTrials = memo(
  ({
    selectedData,
    loadingTrials,
  }: {
    selectedData: SelectedTrialData;
    loadingTrials: boolean;
  }) => (
    <Paper shadow="xs" p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Selected: {selectedData.label}</Title>
          <Badge size="lg">
            {loadingTrials ? 'Loading...' : `${selectedData.trials.length} trials`}
          </Badge>
        </Group>

        <ScrollArea.Autosize mah={600}>
          {loadingTrials ? (
            <Stack gap="xs">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} h={80} radius="sm" />
              ))}
            </Stack>
          ) : (
            <Stack gap="xs">
              {selectedData.trials.map((trial) => (
                <TrialCard key={trial.id} trial={trial} />
              ))}
            </Stack>
          )}
        </ScrollArea.Autosize>
      </Stack>
    </Paper>
  )
);

SelectedTrials.displayName = 'SelectedTrials';

// Custom hook for data fetching - trials
function useTrialVisualizationData(
  visualizationType: TrialVisualizationType,
  filters: FilterState
) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: visualizationType,
        limit: filters.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.drugId && { drugId: filters.drugId }),
      });

      const response = await fetch(`/api/clinical-trials/visualizations?${params.toString()}`);
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

// Custom hook for fetching available drugs
function useDrugsList() {
  const [drugs, setDrugs] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function fetchDrugs() {
      try {
        const response = await fetch('/api/clinical-trials/drug');
        if (!response.ok) throw new Error('Failed to fetch drugs');
        const result = await response.json();

        const formattedDrugs = result.drugs.map((drug: any) => ({
          value: drug.id,
          label: drug.name,
        }));

        setDrugs(formattedDrugs);
      } catch (error) {
        console.error('Error fetching drugs:', error);
        setDrugs([]);
      }
    }

    fetchDrugs();
  }, []);

  return drugs;
}

// Main Clinical Trial Visualizations Component
export default function ClinicalTrialVisualizations() {
  const [trialVisualizationType, setTrialVisualizationType] =
    useState<TrialVisualizationType>('phases');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedTrialData, setSelectedTrialData] = useState<SelectedTrialData | null>(null);
  const [loadingTrials, setLoadingTrials] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    limit: 20,
    startDate: null,
    endDate: null,
    drugId: null,
  });

  const trialData = useTrialVisualizationData(trialVisualizationType, filters);
  const drugsList = useDrugsList();

  // Fetch trials data when a visualization item is clicked
  const fetchTrialsData = useCallback(
    async (label: string) => {
      setLoadingTrials(true);
      try {
        const params = new URLSearchParams({
          type: trialVisualizationType,
          value: label,
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(filters.drugId && { drugId: filters.drugId }),
        });

        const response = await fetch(
          `/api/clinical-trials/visualizations/trials?${params.toString()}`
        );
        if (!response.ok) throw new Error('Failed to fetch trials');
        const result = await response.json();

        if (result.trials) {
          setSelectedTrialData({
            label,
            trials: result.trials,
          });
        }
      } catch (error) {
        console.error('Error fetching trials:', error);
        setSelectedTrialData({
          label,
          trials: [],
        });
      } finally {
        setLoadingTrials(false);
      }
    },
    [trialVisualizationType, filters.startDate, filters.endDate, filters.drugId]
  );

  // Handle click on a data point
  const handleDataClick = useCallback(
    (entry: any) => {
      if (entry && entry.name) {
        fetchTrialsData(entry.name);
      }
    },
    [fetchTrialsData]
  );

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: selectedTrialData ? 8 : 12 }}>
        <Stack gap="md">
          <FilterControls
            visualizationType={trialVisualizationType}
            chartType={chartType}
            filters={filters}
            drugsList={drugsList}
            onVisualizationTypeChange={(value) => {
              if (value) {
                setTrialVisualizationType(value as TrialVisualizationType);
                setSelectedTrialData(null);
              }
            }}
            onChartTypeChange={(value) => {
              if (value) {
                setChartType(value as ChartType);
              }
            }}
            onLimitChange={(value) => setFilters((prev) => ({ ...prev, limit: Number(value) }))}
            onDateChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                startDate: value[0]?.toISOString() || null,
                endDate: value[1]?.toISOString() || null,
              }))
            }
            onDrugChange={(value) => setFilters((prev) => ({ ...prev, drugId: value }))}
          />

          <Paper shadow="xs" p="md" withBorder>
            <Suspense fallback={<Skeleton h={500} radius="md" />}>
              {!trialData.loading && !selectedTrialData && trialData.data.length > 0 && (
                <Box pb="sm">
                  <Group justify="center" gap="xs">
                    <IconClick size={16} />
                    <Text size="sm" c="dimmed">
                      Click on any item to see related trials
                    </Text>
                  </Group>
                </Box>
              )}

              <TrialCharts
                data={trialData.data}
                loading={trialData.loading}
                chartType={chartType}
                visualizationType={trialVisualizationType}
                onDataClick={handleDataClick}
              />
            </Suspense>
          </Paper>
        </Stack>
      </Grid.Col>

      {/* Show selected trials panel if trials are selected */}
      {selectedTrialData && (
        <Grid.Col span={{ base: 12, md: 4 }}>
          <SelectedTrials selectedData={selectedTrialData} loadingTrials={loadingTrials} />
        </Grid.Col>
      )}
    </Grid>
  );
}
