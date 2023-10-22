import { ISmokingData } from '../types';

export const DefaultSmokingData: ISmokingData = {
  lastSmokeTime: new Date().getTime(),
  cooldownMinutes: 30,
  dailyCooldownIncrement: 1,
  smokeCount: 0,
};
