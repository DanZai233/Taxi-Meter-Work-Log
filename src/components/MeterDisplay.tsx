import React from 'react';
import { formatCurrency, formatTime } from '../lib/utils';
import { MeterState } from '../types';

interface MeterDisplayProps {
  fare: number;
  distance: number;
  waitTime: number;
  status: MeterState;
}

export const MeterDisplay: React.FC<MeterDisplayProps> = ({ fare, distance, waitTime, status }) => {
  return (
    <div className="glass-panel relative rounded-lg p-6 sm:p-10 flex-1 flex flex-col justify-center overflow-hidden min-h-[300px]">
      <div className="grid-overlay absolute inset-0 opacity-20 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm opacity-60 uppercase">Total Fare / 累计金额</span>
          <span className="text-lg text-orange-500">CNY</span>
        </div>
        <div className="text-[70px] sm:text-[100px] md:text-[140px] leading-none font-black tracking-tighter led-shadow border-b-4 border-orange-900/30 pb-4 text-orange-500 break-all select-none">
          {formatCurrency(fare).padStart(7, '0')}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 gap-6 sm:gap-10">
          <div className="flex flex-col">
            <span className="text-xs opacity-50 uppercase text-orange-500">Distance / 里程</span>
            <div className="text-4xl sm:text-5xl font-bold tracking-tight text-green-500 led-shadow-green select-none">
              {distance.toFixed(2)} <span className="text-xl opacity-40">KM</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs opacity-50 uppercase text-orange-500">Wait Time / 等待</span>
            <div className="text-4xl sm:text-5xl font-bold tracking-tight text-yellow-500 led-shadow-yellow select-none">
              {formatTime(waitTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
