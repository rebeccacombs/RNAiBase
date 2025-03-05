'use client';

// app/clinicaltrials/ClinicalTrialsContent.tsx
import Link from 'next/link';
import { Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

// Type definitions
interface RNAiDrugSummary {
  id: string;
  name: string;
  clinicalTrialsCount: number;
}

interface ClinicalTrialsContentProps {
  drugs: RNAiDrugSummary[];
}

// Helper function to capitalize drug names
function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Client component that receives data as props
export default function ClinicalTrialsContent({ drugs }: ClinicalTrialsContentProps) {
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
          <Title order={1}>RNAi Therapeutic Drugs</Title>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drugs.map((drug) => (
            <Link 
              key={drug.id} 
              href={`/clinicaltrials/${encodeURIComponent(drug.name.toLowerCase())}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              prefetch={false} // Disable prefetching to reduce initial load
            >
              <Paper
                shadow="sm"
                p="lg"
                withBorder
                className="hover:shadow-lg transition-all duration-200 h-full"
              >
                <Stack gap="md">
                  <Title order={3}>
                    {capitalizeWords(drug.name)}
                  </Title>
                  <Text c="dimmed" size="sm">
                    {drug.clinicalTrialsCount} Clinical Trials
                  </Text>
                </Stack>
              </Paper>
            </Link>
          ))}
        </div>
      </Stack>
    </Container>
  );
}