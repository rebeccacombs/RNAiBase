import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { Space_Grotesk } from 'next/font/google'
import localFont from "next/font/local";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const logika = localFont({
  src: [
    {
      path: '/fonts/LogikaNova-Regular.woff2',
      weight: '400',
      style: 'regular',
    },
    {
      path: '/fonts/LogikaNova-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
    {
      path: '/fonts/LogikaNova-Italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '/fonts/LogikaNova-Light.woff2',
      weight: '300', 
      style: 'light',
    },
  ],
  variable: '--font-logika',  
  display: 'swap',
});


export const metadata = {
  title: 'RNAiBase',
  description: 'omnibus for RNA interference R&D.',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${logika.variable}`}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
      <MantineProvider theme={{...theme, 
      fontFamily: 'var(--font-logika)', headings: { fontFamily: 'var(--font-space-grotesk)' }}}>
            {children}</MantineProvider>
      </body>
    </html>
  );
}
