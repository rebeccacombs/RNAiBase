'use client';

import { Button, Stack, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Stack gap="xs">
      <Button variant="default" color="gray" radius="xl" onClick={() => setColorScheme('light')}>Light</Button>
      <Button variant="default" color="gray" radius="xl" onClick={() => setColorScheme('dark')}>Dark</Button>
      <Button variant="default" color="gray" radius="xl" onClick={() => setColorScheme('auto')}>Auto</Button>
    </Stack>
  );
}
