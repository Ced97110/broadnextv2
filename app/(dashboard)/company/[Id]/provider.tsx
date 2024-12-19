'use client';

import { CompanyRelation } from '@/app/types/types';
import { createContext, useContext } from 'react';



interface CompanyContextValue {
  companyRelation: CompanyRelation | null;
}

// Create the context
const CompanyContext = createContext<CompanyContextValue>({ companyRelation: null });

// Export a hook for convenience
export const useCompany = () => useContext(CompanyContext);

// Provider Component
export function Providers({ children, companyRelation }: { children: React.ReactNode; companyRelation: CompanyRelation }) {
  return (
    <CompanyContext.Provider value={{ companyRelation }}>
      {children}
    </CompanyContext.Provider>
  );
}