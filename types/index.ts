export interface ISmokingData {
  lastSmokeTime: number;
  cooldownMinutes: number;
  dailyCooldownIncrement: number;
  morningStartTime: number;
  morningCooldownMinutes: number;
  morningCooldownIncrement: number;
  morningTimerStarted: boolean;
  smokeCount: number;
}

export type SmokingContextType = {
  smokingData: ISmokingData;
  setSmokingData: (smokingData: ISmokingData) => void;
};
