//app / papers / [slug] / page.tsx
'use client';

import React from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Stack,
  Button,
  Grid,
  Card,
  LoadingOverlay,
  rem,
} from '@mantine/core';
import { IconCalendar, IconLink, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Paper as PaperType } from '@/services/papers';

const BackButton = () => {
  const searchParams = useSearchParams();
  const backTo = searchParams.get('back');
  const backHref = backTo === 'visualizations' ? '/visualizations' : '/papers';
  const backLabel = backTo === 'visualizations' ? 'Visualizations' : 'Papers';

  return (
    <Button
      component={Link}
      href={backHref}
      variant="subtle"
      leftSection={<IconArrowLeft style={{ width: rem(16), height: rem(16) }} />}
      style={{ alignSelf: 'flex-start' }}
    >
      Back to {backLabel}
    </Button>
  );
};

export default function PaperDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const [paper, setPaper] = React.useState<PaperType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`/api/papers/${resolvedParams.slug}`);
        if (!response.ok) {
          throw new Error('Paper not found');
        }
        const data = await response.json();
        setPaper(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load paper');
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl" pos="relative" h={400}>
          <LoadingOverlay visible={loading} />
        </Paper>
      </Container>
    );
  }

  if (error || !paper) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl">
          <Stack align="center" gap="md">
            <Title order={2}>{error || 'Paper not found'}</Title>
            <BackButton />
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <BackButton />

        <Paper shadow="sm" p="xl" withBorder>
          <Stack gap="lg">
            {/* header */}
            <Group justify="space-between" align="flex-start">
              <Title order={2}>{paper.title}</Title>
              <Badge size="lg">PMID: {paper.PMID}</Badge>
            </Group>

            {/* meta info */}
            <Group>
              <Badge
                leftSection={
                  <IconCalendar style={{ width: rem(14), height: rem(14) }} />
                }
                variant="light"
              >
                {new Date(paper.pub_date).toLocaleDateString()}
              </Badge>
              <Badge variant="light" color="blue">
                {paper.journal}
              </Badge>
            </Group>

            {/* keywords */}
            <Group>
              {paper.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </Group>

            {/* content grid */}
            <Grid>
              {/* abstract */}
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card withBorder padding="lg">
                  <Stack gap="md">
                    <Title order={3}>Abstract</Title>
                    <Text>{paper.abstract}</Text>
                  </Stack>
                </Card>
              </Grid.Col>

              {/* details */}
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="md">
                  {/* authors */}
                  <Card withBorder padding="lg">
                    <Stack gap="xs">
                      <Title order={4}>Authors</Title>
                      {paper.authors.map((author) => (
                        <Text key={author} size="sm">
                          {author}
                        </Text>
                      ))}
                    </Stack>
                  </Card>

                  {/* affiliations */}
                  <Card withBorder padding="lg">
                    <Stack gap="xs">
                      <Title order={4}>Affiliations</Title>
                      {paper.affiliations.map((affiliation, index) => (
                        <Text key={index} size="sm">
                          {affiliation}
                        </Text>
                      ))}
                    </Stack>
                  </Card>

                  {/* external Link */}
                  <Button
                    component="a"
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={
                      <IconLink style={{ width: rem(16), height: rem(16) }} />
                    }
                    variant="light"
                    fullWidth
                  >
                    View on PubMed
                  </Button>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}