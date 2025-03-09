import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import DrugDetailContent from './DrugDetailContent';
import DrugDetailLoading from './DrugDetailLoading';

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

async function getDrugWithTrials(name: string) {
  try {
    const decodedName = decodeURIComponent(name.toLowerCase());
    const drug = await prisma.rNAiDrug.findUnique({
      where: { name: decodedName },
    });

    if (!drug) return null;

    const trials = await prisma.clinicalTrial.findMany({
      where: {
        drugId: drug.id,
      },
      orderBy: {
        updateDate: 'desc',
      },
      take: 10, 
    });

    return {
      ...drug,
      clinicalTrials: trials,
      hasMoreTrials: trials.length === 10, 
    };
  } catch (error) {
    console.error('Error fetching drug details:', error);
    throw new Error('Failed to fetch drug details');
  }
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const drug = await prisma.rNAiDrug.findUnique({
    where: { name: decodeURIComponent(resolvedParams.name.toLowerCase()) },
    select: { name: true }, 
  });

  if (!drug) return { title: 'Drug Not Found' };

  return {
    title: `${drug.name} Clinical Trials | RNAi Therapeutics Database`,
    description: `View clinical trials for the RNAi therapeutic ${drug.name}`,
  };
}

function LoadingFallback() {
  return <DrugDetailLoading />;
}

export default async function DrugPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DrugDetails params={params} />
    </Suspense>
  );
}

async function DrugDetails({ params }: { params: PageProps['params'] }) {
  const resolvedParams = await params;
  const drug = await getDrugWithTrials(resolvedParams.name);

  if (!drug) {
    notFound();
  }
  
  return <DrugDetailContent drug={drug} />;
}
