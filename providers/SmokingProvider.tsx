import { createContext, useState, ReactNode, useContext, useEffect } from 'react';

import { DefaultSmokingData } from '../constants/DefaultSmokingData';
import { ISmokingData, SmokingContextType } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SmokingContext = createContext<SmokingContextType | null>(null);

export const SmokingProvider = ({ children }: { children: ReactNode }) => {
  const [smokingData, setSmokingData] = useState<ISmokingData>(DefaultSmokingData);

  // Load smoking data from AsyncStorage
  const loadSmokingData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('smokingData');
      if (storedData) {
        setSmokingData(JSON.parse(storedData));
      } else {
        setSmokingData(DefaultSmokingData);
        AsyncStorage.setItem('smokingData', JSON.stringify(DefaultSmokingData));
      }
    } catch (error) {
      console.error('Error loading smoking data:', error);
    }
    console.log('Loaded smoking data successfully.');
  };

  // Load smoking data when the component mounts.
  useEffect(() => {
    loadSmokingData();
  }, []);

  return (
    <SmokingContext.Provider value={{ smokingData, setSmokingData }}>
      {children}
    </SmokingContext.Provider>
  );
};

export const useSmokingData = () => {
  return useContext(SmokingContext) as SmokingContextType;
};
