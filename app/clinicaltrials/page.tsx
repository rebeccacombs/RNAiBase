import { Suspense } from 'react';
import prisma from '@/lib/db';
import ClinicalTrialsContent from './clinicalTrialsContent';
import ClinicalTrialsLoading from './ClinicalTrialsLoading';

export const metadata = {
  title: 'RNAi Drugs | RNAi Therapeutics Database',
  description: 'Browse RNAi therapeutic drugs and their clinical trials',
};

async function getDrugs() {
  try {
    const drugs = await prisma.rNAiDrug.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            clinicalTrials: true,
          },
        },
      },
    });

    return drugs.map((drug) => ({
      id: drug.id,
      name: drug.name,
      clinicalTrialsCount: drug._count.clinicalTrials,
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
