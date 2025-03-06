// app/visualizations/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Button,
  Stack,
  Skeleton,
  Tabs,
  Group,
} from '@mantine/core';
import { IconArrowLeft, IconFiles, IconFlask } from '@tabler/icons-react';
import Link from 'next/link';
import PaperVisualizations from './PaperVisualizations';
import ClinicalTrialVisualizations from './ClinicalTrialVisualizations';
import classes from './visualization.module.css'; // Import the CSS classes

// Shared types
export type DataType = 'papers' | 'trials';
export type ChartType = 'bar' | 'pie' | 'treemap';

export interface FilterState {
  limit: number;
  startDate: string | null;
  endDate: string | null;
  drugId?: string | null;
}

export interface ChartData {
  name: string;
  value: number;
}

// Main Component
export default function UnifiedVisualizationsPage() {
  const [mounted, setMounted] = useState(false);
  const [dataType, setDataType] = useState<DataType>('papers');
  
  useEffect(() => {
    setMounted(true);
  }, []);

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
    <Container size="xl" py="xl" className={classes.visualizationContainer}>
      <Stack>
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

        <Title order={1}>Research Visualizations</Title>

        {/* Tabs to switch between papers and trials */}
        <Tabs 
          value={dataType} 
          onChange={(value: string | null) => value && setDataType(value as DataType)}
          defaultValue="papers"
        >
          <Tabs.List>
            <Tabs.Tab value="papers" leftSection={<IconFiles size={16} />}>
              Research Papers
            </Tabs.Tab>
            <Tabs.Tab value="trials" leftSection={<IconFlask size={16} />}>
              Clinical Trials
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* Render the appropriate visualization component based on tab selection */}
        <div className={classes.visualizationWrapper}>
          {dataType === 'papers' ? (
            <PaperVisualizations />
          ) : (
            <ClinicalTrialVisualizations />
          )}
        </div>
      </Stack>
    </Container>
  );
}