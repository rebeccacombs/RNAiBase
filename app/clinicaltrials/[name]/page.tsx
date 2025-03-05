// app/clinicaltrials/[name]/page.tsx (Server Component)
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import DrugDetailContent from './DrugDetailContent';
import DrugDetailLoading from './DrugDetailLoading';

// This is a Server Component - no 'use client' here
interface PageProps {
  params: {
    name: string;
  };
}

// Server-side data fetching with optimization
async function getDrugWithTrials(name: string) {
  try {
    // Decode the URL parameter and convert to proper case
    const decodedName = decodeURIComponent(name.toLowerCase());

    // First fetch just the drug info without trials
    const drug = await prisma.rNAiDrug.findUnique({
      where: { name: decodedName },
    });

    if (!drug) return null;

    // Then fetch trials in a separate query with pagination
    // This avoids loading all trials at once and allows streaming
    const trials = await prisma.clinicalTrial.findMany({
      where: {
        drugId: drug.id,
      },
      orderBy: {
        updateDate: 'desc',
      },
      take: 10, // Limit initial load to 10 trials
    });

    // Combine the data
    return {
      ...drug,
      clinicalTrials: trials,
      hasMoreTrials: trials.length === 10, // Flag if there are likely more trials
    };
  } catch (error) {
    console.error('Error fetching drug details:', error);
    throw new Error('Failed to fetch drug details');
  }
}

export async function generateMetadata({ params }: PageProps) {
  // Await params first
  const resolvedParams = await Promise.resolve(params);
  const drug = await prisma.rNAiDrug.findUnique({
    where: { name: decodeURIComponent(resolvedParams.name.toLowerCase()) },
    select: { name: true }, // Only fetch the name for metadata
  });

  if (!drug) return { title: 'Drug Not Found' };

  return {
    title: `${drug.name} Clinical Trials | RNAi Therapeutics Database`,
    description: `View clinical trials for the RNAi therapeutic ${drug.name}`,
  };
}

// Use a separate loading component to avoid params issue
function LoadingFallback() {
  return <DrugDetailLoading />;
}

export default async function DrugPage({ params }: PageProps) {
  // Immediately render the loading state with a component that doesn't use params
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DrugDetails params={params} />
    </Suspense>
  );
}

// Separate async component to handle data fetching
async function DrugDetails({ params }: { params: PageProps['params'] }) {
  // Await params first
  const resolvedParams = await Promise.resolve(params);
  const drug = await getDrugWithTrials(resolvedParams.name);

  if (!drug) {
    notFound();
  }

  // Pass data as props to client component
  return <DrugDetailContent drug={drug} />;
}