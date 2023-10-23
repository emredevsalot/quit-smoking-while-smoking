import { createContext, useState, ReactNode, Context, useContext } from 'react';

import { DefaultSmokingData } from '../constants/DefaultSmokingData';
import { ISmokingData, SmokingContextType } from '../types';

export const SmokingContext = createContext<SmokingContextType | null>(null);

export const SmokingProvider = ({ children }: { children: ReactNode }) => {
  const [smokingData, setSmokingData] = useState<ISmokingData>(DefaultSmokingData);

  return (
    <SmokingContext.Provider value={{ smokingData, setSmokingData }}>
      {children}
    </SmokingContext.Provider>
  );
};

export const useSmokingData = () => {
  return useContext(SmokingContext) as SmokingContextType;
};
