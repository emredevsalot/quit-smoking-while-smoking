import { useState, useEffect } from 'react';
import { StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, View } from '../../components/Themed';
import { useSmokingData } from '../../providers/SmokingProvider';

import { ISmokingData } from '../../types';
import moment from 'moment';

export default function MorningScreen() {
  const { smokingData, setSmokingData } = useSmokingData();

  const [timeLeft, setTimeLeft] = useState(smokingData.morningCooldownMinutes * 60 * 1000);

  // Function to update the timer
  const updateTimer = () => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - smokingData.morningStartTime;
    const remainingTime = smokingData.morningCooldownMinutes * 60 * 1000 - elapsedTime;

    if (remainingTime > 0) {
      setTimeLeft(remainingTime);
    } else {
      const updatedSmokingData: ISmokingData = {
        ...smokingData,
        morningTimerStarted: false,
      };

      setSmokingData(updatedSmokingData);

      // Save updated smoking data to AsyncStorage.
      AsyncStorage.setItem('smokingData', JSON.stringify(updatedSmokingData));
    }
  };

  // Update the timer every second if it's started
  useEffect(() => {
    if (smokingData.morningTimerStarted) {
      const timerInterval = setInterval(updateTimer, 1000);
      return () => clearInterval(timerInterval); // Cleanup on unmount
    }
  }, [smokingData.morningTimerStarted]);

  const handleWakeUpButtonClick = () => {
    const currentTime = new Date().getTime();

    const updatedSmokingData: ISmokingData = {
      ...smokingData,
      morningStartTime: currentTime,
      morningTimerStarted: true,
      morningCooldownMinutes:
        smokingData.morningCooldownMinutes + smokingData.morningCooldownIncrement,
    };

    setSmokingData(updatedSmokingData);

    // Save updated smoking data to AsyncStorage.
    AsyncStorage.setItem('smokingData', JSON.stringify(updatedSmokingData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sunEmoji}>☀️</Text>
      <Text style={styles.greeting}>Good morning!</Text>
      {/* Both values are the same only when they are set to their default values. 
          This means the app is being launched for the first time or when the settings have been reset.
          In these cases, we can't display the time left information or the 'completed for' date information.*/}
      {smokingData.lastSmokeTime !== smokingData.morningStartTime && (
        <Text style={styles.title}>
          {smokingData.morningTimerStarted
            ? `Time left: ${moment.utc(timeLeft).format('HH:mm:ss')}`
            : `Completed for ${moment(smokingData.morningStartTime).format('DD.MM.YYYY')}`}
        </Text>
      )}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button
        title="I woke up"
        onPress={handleWakeUpButtonClick}
        disabled={smokingData.morningTimerStarted}
      />
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
    textAlign: 'center',
  },
  separator: {
    marginVertical: 1,
    height: 1,
    width: '80%',
  },
  greeting: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  sunEmoji: {
    fontSize: 40,
  },
});
