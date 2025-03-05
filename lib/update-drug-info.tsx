// lib/update-drug-info.ts
import prisma from '@/lib/db';

const rnaIDrugInfo = [
    {
        name: 'patisiran',
        targetGene: 'Transthyretin mRNA (TTR)',
        manufacturer: 'Alnylam Pharmaceuticals',
        description:
          'Patisiran (brand name Onpattro) is an RNAi therapeutic approved for the treatment of hereditary transthyretin-mediated amyloidosis (hATTR). It was the first FDA-approved siRNA drug, receiving approval in 2018.',
        mechanism:
          'Patisiran works by silencing TTR gene expression in the liver through RNA interference. The drug contains siRNA encapsulated in lipid nanoparticles that deliver the siRNA to hepatocytes, where it specifically targets TTR mRNA, reducing the production of both mutant and wild-type TTR protein.',
      },
      {
        name: 'givosiran',
        targetGene: 'Delta-aminolevulinate synthase 1 (ALAS1)',
        manufacturer: 'Alnylam Pharmaceuticals',
        description:
          'Givosiran (brand name Givlaari) is an RNAi therapeutic approved for the treatment of acute hepatic porphyria (AHP). It received FDA approval in 2019.',
        mechanism:
          'Givosiran targets the ALAS1 (aminolevulinic acid synthase 1) mRNA in hepatocytes, reducing the accumulation of neurotoxic intermediates aminolevulinic acid (ALA) and porphobilinogen (PBG) that cause the characteristic attacks and chronic symptoms of acute hepatic porphyria.',
      },
      {
        name: 'lumasiran',
        targetGene: 'Hydroxyacid oxidase (glycolate oxidase) 1 (HAO1)',
        manufacturer: 'Alnylam Pharmaceuticals',
        description:
          'Lumasiran (brand name Oxlumo) is approved for the treatment of primary hyperoxaluria type 1 (PH1), a rare genetic disorder that causes recurrent kidney stones and can lead to kidney failure. It received FDA approval on November 23, 2020.',
        mechanism:
          'Lumasiran targets the hydroxyacid oxidase 1 (HAO1) gene, which encodes glycolate oxidase. By silencing this enzyme, lumasiran reduces the production of oxalate, the substance that builds up in patients with PH1 causing kidney damage.',
      },
      {
        name: 'inclisiran',
        targetGene: 'Proprotein convertase subtilisin/kexin type 9 (PCSK9)',
        manufacturer: 'Novartis',
        description:
          'Inclisiran (brand name Leqvio) is an RNAi therapeutic initially approved for the treatment of heterozygous familial hypercholesterolemia (HeFH) and clinical atherosclerotic cardiovascular disease (ASCVD) as an adjunct to maximally tolerated statin therapy. It received FDA approval in 2021. In July 2023, the FDA approved an expanded indication for inclisiran for LDL-C lowering in patients with primary hyperlipidemia.',
        mechanism:
          'Inclisiran is a small interfering RNA (siRNA) that targets PCSK9 (proprotein convertase subtilisin/kexin type 9) mRNA in the liver, reducing its production. By lowering PCSK9 protein levels, the drug increases LDL receptor recycling and expression on hepatocyte cell surfaces, resulting in increased LDL-C clearance and reduced circulating LDL-C levels.',
      },
      {
        name: 'nedosiran',
        targetGene: 'Lactate dehydrogenase A (LDHA)',
        manufacturer: 'Dicerna Pharmaceuticals',
        description:
          'Nedosiran (brand name Rivfloza) is an RNAi therapeutic approved by the FDA on October 2, 2023, for the treatment of primary hyperoxaluria type 1 (PH1) in children and adults.',
        mechanism:
          'Nedosiran targets the lactate dehydrogenase A (LDHA) gene, which is involved in the final common step in oxalate production. By silencing LDHA expression in the liver, nedosiran reduces oxalate production in patients with PH1.',
      },
      {
        name: 'vutrisiran',
        targetGene: 'Transthyretin mRNA (TTR)',
        manufacturer: 'Alnylam Pharmaceuticals',
        description:
          'Vutrisiran (brand name Amvuttra) is an RNAi therapeutic approved for the treatment of the polyneuropathy of hereditary transthyretin-mediated (hATTR) amyloidosis in adults. It received FDA approval in 2022.',
        mechanism:
          'Like patisiran, vutrisiran targets TTR mRNA to reduce the production of TTR protein. However, vutrisiran utilizes a next-generation delivery platform with N-acetylgalactosamine (GalNAc) conjugation, allowing for subcutaneous administration and less frequent dosing compared to patisiran.',
      },
];

export async function updateRNAiDrugInfo(): Promise<void> {
  try {
    console.log('Starting update of RNAi drug information...');
    
    for (const drugInfo of rnaIDrugInfo) {
      console.log(`Updating information for ${drugInfo.name}...`);
      
      await prisma.rNAiDrug.update({
        where: { name: drugInfo.name.toLowerCase() },
        data: {
          targetGene: drugInfo.targetGene,
          manufacturer: drugInfo.manufacturer,
          description: drugInfo.description,
          mechanism: drugInfo.mechanism
        }
      });
      
      console.log(`Successfully updated information for ${drugInfo.name}`);
    }
    
    console.log('All RNAi drug information updated successfully!');
  } catch (error) {
    console.error('Error updating RNAi drug information:', error);
    throw error;
  }
}

// You can run this function directly:
// updateRNAiDrugInfo().catch(console.error);