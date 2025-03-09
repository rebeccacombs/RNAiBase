'use client';

import { Button, Container, Group, Paper, Skeleton, Stack, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export default function ClinicalTrialsLoading() {
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
          {Array(6).fill(0).map((_, index) => (
            <Paper
              key={index}
              shadow="sm"
              p="lg"
              withBorder
              className="h-full"
            >
              <Stack gap="md">
                <Skeleton height={28} width="70%" />
                <Skeleton height={16} width="40%" />
              </Stack>
            </Paper>
          ))}
        </div>
      </Stack>
    </Container>
  );
}