export type MeterState = 'IDLE' | 'DRIVING' | 'WAITING';

export interface DailyStat {
  date: string; // YYYY-MM-DD
  totalEarnings: number;
  totalTimeSeconds: number;
  driveTimeSeconds: number;
  waitTimeSeconds: number;
  distanceKm: number;
}

export interface UserSettings {
  monthlySalary: number;
  workDaysPerMonth: number;
  hoursPerDay: number;
  jumpUnit: number; // The visual jump amount (e.g. 0.1 or 0.5)
}

export const DEFAULT_SETTINGS: UserSettings = {
  monthlySalary: 15000,
  workDaysPerMonth: 21.75,
  hoursPerDay: 8,
  jumpUnit: 0.1,
};
