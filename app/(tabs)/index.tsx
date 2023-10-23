// TODO: Button will come from Themed components as well.
import { useState, useEffect } from 'react';
import { StyleSheet, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import { Text, View } from '../../components/Themed';
import { useSmokingData } from '../../providers/SmokingProvider';
import useSmokingDataLoader from '../../hooks/useSmokingDataLoader';

export default function TabOneScreen() {
  const { smokingData, setSmokingData } = useSmokingData();
  useSmokingDataLoader({ setSmokingData });

  const [timeLeft, setTimeLeft] = useState(smokingData.cooldownMinutes * 60 * 1000);
  const [isCooldownCompleted, setIsCooldownCompleted] = useState(false);

  // TESTING:
  console.log('timeleft: ', moment.utc(timeLeft).format('HH:mm:ss'));

  // Function to update the timer
  const updateTimer = () => {
    if (smokingData.lastSmokeTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - smokingData.lastSmokeTime;
      const remainingTime = smokingData.cooldownMinutes * 60 * 1000 - elapsedTime;

      setTimeLeft(Math.abs(remainingTime));

      if (remainingTime < 0) {
        setIsCooldownCompleted(true);
      } else {
        setIsCooldownCompleted(false);
      }
      // FIX: This part is executed if the user hasn't smoked yet or resetted the smoking data.
      // We hardcode 2 seconds now. If we don't do this, timeLeft stays where it was
      // before resetting the smoking data. We can do something else here.
      // else{setTimeLeft(2000);}
      // 2_FIX: Now that we use context, "smokingData.lastSmokeTime"
      // probably will never be null. Testing without else statement right now.
    }
  };

  // Update the timer every second
  useEffect(() => {
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, [smokingData]);

  const handleSmokeButtonClick = () => {
    const currentTime = new Date().getTime();
    const lastSmokeDate = new Date(smokingData.lastSmokeTime);
    const currentSmokeDate = new Date(currentTime);

    const updatedSmokingData = {
      ...smokingData,
      smokeCount: smokingData.smokeCount + 1,
      lastSmokeTime: currentTime,
    };

    // Increase cooldown by chosen amount(default: 1 minute)
    // if a new day has started since the last smoke
    if (
      lastSmokeDate.getFullYear() !== currentSmokeDate.getFullYear() ||
      lastSmokeDate.getMonth() !== currentSmokeDate.getMonth() ||
      lastSmokeDate.getDate() !== currentSmokeDate.getDate()
    ) {
      updatedSmokingData.cooldownMinutes += smokingData.dailyCooldownIncrement;
    }

    setSmokingData(updatedSmokingData);

    // Save updated smoking data to AsyncStorage.
    AsyncStorage.setItem('smokingData', JSON.stringify(updatedSmokingData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isCooldownCompleted ? 'Going extra for: ' : 'Time left: '}
        {moment.utc(timeLeft).format('HH:mm:ss')}
      </Text>
      <Text>Cooldown: {smokingData.cooldownMinutes} minutes</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>
        Last cigarette at:{' '}
        {smokingData.lastSmokeTime && moment(smokingData.lastSmokeTime).format('hh:mm:ss a')}
      </Text>
      <Text>
        You can smoke at:{' '}
        {moment(smokingData.lastSmokeTime + smokingData.cooldownMinutes * 60 * 1000).format(
          'hh:mm:ss a',
        )}
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="Smoke" onPress={handleSmokeButtonClick} />
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
