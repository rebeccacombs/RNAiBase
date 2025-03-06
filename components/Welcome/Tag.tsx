"use client"
import { ActionIcon, Anchor, Group, HoverCard, Stack, Text, Box } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import classes from './Welcome.module.css';
import { IconBrandGithub } from '@tabler/icons-react';

export function Tag() {
    return (
      <Group justify="center">
        <Box className={classes.tabletUp}>
          <HoverCard width={320} shadow="md" withArrow openDelay={200} closeDelay={400}>
            <HoverCard.Target>
              <ActionIcon
                variant="gradient"
                size="xl"
                aria-label="Gradient action icon"
                gradient={{ from: 'red', to: 'pink', deg: 90 }}
              >
                <IconHeart />
              </ActionIcon>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="md" className={classes.regularFont}>
                Made by Rebecca Combs and Chesney Birshing. 
              </Text>

              <Group justify="center">
                <Text size="md">
                  <b>View project code here:</b>
                </Text>
                <Anchor target="_blank" href="https://github.com/rebeccacombs/rnai_project" ><IconBrandGithub className={classes.tag} /></Anchor>
              </Group>
            </HoverCard.Dropdown>
          </HoverCard>
        </Box>
        
        {/* Simpler version for mobile that still allows credit */}
        <Box className={classes.mobileOnly}>
          <Anchor 
            href="https://github.com/rebeccacombs/rnai_project" 
            target="_blank"
          >
            <ActionIcon
              variant="gradient"
              size="md"
              aria-label="Project GitHub"
              gradient={{ from: 'blue', to: 'indigo', deg: 90 }}
            >
              <IconBrandGithub size="1rem" />
            </ActionIcon>
          </Anchor>
        </Box>
      </Group>
    );
  }