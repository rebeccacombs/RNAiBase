'use client';

import { IconBrandGithub, IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Group, Stack, useMantineColorScheme } from '@mantine/core';
import classes from '../Welcome/Welcome.module.css';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <>
      {/* Desktop view with text buttons */}
      <Box className={classes.desktopOnly}>
        <Stack gap="xs" align="center">
          <Button
            variant="default"
            color="gray"
            radius="xl"
            onClick={() => setColorScheme('light')}
            fullWidth
          >
            Light
          </Button>
          <Button
            variant="default"
            color="gray"
            radius="xl"
            onClick={() => setColorScheme('dark')}
            fullWidth
          >
            Dark
          </Button>
          <Button
            variant="default"
            color="gray"
            radius="xl"
            onClick={() => setColorScheme('auto')}
            fullWidth
          >
            Auto
          </Button>
          <ActionIcon
            component="a"
            href="https://github.com/rebeccacombs/RNAiBase"
            target="_blank"
            variant="default"
            color="gray"
            radius="xl"
            size="lg"
          >
            <IconBrandGithub size="1.2rem" />
          </ActionIcon>
        </Stack>
      </Box>

      {/* Mobile view with icon buttons */}
      <Box className={classes.mobileOnly}>
        <Group gap="xs">
          <ActionIcon
            variant="default"
            color="gray"
            radius="xl"
            onClick={() => setColorScheme('light')}
            size="lg"
          >
            <IconSun size="1.2rem" />
          </ActionIcon>
          <ActionIcon
            variant="default"
            color="gray"
            radius="xl"
            onClick={() => setColorScheme('dark')}
            size="lg"
          >
            <IconMoon size="1.2rem" />
          </ActionIcon>
          <ActionIcon
            variant="default"
            color="gray"
            radius="xl"
            onClick={() => setColorScheme('auto')}
            size="lg"
          >
            <IconDeviceDesktop size="1.2rem" />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://github.com/rebeccacombs/RNAiBase"
            target="_blank"
            variant="default"
            color="gray"
            radius="xl"
            size="lg"
          >
            <IconBrandGithub size="1.2rem" />
          </ActionIcon>
        </Group>
      </Box>
    </>
  );
}
