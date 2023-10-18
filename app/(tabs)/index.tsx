// TODO: Button will come from Themed components as well.
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import { StyleSheet, Button } from 'react-native';
import { Text, View } from '../../components/Themed';

export default function TabOneScreen() {
  const INITIAL_COOLDOWN_MINUTES = 35;
  const [habitData, setHabitData] = useState({
    lastSmokeTime: new Date().getTime(),
    cooldownMinutes: INITIAL_COOLDOWN_MINUTES,
    smokeCount: 0,
  });
  const [timeLeft, setTimeLeft] = useState(habitData.cooldownMinutes * 60 * 1000);
  const [isCooldownCompleted, setIsCooldownCompleted] = useState(false);
  // TESTING:
  console.log('timeleft: ', timeLeft);

  // Function to update the timer
  const updateTimer = () => {
    if (habitData.lastSmokeTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - habitData.lastSmokeTime;
      const remainingTime = habitData.cooldownMinutes * 60 * 1000 - elapsedTime;

      setTimeLeft(Math.abs(remainingTime));

      if (remainingTime < 0) {
        setIsCooldownCompleted(true);
      } else {
        setIsCooldownCompleted(false);
      }
    } else {
      // FIX: This part is executed if the user hasn't smoked yet or resetted the habit data.
      // We hardcode 2 seconds now. If we don't do this, timeLeft stays where it was
      // before resetting the habit data. We can do something else here.
      setTimeLeft(2000);
    }
  };

  // Update the timer every second
  useEffect(() => {
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, [habitData]);

  // Load habit data from AsyncStorage
  const loadHabitData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('habitData');
      if (storedData) {
        setHabitData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading habit data:', error);
    }
  };

  // Load habit data and check permissions when the component mounts.
  useEffect(() => {
    loadHabitData();
  }, []);

  const handleResetButtonClick = async () => {
    // Reset habit data to initial state.
    const initialHabitData = {
      lastSmokeTime: new Date().getTime(),
      cooldownMinutes: INITIAL_COOLDOWN_MINUTES,
      smokeCount: 0,
    };

    setHabitData(initialHabitData);

    // Save the initial state to AsyncStorage.
    await AsyncStorage.setItem('habitData', JSON.stringify(initialHabitData));
  };

  const handleSmokeButtonClick = () => {
    const currentTime = new Date().getTime();
    const lastSmokeDate = new Date(habitData.lastSmokeTime);
    const currentSmokeDate = new Date(currentTime);

    const newHabitData = {
      ...habitData,
      smokeCount: habitData.smokeCount + 1,
      lastSmokeTime: currentTime,
    };

    // Increase cooldown by 1 minute if a new day
    // has started since the last smoke
    if (
      lastSmokeDate.getFullYear() !== currentSmokeDate.getFullYear() ||
      lastSmokeDate.getMonth() !== currentSmokeDate.getMonth() ||
      lastSmokeDate.getDate() !== currentSmokeDate.getDate()
    ) {
      newHabitData.cooldownMinutes += 1;
    }

    setHabitData(newHabitData);

    // Save updated habit data to AsyncStorage.
    AsyncStorage.setItem('habitData', JSON.stringify(newHabitData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isCooldownCompleted ? 'Going extra for: ' : 'Time left: '}
        {moment.utc(timeLeft).format('HH:mm:ss')}
      </Text>
      <Text>Cooldown: {habitData.cooldownMinutes} minutes</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>Smoke count: {habitData.smokeCount}</Text>
      <Text>
        Last smoked:{' '}
        {habitData.lastSmokeTime && moment(habitData.lastSmokeTime).format('hh:mm:ss a')}
      </Text>
      <Text>
        Next cigarette at:{' '}
        {moment(habitData.lastSmokeTime + habitData.cooldownMinutes * 60 * 1000).format(
          'hh:mm:ss a',
        )}
      </Text>
      <Button title="Smoke" onPress={handleSmokeButtonClick} />
      <Button title="Reset Habit Data" onPress={handleResetButtonClick} />
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
