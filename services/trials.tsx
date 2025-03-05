import axios from 'axios';
import prisma from '@/lib/db';

const BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';

export const sirnaDrugs = [
  { name: 'patisiran'},
  { name: 'givosiran'},
  { name: 'lumasiran' },
  { name: 'inclisiran' },
  { name: 'nedosiran'},
  { name: 'vutrisiran'},
];

export async function fetchAndStoreTrials(): Promise<void> {
  try {
    for (const drugInfo of sirnaDrugs) {
      await prisma.rNAiDrug.upsert({
        where: { name: drugInfo.name },
        update: {},
        create: drugInfo,
      });
    }

    for (const drugInfo of sirnaDrugs) {
      console.log(`Fetching trials for: ${drugInfo.name}`);

      const response = await axios.get(BASE_URL, {
        params: {
          'query.intr': drugInfo.name,
          pageSize: 100,
        },
      });

      const drug = await prisma.rNAiDrug.findUnique({
        where: { name: drugInfo.name },
      });

      if (!drug) continue;

      const data = response.data;
      if (data.studies && Array.isArray(data.studies)) {
        for (const study of data.studies) {
          const protocolSection = study.protocolSection;

          const nctId = protocolSection?.identificationModule?.nctId;

          if (!nctId) continue;

          const trialData = {
            nctId,
            title: protocolSection?.identificationModule?.briefTitle || 'No title',
            status: protocolSection?.statusModule?.overallStatus || 'Unknown',
            phase: protocolSection?.designModule?.phases?.[0] || null,
            startDate: protocolSection?.statusModule?.startDateStruct?.date
              ? new Date(protocolSection.statusModule.startDateStruct.date)
              : null,
            completionDate: protocolSection?.statusModule?.completionDateStruct?.date
              ? new Date(protocolSection.statusModule.completionDateStruct.date)
              : null,
            conditions: protocolSection?.conditionsModule?.conditions || [],
            enrollment: protocolSection?.designModule?.enrollmentInfo?.count || null,
            locations:
              protocolSection?.contactsLocationsModule?.locations?.map(
                (loc: any) => `${loc.facility}, ${loc.city}, ${loc.country}`
              ) || [],
            interventions:
              protocolSection?.interventionsModule?.interventions?.map(
                (i: any) => i.interventionName
              ) || [],
            primaryOutcome: protocolSection?.outcomesModule?.primaryOutcomes?.[0]?.measure || null,
            sponsor: protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name || null,
            updateDate: new Date(),
            drugId: drug.id,

          };

          await prisma.clinicalTrial.upsert({
            where: { nctId },
            update: trialData,
            create: trialData,
          });
        }
      }
    }

    console.log('Successfully updated trials database');
  } catch (error) {
    console.error('Error fetching and storing trials:', error);
    throw error;
  }
}


export async function getStoredTrials() {
  return prisma.clinicalTrial.findMany({
    include: {
      drug: true,
    },
  });
}

export async function getTrialsForDrug(drugName: string) {
  return prisma.clinicalTrial.findMany({
    where: {
      drug: {
        name: drugName,
      },
    },
    include: {
      drug: true,
    },
  });
}