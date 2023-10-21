import { ISmokingData } from '../types';

export const DefaultSmokingData: ISmokingData = {
  lastSmokeTime: new Date().getTime(),
  cooldownMinutes: 38,
  smokeCount: 0,
};
