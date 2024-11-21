'use client';

import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  headings: {
    sizes: {
      h1: {
        fontWeight: '100',
        fontSize: rem(36),
        lineHeight: '1.4',
      },
      h2: { fontSize: rem(30), lineHeight: '1.5' },
      h6: { fontWeight: '900' },
    },
  },
});
