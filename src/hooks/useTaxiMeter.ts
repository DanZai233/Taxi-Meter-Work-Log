import { useState, useEffect, useRef, useCallback } from 'react';
import { MeterState, UserSettings } from '../types';
import { loadSettings } from '../lib/storage';

interface MeterData {
  exactEarnings: number;
  displayedEarnings: number;
  sessionSeconds: number;
  driveSeconds: number;
  waitSeconds: number;
  distanceKm: number;
}

export function useTaxiMeter() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [status, setStatus] = useState<MeterState>('IDLE');
  
  const [data, setData] = useState<MeterData>({
    exactEarnings: 0,
    displayedEarnings: 0,
    sessionSeconds: 0,
    driveSeconds: 0,
    waitSeconds: 0,
    distanceKm: 0,
  });

  const lastTickRef = useRef<number>(Date.now());

  const updateSettings = useCallback((newConf: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newConf }));
  }, []);

  const earningRatePerSecond = 
    settings.monthlySalary / (settings.workDaysPerMonth * settings.hoursPerDay * 3600);

  useEffect(() => {
    if (status === 'IDLE') return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const deltaMs = now - lastTickRef.current;
      lastTickRef.current = now;

      const deltaSec = deltaMs / 1000;
      
      setData((prev) => {
        const nextExact = prev.exactEarnings + earningRatePerSecond * deltaSec;
        
        let nextDisplayed = prev.displayedEarnings;
        if (nextExact - prev.displayedEarnings >= settings.jumpUnit) {
          nextDisplayed = Math.floor(nextExact / settings.jumpUnit) * settings.jumpUnit;
          // Optionally here we could play a ticking sound or trigger an animation
        }

        const isDriving = status === 'DRIVING';
        
        // 30 km/h average speed = 30/3600 km per second
        const addedDistance = isDriving ? (30 / 3600) * deltaSec : 0;

        return {
          exactEarnings: nextExact,
          displayedEarnings: nextDisplayed,
          sessionSeconds: prev.sessionSeconds + deltaSec,
          driveSeconds: prev.driveSeconds + (isDriving ? deltaSec : 0),
          waitSeconds: prev.waitSeconds + (!isDriving ? deltaSec : 0),
          distanceKm: prev.distanceKm + addedDistance,
        };
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, earningRatePerSecond, settings.jumpUnit]);

  const start = () => {
    if (status === 'IDLE') {
      lastTickRef.current = Date.now();
    }
    setStatus('DRIVING');
  };

  const setWaiting = () => {
    setStatus('WAITING');
    lastTickRef.current = Date.now();
  };

  const setDriving = () => {
    setStatus('DRIVING');
    lastTickRef.current = Date.now();
  };

  const stop = () => {
    setStatus('IDLE');
  };

  const reset = () => {
    setStatus('IDLE');
    setData({
      exactEarnings: 0,
      displayedEarnings: 0,
      sessionSeconds: 0,
      driveSeconds: 0,
      waitSeconds: 0,
      distanceKm: 0,
    });
  };

  const fastForwardToNow = (pastDate: Date) => {
    const now = new Date();
    const diffSec = (now.getTime() - pastDate.getTime()) / 1000;
    if (diffSec <= 0) return;

    const addedEarnings = diffSec * earningRatePerSecond;
    const addedDistance = (30 / 3600) * diffSec; // Just default to driving distance

    setData((prev) => {
      const nextExact = prev.exactEarnings + addedEarnings;
      return {
        ...prev,
        exactEarnings: nextExact,
        displayedEarnings: Math.floor(nextExact / settings.jumpUnit) * settings.jumpUnit,
        sessionSeconds: prev.sessionSeconds + diffSec,
        driveSeconds: prev.driveSeconds + diffSec,
        distanceKm: prev.distanceKm + addedDistance,
      };
    });
    
    lastTickRef.current = Date.now();
    setStatus('DRIVING');
  };

  return {
    status,
    data,
    settings,
    updateSettings,
    earningRatePerSecond,
    start,
    setWaiting,
    setDriving,
    stop,
    reset,
    fastForwardToNow,
  };
}
