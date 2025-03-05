'use client';

// app/clinicaltrials/[name]/DrugDetailContent.tsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IconArrowLeft, IconArrowUp, IconChevronDown } from '@tabler/icons-react';
import {
  Affix,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  Transition,
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';

// Type definitions
interface ClinicalTrial {
  id: string;
  nctId: string;
  title: string;
  status: string;
  phase: string | null;
  startDate: Date | null;
  completionDate: Date | null;
  conditions: string[];
  sponsor: string | null;
  primaryOutcome: string | null;
  locations: string[];
  interventions: string[];
  enrollment: number | null;
}

interface RNAiDrug {
  id: string;
  name: string;
  targetGene: string | null;
  manufacturer: string | null;
  description: string | null;
  mechanism: string | null;
  clinicalTrials: ClinicalTrial[];
  hasMoreTrials?: boolean;
}

interface DrugDetailContentProps {
  drug: RNAiDrug;
}

// Helper function to capitalize drug names
function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Status color mapping function with hex values
function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    RECRUITING: '#2563EB', 
    ACTIVE_NOT_RECRUITING: '#696969',
    COMPLETED: '#10B981', 
    APPROVED_FOR_MARKETING: '#0D9488', 
    NOT_YET_RECRUITING: '#FBBF24', 
    NO_LONGER_AVAILABLE: '#6B7280', 
    TERMINATED: '#EF4444', 
    WITHDRAWN: '#9CA3AF', 
    SUSPENDED: '#F97316', 
    ENROLLING_BY_INVITATION: '#6366F1', 
    UNKNOWN_STATUS: '#9CA3AF', 
  };


  if (statusMap[status]) {
    return statusMap[status];
  }


  const statusLower = status.toLowerCase();
  for (const [key, value] of Object.entries(statusMap)) {
    if (statusLower.includes(key.toLowerCase().replace(/_/g, ' '))) {
      return value;
    }
  }


  return '#3B82F6'; 
}


function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}


export default function DrugDetailContent({ drug }: DrugDetailContentProps) {
  const [trials, setTrials] = useState(drug.clinicalTrials);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(drug.hasMoreTrials || false);
  const [skip, setSkip] = useState(drug.clinicalTrials.length);
  const [scroll, scrollTo] = useWindowScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to load more trials
  const loadMoreTrials = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/clinical-trials/drug/${drug.id}?skip=${skip}&take=10`);
      const data = await response.json();

      if (data.trials.length > 0) {
        setTrials((prevTrials) => [...prevTrials, ...data.trials]);
        setSkip(skip + data.trials.length);
        setHasMore(data.trials.length === 10); // Assume there are more if we got a full page
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more trials:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Using scrollTo as a fallback
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Capitalize the drug name for display
  const displayName = capitalizeWords(drug.name);

  return (
    <Container size="xl" py="xl" ref={containerRef}>
      <Stack gap="xl">
        <div>
          <Button
            component={Link}
            href="/clinicaltrials"
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            mb="md"
          >
            Back to Drugs
          </Button>

          <Title order={1}>{displayName}</Title>
        </div>

        {/* Drug Information Card */}
        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Title order={2}>Drug Information</Title>

            <Group align="flex-start">
              <Stack gap="xs" style={{ flex: 1 }}>
                {drug.targetGene && (
                  <Text>
                    <Text span fw={700}>
                      Target Gene:
                    </Text>{' '}
                    {drug.targetGene}
                  </Text>
                )}

                {drug.manufacturer && (
                  <Text>
                    <Text span fw={700}>
                      Manufacturer:
                    </Text>{' '}
                    {drug.manufacturer}
                  </Text>
                )}

                {drug.mechanism && (
                  <Text>
                    <Text span fw={700}>
                      Mechanism of Action:
                    </Text>{' '}
                    {drug.mechanism}
                  </Text>
                )}
              </Stack>
            </Group>

            {drug.description && (
              <>
                <Text fw={700}>Description:</Text>
                <Text>{drug.description}</Text>
              </>
            )}
          </Stack>
        </Paper>

        <Divider />

        <div>
          <Title order={2}>Clinical Trials ({trials.length})</Title>
          <Text size="sm" c="dimmed" mt="xs">
            Showing clinical trials for {displayName}
          </Text>
        </div>

        <Stack gap="lg">
          {trials.map((trial) => (
            <Paper key={trial.id} shadow="sm" p="lg" withBorder>
              <Stack gap="md">
                {/* Title in its own section */}
                <Title order={3}>{trial.title}</Title>

                {/* Status and phase in their own row */}
                <Group gap="xs">
                  <Badge
                    style={{
                      backgroundColor: getStatusColor(trial.status),
                      color: 'white',
                    }}
                    size="md"
                  >
                    {formatStatus(trial.status)}
                  </Badge>
                  {trial.phase && (
                    <Badge variant="light" size="md">
                      {trial.phase}
                    </Badge>
                  )}
                </Group>

                {trial.conditions.length > 0 && (
                  <div>
                    <Text fw={500} mb="xs">
                      Conditions:
                    </Text>
                    <Group gap="xs">
                      {trial.conditions.map((condition) => (
                        <Badge key={condition} variant="outline" size="sm">
                          {condition}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                )}

                {trial.interventions.length > 0 && (
                  <div>
                    <Text fw={500} mb="xs">
                      Interventions:
                    </Text>
                    <Group gap="xs">
                      {trial.interventions.map((intervention) => (
                        <Badge key={intervention} color="blue" variant="outline" size="sm">
                          {intervention}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                )}

                <Group>
                  <Text size="sm">
                    <Text span fw={700}>
                      NCT ID:
                    </Text>{' '}
                    {trial.nctId}
                  </Text>
                  {trial.enrollment && (
                    <Text size="sm">
                      <Text span fw={700}>
                        Enrollment:
                      </Text>{' '}
                      {trial.enrollment} participants
                    </Text>
                  )}
                </Group>

                {trial.sponsor && (
                  <Text size="sm">
                    <Text span fw={700}>
                      Sponsor:
                    </Text>{' '}
                    {trial.sponsor}
                  </Text>
                )}

                {trial.primaryOutcome && (
                  <Text size="sm">
                    <Text span fw={700}>
                      Primary Outcome:
                    </Text>{' '}
                    {trial.primaryOutcome}
                  </Text>
                )}

                <Group>
                  {trial.startDate && (
                    <Text size="sm">
                      <Text span fw={700}>
                        Start Date:
                      </Text>{' '}
                      {new Date(trial.startDate).toLocaleDateString()}
                    </Text>
                  )}
                  {trial.completionDate && (
                    <Text size="sm">
                      <Text span fw={700}>
                        Completion Date:
                      </Text>{' '}
                      {new Date(trial.completionDate).toLocaleDateString()}
                    </Text>
                  )}
                </Group>

                {trial.locations.length > 0 && (
                  <div>
                    <Group mb="xs" align="center">
                      <Text size="sm" fw={700}>
                        Locations:
                      </Text>
                      {trial.locations.length > 3 && (
                        <Badge color="black" size="sm">
                          Scrollable
                        </Badge>
                      )}
                    </Group>

                    <Paper
                      withBorder
                      p="xs"
                      style={{
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                      }}
                    >
                      <ScrollArea h={100} scrollbarSize={6} offsetScrollbars>
                        <Stack gap="xs">
                          {trial.locations.map((location, index) => (
                            <Text key={index} size="sm">
                              • {location}
                            </Text>
                          ))}
                        </Stack>
                      </ScrollArea>
                    </Paper>
                  </div>
                )}
              </Stack>
            </Paper>
          ))}

          {hasMore && (
            <Button
              onClick={loadMoreTrials}
              variant="outline"
              loading={isLoadingMore}
              leftSection={!isLoadingMore && <IconChevronDown size={16} />}
            >
              {isLoadingMore ? 'Loading...' : 'Load More Trials'}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Jump to top button */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 300}>
          {(transitionStyles) => (
            <Button
              leftSection={<IconArrowUp size={16} />}
              style={transitionStyles}
              onClick={scrollToTop}
              color="blue"
            >
              Jump to Top
            </Button>
          )}
        </Transition>
      </Affix>
    </Container>
  );
}
