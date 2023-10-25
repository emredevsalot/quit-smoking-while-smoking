import { ISmokingData } from '../types';

export const DefaultSmokingData: ISmokingData = {
  lastSmokeTime: new Date().getTime(),
  cooldownMinutes: 30,
  dailyCooldownIncrement: 1,
  morningStartTime: new Date().getTime(),
  morningCooldownMinutes: 20,
  morningCooldownIncrement: 2,
  morningTimerStarted: false,
  smokeCount: 0,
};
