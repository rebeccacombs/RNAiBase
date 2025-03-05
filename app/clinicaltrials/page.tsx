// app/clinicaltrials/page.tsx (Server Component)
import { Suspense } from 'react';
import { Skeleton } from '@mantine/core';
import prisma from '@/lib/db';
import ClinicalTrialsContent from './clinicalTrialsContent';
import ClinicalTrialsLoading from './ClinicalTrialsLoading';

// This is a Server Component - no 'use client' here
export const metadata = {
  title: 'RNAi Drugs | RNAi Therapeutics Database',
  description: 'Browse RNAi therapeutic drugs and their clinical trials',
};

// Server-side data fetching - optimized with selective fields
async function getDrugs() {
  try {
    // Only fetch what we need for the initial list view
    const drugs = await prisma.rNAiDrug.findMany({
      select: {
        id: true,
        name: true,
        // Count the trials instead of fetching all data
        _count: {
          select: {
            clinicalTrials: true,
          },
        },
      },
    });

    // Transform the data to match the expected format
    return drugs.map(drug => ({
      id: drug.id,
      name: drug.name,
      clinicalTrialsCount: drug._count.clinicalTrials
    }));
  } catch (error) {
    console.error('Error fetching drugs:', error);
    throw new Error('Failed to fetch drugs');
  }
}

export default async function DrugsPage() {
  // Fetch data on the server
  const drugs = await getDrugs();
  
  // Pass data as props to client component
  return (
    <Suspense fallback={<ClinicalTrialsLoading />}>
      <ClinicalTrialsContent drugs={drugs} />
    </Suspense>
  );
}