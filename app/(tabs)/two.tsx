import { useContext } from 'react';
import { StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, View } from '../../components/Themed';
import { SmokingContext } from '../../providers/SmokingProvider';
import useSmokingDataLoader from '../../hooks/useSmokingDataLoader';

import { DefaultSmokingData } from '../../constants/DefaultSmokingData';
import { SmokingContextType } from '../../types';

export default function TabTwoScreen() {
  const { smokingData, setSmokingData } = useContext(SmokingContext) as SmokingContextType;
  useSmokingDataLoader({ setSmokingData });

  const handleResetButtonClick = async () => {
    setSmokingData({ ...DefaultSmokingData, lastSmokeTime: new Date().getTime() });

    // Save the initial state to AsyncStorage.
    await AsyncStorage.setItem('smokingData', JSON.stringify(DefaultSmokingData));
  };

  return (
    <View style={styles.container}>
      <Text>Current cooldown: {smokingData.cooldownMinutes} minutes</Text>
      <Text>Total Cigarettes: {smokingData.smokeCount}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="Reset Smoking Data" onPress={handleResetButtonClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 1,
    height: 1,
    width: '80%',
  },
});
