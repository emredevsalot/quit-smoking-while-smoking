import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, View } from '../../components/Themed';
import { SmokingContext } from '../../providers/SmokingProvider';
import useSmokingDataLoader from '../../hooks/useSmokingDataLoader';

import { DefaultSmokingData } from '../../constants/DefaultSmokingData';
import { ISmokingData, SmokingContextType } from '../../types';

export default function TabTwoScreen() {
  const { smokingData, setSmokingData } = useContext(SmokingContext) as SmokingContextType;
  useSmokingDataLoader({ setSmokingData });

  // States to keep track of the setting input fields and error message
  const [dailyCooldownIncrement, setDailyCooldownIncrement] = useState<number>(
    smokingData.dailyCooldownIncrement,
  );
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(smokingData.cooldownMinutes);
  const [inputError, setInputError] = useState<string | null>(null);

  // In case the cooldown changes in the main tab,
  // update the cooldown minutes in the settings UI
  useEffect(() => {
    setCooldownMinutes(smokingData.cooldownMinutes);
  }, [smokingData.cooldownMinutes]);

  const updateStateAndSave = (newData: ISmokingData) => {
    setSmokingData(newData);

    // Save updated smoking data to AsyncStorage.
    AsyncStorage.setItem('smokingData', JSON.stringify(newData));
  };

  const handleSaveSettings = async () => {
    const updatedSmokingData = {
      ...smokingData,
      dailyCooldownIncrement: dailyCooldownIncrement,
      cooldownMinutes: cooldownMinutes,
    };

    updateStateAndSave(updatedSmokingData);
  };

  const handleResetButtonClick = async () => {
    const newSmokingData = { ...DefaultSmokingData, lastSmokeTime: new Date().getTime() };

    // Reset in the UI
    setDailyCooldownIncrement(DefaultSmokingData.dailyCooldownIncrement);
    setCooldownMinutes(DefaultSmokingData.cooldownMinutes);

    updateStateAndSave(newSmokingData);
  };

  const handleInputChange = (
    inputText: string,
    setFunction: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    // If the input is empty, set the state to 0 and clear any previous error.
    if (inputText === '') {
      setFunction(0);
      setInputError(null);
    } else {
      // If the value is not a valid positive number or zero, set an error message.
      // Otherwise, set the state with the parsed value and clear any previous error
      const parsedValue = parseInt(inputText);
      if (isNaN(parsedValue) || parsedValue < 0) {
        setInputError('Please enter a valid positive number or zero');
        // Clear the error message after 3 seconds
        setTimeout(() => setInputError(null), 3000);
      } else {
        setFunction(parsedValue);
        setInputError(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Cooldown minutes */}
      <Text>Current cooldown (minutes):</Text>
      <TextInput
        style={styles.input}
        value={cooldownMinutes.toString()}
        onChangeText={(inputText: string) => handleInputChange(inputText, setCooldownMinutes)}
        keyboardType="numeric"
        accessibilityLabel="Current cooldown between cigarettes in minutes"
      />
      {/* Daily cooldown increment */}
      <Text>Daily cooldown increment (minutes):</Text>
      <TextInput
        style={styles.input}
        value={dailyCooldownIncrement.toString()}
        onChangeText={(text: string) => handleInputChange(text, setDailyCooldownIncrement)}
        keyboardType="numeric"
        accessibilityLabel="Daily cooldown increment between cigarettes in minutes"
      />
      {inputError && <Text style={styles.error}>{inputError}</Text>}
      <Button title="Save Settings" onPress={handleSaveSettings} />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>Total Cigarettes: {smokingData.smokeCount}</Text>
      <Button title="Reset All to Default" onPress={handleResetButtonClick} />
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 6,
    width: '30%',
    textAlign: 'center',
  },
  error: {
    border: '1px solid gray',
    padding: 8,
    marginVertical: 8,
  },
});
