'use client';

import { Anchor, Container, Group, Text } from '@mantine/core';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <Group justify="center" className={classes.inner}>
          <Text size="xs" fw={500}>
            © {new Date().getFullYear()} By Rebecca Combs & Chesney Birshing. DKU Signature Work.
          </Text>
          <Anchor href="https://forms.gle/1NHXpsvyXJ17aFNo7" target="_blank" fw={700} size="xs">
            Share feedback here!
          </Anchor>
        </Group>
      </Container>
    </footer>
  );
}
