'use client';

// app/clinicaltrials/ClinicalTrialsContent.tsx
import { useState } from 'react';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { Box, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';

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
  // Track which drug card is being hovered
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

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

        {/* Using a flex container instead of grid for more control */}
        <div className="flex flex-wrap gap-8">
          {drugs.map((drug) => {
            const isHovered = hoveredCardId === drug.id;

            return (
              <div
                key={drug.id}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] pb-10"
                onMouseEnter={() => setHoveredCardId(drug.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <Link
                  href={`/clinicaltrials/${encodeURIComponent(drug.name.toLowerCase())}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    height: '100%',
                  }}
                  prefetch={false}
                >
                  <Paper
                    shadow={isHovered ? 'md' : 'sm'}
                    p="lg"
                    withBorder
                    className={`
                      transition-all duration-300 h-full
                      ${isHovered ? 'transform translate-y-[-4px] shadow-lg border-blue-400' : ''}
                    `}
                    style={{
                      borderColor: isHovered ? '#4dabf7' : undefined,
                      backgroundColor: isHovered ? '#f8faff' : undefined,
                    }}
                  >
                    <Stack className="h-full">
                      <Title order={3} className={isHovered ? 'text-blue-600' : ''}>
                        {capitalizeWords(drug.name)}
                      </Title>

                      <Text size="sm" fw={500} className={isHovered ? 'font-medium' : ''}>
                        {drug.clinicalTrialsCount} Clinical Trials
                      </Text>
                    </Stack>
                  </Paper>
                </Link>
              </div>
            );
          })}
        </div>
      </Stack>
    </Container>
  );
}
