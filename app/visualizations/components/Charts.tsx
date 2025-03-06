'use client';

import React, { memo, useMemo } from 'react';
import { Box, Paper, Skeleton, Stack, Text } from '@mantine/core';
import dynamic from 'next/dynamic';

// Dynamically import Recharts components with no SSR
const RechartComponents = dynamic(
  () => import('./RechartComponents'), 
  { 
    ssr: false,
    loading: () => <Skeleton h={500} radius="md" />
  }
);

interface ChartData {
  name: string;
  value: number;
}

interface ChartsProps {
  data: ChartData[];
  loading: boolean;
  chartType: 'bar' | 'pie' | 'treemap';
  visualizationType: 'keywords' | 'journals' | 'authors' | 'timeline';
  onDataClick: (entry: any) => void;
}

// Main Charts component
const Charts = memo(({ data, loading, chartType, visualizationType, onDataClick }: ChartsProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return <Skeleton h={500} radius="md" />;
  }

  if (!data.length) {
    return (
      <Paper p="xl" withBorder>
        <Stack align="center" gap="md">
          <Text size="lg" fw={500}>No data available</Text>
          <Text size="sm" c="dimmed">Try adjusting your filters or selecting a different visualization type</Text>
        </Stack>
      </Paper>
    );
  }

  if (!mounted) {
    return <Skeleton h={500} radius="md" />;
  }

  return (
    <Box h={500}>
      <RechartComponents
        data={data}
        chartType={chartType}
        visualizationType={visualizationType}
        onDataClick={onDataClick}
      />
    </Box>
  );
});

Charts.displayName = 'Charts';

export default Charts;