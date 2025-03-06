'use client';

import React, { memo } from 'react';
import { Box, Paper, Skeleton, Stack, Text } from '@mantine/core';
import dynamic from 'next/dynamic';
import classes from '../visualization.module.css';

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
      <Paper p="xl" withBorder className={classes.paperContainer}>
        <Stack align="center" gap="md">
          <Text size="lg" fw={500}>No data available</Text>
          <Text size="sm" c="dimmed" className={classes.smallText}>
            Try adjusting your filters or selecting a different visualization type
          </Text>
        </Stack>
      </Paper>
    );
  }

  if (!mounted) {
    return <Skeleton h={500} radius="md" />;
  }

  // Determine the appropriate container class based on chart type
  const containerClass = chartType === 'bar' 
    ? classes.barChartContainer 
    : chartType === 'pie' 
      ? classes.pieChartContainer 
      : classes.treemapChartContainer;

  // Determine the appropriate wrapper class based on chart type
  const wrapperClass = chartType === 'pie' ? classes.pieChartWrapper : classes.rechartsWrapper;

  return (
    <Box h={500} className={classes.chartContainer}>
      <div className={`${classes.chartBox} ${containerClass}`}>
        <RechartComponents
          data={data}
          chartType={chartType}
          visualizationType={visualizationType}
          onDataClick={onDataClick}
          className={classes.rechartsContainer}
          wrapperClassName={wrapperClass}
          smallAxisClassName={classes.smallAxisText}
          extraSmallAxisClassName={classes.extraSmallAxisText}
        />
      </div>
    </Box>
  );
});

Charts.displayName = 'Charts';

export default Charts;