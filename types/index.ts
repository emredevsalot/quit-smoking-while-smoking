export interface ISmokingData {
  lastSmokeTime: number;
  cooldownMinutes: number;
  smokeCount: number;
}

export type SmokingContextType = {
  smokingData: ISmokingData;
  setSmokingData: (smokingData: ISmokingData) => void;
};
