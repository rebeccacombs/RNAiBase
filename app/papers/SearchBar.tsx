// app/papers/SearchBar.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { IconAdjustments, IconFilter, IconInfoCircle, IconSearch } from '@tabler/icons-react';
import {
  Accordion,
  Box,
  Button,
  Grid,
  Group,
  List,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import classes from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (params: URLSearchParams) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const searchParams = useSearchParams();
  const [journals, setJournals] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState(searchParams.get('search') || '');
  const [journalValue, setJournalValue] = React.useState(searchParams.get('journal') || '');
  const [sortValue, setSortValue] = React.useState(searchParams.get('sort') || 'pub_date_desc');
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([null, null]);

  // fetch journals for dropdown
  React.useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await fetch('/api/journals');
        if (!response.ok) throw new Error('Failed to fetch journals');
        const data = await response.json();
        setJournals(data);
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    };
    fetchJournals();
  }, []);

  // update search when values change
  const updateSearch = React.useCallback(() => {
    const params = new URLSearchParams();

    if (searchValue) params.set('search', searchValue);
    if (journalValue) params.set('journal', journalValue);
    if (sortValue) params.set('sort', sortValue);
    if (dateRange[0]) params.set('startDate', dateRange[0].toISOString());
    if (dateRange[1]) params.set('endDate', dateRange[1].toISOString());

    onSearch(params);
  }, [searchValue, journalValue, sortValue, dateRange, onSearch]);

  // debounce search updates
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [updateSearch]);

  const handleReset = () => {
    setSearchValue('');
    setJournalValue('');
    setSortValue('pub_date_desc');
    setDateRange([null, null]);
    onSearch(new URLSearchParams());
  };

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Stack gap="md">
        <TextInput
          className={classes.searchInput}
          placeholder="Search papers by title, abstract, authors, or keywords..."
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          size="md"
        />

        <Stack gap="xs">
          <Accordion variant="contained">
            <Accordion.Item value="tips">
              <Accordion.Control>
                <Group gap="xs">
                  <IconInfoCircle size={16} />
                  <span>Search Tips</span>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <List size="sm" spacing="xs">
                  <List.Item>
                    Search for authors using "author:" prefix (e.g., "author:John")
                  </List.Item>
                  <List.Item>
                    Combine title and author search with semicolon (e.g., "machine learning;
                    author:Smith")
                  </List.Item>
                  <List.Item>
                    Use partial names for authors (e.g., "author:rob" will match "Robert",
                    "Robertson", etc.)
                  </List.Item>
                  <List.Item>All searches are case-insensitive</List.Item>
                  <List.Item>Separate multiple search terms with spaces</List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Accordion variant="contained">
            <Accordion.Item value="filters">
              <Accordion.Control>
                <Group gap="xs">
                  <IconAdjustments size={16} />
                  <span>Advanced Filters</span>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="Sort by"
                      placeholder="Select sort order"
                      data={[
                        { value: 'pub_date_desc', label: 'Newest First' },
                        { value: 'pub_date_asc', label: 'Oldest First' },
                        { value: 'title_asc', label: 'Title A-Z' },
                        { value: 'title_desc', label: 'Title Z-A' },
                      ]}
                      value={sortValue}
                      onChange={(value) => value && setSortValue(value)}
                    />
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                      label="Journal"
                      placeholder="Filter by journal"
                      data={[
                        { value: '', label: 'All Journals' },
                        ...journals.map((j) => ({ value: j, label: j })),
                      ]}
                      searchable
                      clearable
                      value={journalValue}
                      onChange={(value) => setJournalValue(value || '')}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <DatePickerInput
                      type="range"
                      label="Publication Date Range"
                      placeholder="Select date range"
                      value={dateRange}
                      onChange={(value: [Date | null, Date | null]) => setDateRange(value)}
                      clearable
                      size="sm"
                    />
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>

        <Group justify="flex-end">
          <Button variant="subtle" onClick={handleReset} leftSection={<IconFilter size={16} />}>
            Reset Filters
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
