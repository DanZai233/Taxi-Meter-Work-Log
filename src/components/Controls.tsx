import React from 'react';
import { cn } from '../lib/utils';
import { MeterState } from '../types';
import { Play, Pause, Square, Settings, BarChart2, Clock } from 'lucide-react';

interface ControlsProps {
  status: MeterState;
  onStart: () => void;
  onWait: () => void;
  onStop: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenFastForward: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  status,
  onStart,
  onWait,
  onStop,
  onOpenSettings,
  onOpenStats,
  onOpenFastForward
}) => {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex-1 grid grid-rows-3 gap-4 min-h-[180px]">
        {status === 'IDLE' ? (
          <button onClick={onStart} className="w-full btn-active rounded-lg font-black text-xl md:text-2xl uppercase tracking-widest flex items-center justify-center gap-3 h-full px-4">
            <span>START</span><span className="text-sm opacity-50">打表</span>
          </button>
        ) : (
          <button className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-lg font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-3 text-zinc-400 opacity-50 cursor-not-allowed h-full px-4" disabled>
             <span>START</span><span className="text-sm opacity-50">打表</span>
          </button>
        )}

        {status === 'DRIVING' ? (
          <button onClick={onWait} className="w-full bg-zinc-800 border-2 border-zinc-700 hover:border-yellow-500 transition-colors rounded-lg font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-3 text-yellow-500 h-full px-4">
            <Pause className="w-6 h-6 hidden sm:block" />
            <span>PAUSE</span><span className="text-sm opacity-50">等待</span>
          </button>
        ) : status === 'WAITING' ? (
          <button onClick={onStart} className="w-full bg-green-900/20 border-2 border-green-900/50 hover:border-green-500 text-green-500 transition-colors rounded-lg font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-3 h-full px-4">
            <Play className="w-6 h-6 hidden sm:block" />
            <span>RESUME</span><span className="text-sm opacity-50">继续</span>
          </button>
        ) : (
          <button className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-lg font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-3 text-zinc-400 opacity-50 cursor-not-allowed h-full px-4" disabled>
             <span>PAUSE</span><span className="text-sm opacity-50">等待</span>
          </button>
        )}

        {status !== 'IDLE' ? (
          <button onClick={onStop} className="w-full bg-red-900/20 border-2 border-red-900/50 hover:border-red-500 text-red-500 transition-colors rounded-lg font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-3 h-full px-4">
            <Square className="w-6 h-6 hidden sm:block" />
            <span>STOP</span><span className="text-sm opacity-50">结账</span>
          </button>
        ) : (
          <button className="w-full bg-zinc-800 border-2 border-zinc-700 rounded-lg font-bold text-xl uppercase tracking-widest flex items-center justify-center gap-3 text-zinc-400 opacity-50 cursor-not-allowed h-full px-4" disabled>
            <span>STOP</span><span className="text-sm opacity-50">结账</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {status === 'IDLE' && (
          <button onClick={onOpenFastForward} className="glass-panel flex-1 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 p-3 flex justify-center text-blue-400 items-center gap-2 transition-colors" title="Fast Forward">
            <Clock className="w-4 h-4" /> PAST
          </button>
        )}
        <button onClick={onOpenSettings} className={cn("glass-panel flex-1 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 p-3 flex items-center justify-center gap-2 text-zinc-300 transition-colors", status !== 'IDLE' && "col-span-1")}>
          <Settings className="w-4 h-4" /> SET
        </button>
        <button onClick={onOpenStats} className={cn("glass-panel rounded-lg text-xs font-bold uppercase tracking-[0.1em] hover:bg-zinc-800 py-3 flex justify-center items-center gap-2 text-orange-500 transition-colors", status !== 'IDLE' && "col-span-2")}>
          <BarChart2 className="w-4 h-4" /> STATS
        </button>
      </div>
    </div>
  );
};
