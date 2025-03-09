'use client';

import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { Badge, Button, Container, Divider, Group, Paper, Skeleton, Stack, Text, Title } from '@mantine/core';
import { useParams } from 'next/navigation';

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DrugDetailLoading() {
  const params = useParams();
  const drugName = typeof params.name === 'string' ? params.name : '';
  const displayName = drugName 
    ? capitalizeWords(decodeURIComponent(drugName)) 
    : 'Loading...';

  return (
    <Container size="xl" py="xl">
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

          <Title order={1}>
            {displayName}
          </Title>
        </div>

        <Paper shadow="sm" p="lg" withBorder>
          <Stack gap="md">
            <Title order={2}>Drug Information</Title>

            <Stack gap="md">
              <Skeleton height={20} width="40%" />
              <Skeleton height={20} width="60%" />
              <Skeleton height={20} width="50%" />
              <Skeleton height={100} />
            </Stack>
          </Stack>
        </Paper>

        <Divider />

        <div>
          <Title order={2}>Clinical Trials</Title>
          <Text size="sm" c="dimmed" mt="xs">
            Loading trials for {displayName}...
          </Text>
        </div>

        <Stack gap="lg">
          {Array(3).fill(0).map((_, index) => (
            <Paper key={index} shadow="sm" p="lg" withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Skeleton height={28} width="70%" />
                  <Group gap="xs">
                    <Skeleton height={24} width={80} />
                    <Skeleton height={24} width={80} />
                  </Group>
                </Group>

                <Stack gap="sm">
                  <Skeleton height={16} width="80%" />
                  <Skeleton height={16} width="60%" />
                  <Skeleton height={16} width="40%" />
                </Stack>

                <Group>
                  <Skeleton height={16} width="30%" />
                  <Skeleton height={16} width="30%" />
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}