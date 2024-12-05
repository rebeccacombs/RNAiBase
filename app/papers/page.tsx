'use client';

import React, { Suspense } from 'react';
import PapersPageContent from './papersPageContent';

export default function PapersPage() {
  return (
    <Suspense fallback={<div>Loading papers...</div>}>
      <PapersPageContent />
    </Suspense>
  );
}
