import {
  fetchAndStoreTrials,
  getStoredTrials,
  getTrialsForDrug,
  sirnaDrugs,
} from './trials';

async function testFetch() {
  try {
    const allTrials = await getStoredTrials();
    console.log(`\nTotal number of trials stored: ${allTrials.length}`);

    console.log('\nBreakdown by drug:');
    for (const drug of sirnaDrugs) {
      const drugTrials = await getTrialsForDrug(drug.name);
      console.log(`${drug.name}: ${drugTrials.length} trials`);

      const phaseBreakdown = drugTrials.reduce(
        (acc, trial) => {
          const phase = trial.phase || 'Unknown';
          acc[phase] = (acc[phase] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      Object.entries(phaseBreakdown).forEach(([phase, count]) => {
        console.log(`  - ${phase}: ${count} trials`);
      });
      console.log('');
    }
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testFetch();
