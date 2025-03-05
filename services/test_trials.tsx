import {
  fetchAndStoreTrials,
  getStoredTrials,
  getTrialsForDrug,
  sirnaDrugs,
} from './trials';

async function testFetch() {
  try {
    // Fetch and store all trials
    //await fetchAndStoreTrials();
    //console.log('Completed fetching and storing trials');

    // Get total trials
    const allTrials = await getStoredTrials();
    console.log(`\nTotal number of trials stored: ${allTrials.length}`);

    // Get trials for each drug
    console.log('\nBreakdown by drug:');
    for (const drug of sirnaDrugs) {
      const drugTrials = await getTrialsForDrug(drug.name);
      console.log(`${drug.name}: ${drugTrials.length} trials`);

      // Optional: Print trial phases if you want more detail
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
      console.log(''); // Add blank line between drugs
    }
  } catch (error) {
    console.error('Error in test:', error);
  }
}

testFetch();
