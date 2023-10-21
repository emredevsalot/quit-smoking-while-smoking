import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISmokingData } from '../types';

/**
 * A custom React hook for loading smoking data from AsyncStorage when a component mounts.
 * This hook is useful for initializing smoking data in your component.
 *
 * @param {Object} options - An object containing a `setSmokingData` callback function.
 *
 * @example
 * ```javascript
 * // Usage in a React component:
 * const MyComponent = () => {
 *   const [smokingData, setSmokingData] = useState(initialSmokingData);
 *   useSmokingDataLoader({ setSmokingData });
 *
 *   // ... rest of your component code ...
 * }
 * ```
 * @note
 * - This hook does not have an explicit return value. It loads smoking data into the component state
 *   via the provided `setSmokingData` function when the component mounts.
 * - It catches and logs any errors that occur during data loading from AsyncStorage.
 */
const useSmokingDataLoader = ({
  setSmokingData,
}: {
  setSmokingData: (smokingData: ISmokingData) => void;
}) => {
  // Load smoking data from AsyncStorage
  const loadSmokingData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('smokingData');
      if (storedData) {
        setSmokingData(JSON.parse(storedData));
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
};

export default useSmokingDataLoader;
