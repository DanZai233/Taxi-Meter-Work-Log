import { DailyStat, UserSettings, DEFAULT_SETTINGS } from '../types';

export const STORAGE_KEYS = {
  SETTINGS: 'taxi_meter_settings',
  DAILY_STATS: 'taxi_meter_daily_stats',
  CURRENT_SESSION: 'taxi_meter_current_session',
};

export function loadSettings(): UserSettings {
  const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (saved) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: UserSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadDailyStats(): DailyStat[] {
  const saved = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveDailyStat(stat: DailyStat) {
  const stats = loadDailyStats();
  const existingIndex = stats.findIndex((s) => s.date === stat.date);
  
  if (existingIndex >= 0) {
    // Merge stats
    stats[existingIndex] = {
      ...stats[existingIndex],
      totalEarnings: stats[existingIndex].totalEarnings + stat.totalEarnings,
      totalTimeSeconds: stats[existingIndex].totalTimeSeconds + stat.totalTimeSeconds,
      driveTimeSeconds: stats[existingIndex].driveTimeSeconds + stat.driveTimeSeconds,
      waitTimeSeconds: stats[existingIndex].waitTimeSeconds + stat.waitTimeSeconds,
      distanceKm: stats[existingIndex].distanceKm + stat.distanceKm,
    };
  } else {
    stats.push(stat);
  }
  
  localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
}
