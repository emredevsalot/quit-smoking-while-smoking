import { createContext, useState, ReactNode } from 'react';

import { DefaultSmokingData } from '../constants/DefaultSmokingData';
import { ISmokingData, SmokingContextType } from '../types';

export const SmokingContext = createContext<SmokingContextType | null>(null);

const SmokingProvider = ({ children }: { children: ReactNode }) => {
  const [smokingData, setSmokingData] = useState<ISmokingData>(DefaultSmokingData);

  return (
    <SmokingContext.Provider value={{ smokingData, setSmokingData }}>
      {children}
    </SmokingContext.Provider>
  );
};

export default SmokingProvider;
