import React, { useState, useEffect } from 'react';
import { useTaxiMeter } from './hooks/useTaxiMeter';
import { MeterDisplay } from './components/MeterDisplay';
import { Controls } from './components/Controls';
import { SettingsModal } from './components/SettingsModal';
import { FastForwardModal } from './components/FastForwardModal';
import { StatsModal } from './components/StatsModal';
import { loadDailyStats, saveDailyStat } from './lib/storage';
import { DailyStat } from './types';
import { cn } from './lib/utils';
import { Car, Flame } from 'lucide-react';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showFastForward, setShowFastForward] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
  
  const [isSmoking, setIsSmoking] = useState(false);
  const [smokingTimeLeft, setSmokingTimeLeft] = useState(0);
  
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);

  const meter = useTaxiMeter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSmoking && smokingTimeLeft > 0) {
      interval = setInterval(() => {
        setSmokingTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (smokingTimeLeft === 0 && isSmoking) {
      setIsSmoking(false);
    }
    return () => clearInterval(interval);
  }, [isSmoking, smokingTimeLeft]);

  const handleSmoke = () => {
    if (!isSmoking) {
      setIsSmoking(true);
      setSmokingTimeLeft(120); // 2 minutes
    } else {
      setIsSmoking(false);
      setSmokingTimeLeft(0);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setDailyStats(loadDailyStats());
  }, []);

  const handleStop = () => {
    if (meter.data.sessionSeconds > 0) {
      const today = new Date().toISOString().split('T')[0];
      const newStat: DailyStat = {
        date: today,
        totalEarnings: meter.data.exactEarnings,
        totalTimeSeconds: meter.data.sessionSeconds,
        driveTimeSeconds: meter.data.driveSeconds,
        waitTimeSeconds: meter.data.waitSeconds,
        distanceKm: meter.data.distanceKm,
      };
      saveDailyStat(newStat);
      setDailyStats(loadDailyStats());
      meter.reset();
    } else {
      meter.stop();
    }
  };

  const handleFastForwardConfirm = (pastDate: Date) => {
    meter.fastForwardToNow(pastDate);
    setShowFastForward(false);
  };

  return (
    <div className={cn(
      "min-h-screen bg-zinc-950 text-orange-500 font-mono flex flex-col items-center overflow-x-hidden relative transition-colors duration-1000",
      isImmersive ? "bg-black p-0 justify-center" : "py-4 px-2 sm:p-8"
    )}>
      
      {/* Immersive Background */}
      <div className={cn(
        "immersive-env",
        isImmersive ? "opacity-100" : "opacity-0 pointer-events-none",
        meter.status === 'DRIVING' && 'driving',
        meter.status === 'WAITING' && 'waiting',
        meter.status === 'IDLE' && 'idle'
      )}>
        <div className="sky">
          <div className="horizon-glow"></div>
          <div className="moon-glow"></div>
          <div className="city-lights"></div>
          <div className="city-skyline city-skyline-back"></div>
          <div className="city-skyline city-skyline-front"></div>
        </div>
        <div className="passing-lights">
          <div className="passing-light passing-light-left"></div>
          <div className="passing-light passing-light-right"></div>
          <div className="streetlights streetlights-left"><span></span><span></span><span></span><span></span></div>
          <div className="streetlights streetlights-right"><span></span><span></span><span></span><span></span></div>
          <div className="traffic-car traffic-car-near">
            <span className="car-body"></span><span className="tail-light"></span><span className="tail-light"></span>
          </div>
          <div className="traffic-car traffic-car-far">
            <span className="car-body"></span><span className="tail-light"></span><span className="tail-light"></span>
          </div>
          <div className="traffic-car traffic-car-oncoming">
            <span className="car-body"></span><span className="head-light"></span><span className="head-light"></span>
          </div>
          <div className="vehicle-lights vehicle-lights-oncoming"><span></span><span></span></div>
          <div className="vehicle-lights vehicle-lights-away"><span></span><span></span></div>
        </div>
        <div className="ground-plane">
          <div className="road">
            <div className="road-texture"></div>
            <div className="road-edge road-edge-left"></div>
            <div className="road-edge road-edge-right"></div>
            <div className="road-lines road-lines-left"></div>
            <div className="road-lines road-lines-center"></div>
            <div className="road-lines road-lines-right"></div>
            <div className="road-reflectors road-reflectors-left"></div>
            <div className="road-reflectors road-reflectors-right"></div>
          </div>
          <div className="guardrail guardrail-left"></div>
          <div className="guardrail guardrail-right"></div>
        </div>
        <div className="car-interior-overlay"></div>
        
        <div className="car-interior-frame">
          <div className="windshield">
            <div className="windshield-sheen"></div>
            <div className="glass-dust"></div>
          </div>
          <div className="car-roof"></div>
          <div className="roof-console"><span></span><span></span></div>
          <div className="rearview-mirror"><div className="mirror-glass"></div></div>
          <div className="car-pillar-left"></div>
          <div className="car-pillar-right"></div>
          
          <div className="car-dashboard">
            <div className="dash-topline"></div>
            <div className="dash-vent dash-vent-left"></div>
            <div className="dash-vent dash-vent-right"></div>
            <div className="instrument-cluster"><span></span><span></span><span></span></div>
            <div className="steering-wheel"></div>
          </div>
          <div className="car-center-console">
            <div className="console-screen"></div>
            <div className="console-buttons"><span></span><span></span><span></span><span></span></div>
          </div>
          <div className="side-door side-door-left"></div>
          <div className="side-door side-door-right"></div>
          
          <div className="front-seat-left">
            <div className="seat-shoulder"></div>
            <div className="seat-stitching"></div>
            <div className="seatbelt seatbelt-left"></div>
            <div className="headrest"><div className="headrest-poles"><div className="headrest-pole"></div><div className="headrest-pole"></div></div></div>
          </div>
          <div className="front-seat-right">
            <div className="seat-shoulder"></div>
            <div className="seat-stitching"></div>
            <div className="seatbelt seatbelt-right"></div>
            <div className="headrest"><div className="headrest-poles"><div className="headrest-pole"></div><div className="headrest-pole"></div></div></div>
          </div>
          <div className="rear-seat-foreground"><span></span><span></span></div>
        </div>
        
        {isSmoking && (
          <div className="smoke-container">
            {/* Glowing Ember */}
            <div className="cigarette-stick"></div>
            <div className="cigarette-ember"></div>
            <div className="smoke-haze"></div>
            <div className="smoke-thread smoke-thread-1"></div>
            <div className="smoke-thread smoke-thread-2"></div>
            <div className="smoke-thread smoke-thread-3"></div>
            <div className="smoke-thread smoke-thread-4"></div>
            
            <div className="smoke-particle" style={{ animationDelay: '0s' }}></div>
            <div className="smoke-particle" style={{ animationDelay: '2.5s', left: '40%' }}></div>
            <div className="smoke-particle" style={{ animationDelay: '5s', left: '60%' }}></div>
            <div className="smoke-particle smoke-particle-wide" style={{ animationDelay: '1.4s', left: '51%' }}></div>
          </div>
        )}
      </div>

      {/* Toggles */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button 
          onClick={() => setIsImmersive(!isImmersive)} 
          className="glass-panel text-orange-500 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-2xl"
        >
          <Car className="w-5 h-5" />
          <span className="hidden sm:inline">{isImmersive ? "EXIT SIMULATION" : "ENTER SIMULATION"}</span>
        </button>
        
        {isImmersive && (
          <button 
            onClick={handleSmoke} 
            className={cn("glass-panel px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-colors shadow-2xl",
              isSmoking ? "text-red-500 border-red-900/50" : "text-zinc-500 border-zinc-800"
            )}
          >
            <Flame className="w-5 h-5" />
            <span className="hidden sm:inline">
              {isSmoking ? `SMOKING (${formatTime(smokingTimeLeft)})` : "HAVE A SMOKE"}
            </span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className={cn(
        "w-full max-w-5xl flex-1 flex flex-col shadow-2xl bg-zinc-950 rounded-xl overflow-hidden z-30 transition-all duration-1000 ease-in-out origin-center",
        isImmersive ? cn("immersive-meter-container h-auto max-w-4xl border-none", meter.status === 'DRIVING' && "meter-driving") : "border-[12px] border-zinc-900 relative"
      )}>
        
        {/* Header */}
        <div className={cn("flex justify-between items-center border-b-2 border-orange-900/50 transition-all duration-500", isImmersive ? "p-6 pb-4" : "p-8 pb-4 mb-6")}>
          <div className="flex flex-col">
            <span className="text-xs opacity-50 uppercase tracking-widest">Unit Identity</span>
            <span className={cn("font-bold transition-all", isImmersive ? "text-lg md:text-xl" : "text-xl")}>TX-7000 RETRO-METER</span>
          </div>
          <div className="text-right">
            <span className="text-xs opacity-50 uppercase tracking-widest">Shift Status</span>
            {meter.status === 'IDLE' && <span className={cn("block text-zinc-500 font-bold", isImmersive ? "text-lg md:text-xl" : "text-xl")}>○ OFF DUTY</span>}
            {meter.status === 'DRIVING' && <span className={cn("block text-green-500 font-bold led-shadow-green", isImmersive ? "text-lg md:text-xl" : "text-xl")}>● IN SERVICE</span>}
            {meter.status === 'WAITING' && <span className={cn("block text-yellow-500 font-bold led-shadow-yellow", isImmersive ? "text-lg md:text-xl" : "text-xl")}>● WAITING</span>}
          </div>
        </div>

        {/* Content Body */}
        <div className={cn("flex-1 grid gap-6 p-4 pt-0 transition-all duration-500", isImmersive ? "grid-cols-1 p-6 sm:p-8" : "grid-cols-1 lg:grid-cols-12 sm:p-8")}>
          <div className={cn("flex flex-col gap-6 h-full", isImmersive ? "col-span-1" : "col-span-1 lg:col-span-8")}>
            <MeterDisplay
              fare={meter.data.displayedEarnings}
              distance={meter.data.distanceKm}
              waitTime={meter.data.waitSeconds}
              status={meter.status}
            />
          </div>

          <div className={cn("flex flex-col gap-4", isImmersive ? "hidden" : "col-span-1 lg:col-span-4")}>
            <div className="glass-panel relative rounded-lg p-6">
               <span className="text-xs opacity-50 uppercase mb-4 block">Configuration / 设置</span>
               <div className="space-y-4">
                 <div className="flex flex-col">
                   <label className="text-[10px] opacity-70 mb-1">MONTHLY TARGET / 月薪目标</label>
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">¥</span>
                     <input type="text" value={meter.settings.monthlySalary} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 pl-8 focus:outline-none text-lg text-orange-400 border-none" readOnly />
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <label className="text-[10px] opacity-70 mb-1">BASE RATE / 每秒费率</label>
                   <input type="text" value={`¥ ${meter.earningRatePerSecond.toFixed(4)} / SEC`} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 focus:outline-none text-sm text-orange-400 border-none" readOnly />
                 </div>
               </div>
            </div>

            <Controls
              status={meter.status}
              onStart={meter.start}
              onWait={meter.setWaiting}
              onStop={handleStop}
              onOpenSettings={() => setShowSettings(true)}
              onOpenStats={() => setShowStats(true)}
              onOpenFastForward={() => setShowFastForward(true)}
            />
          </div>
        </div>
        
        {!isImmersive && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] opacity-40 font-bold uppercase tracking-widest p-8 pt-0 gap-2 text-center">
            <span>Base Rate: ¥ {meter.earningRatePerSecond.toFixed(4)} / Sec</span>
            <span>GPS Signal: Locked</span>
            <span>V 4.2.0-STABLE</span>
          </div>
        )}
      </div>

      {/* Floating Controls for Immersive Mode */}
      {isImmersive && (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[440px] glass-panel p-2 rounded-lg shadow-2xl flex flex-col gap-2 opacity-20 hover:opacity-100 transition-opacity duration-300 immersive-controls">
           <Controls
              status={meter.status}
              onStart={meter.start}
              onWait={meter.setWaiting}
              onStop={handleStop}
              onOpenSettings={() => setShowSettings(true)}
              onOpenStats={() => setShowStats(true)}
              onOpenFastForward={() => setShowFastForward(true)}
            />
        </div>
      )}

      {showSettings && (
        <SettingsModal
          settings={meter.settings}
          onClose={() => setShowSettings(false)}
          onUpdate={meter.updateSettings}
        />
      )}

      {showFastForward && (
        <FastForwardModal
          onClose={() => setShowFastForward(false)}
          onConfirm={handleFastForwardConfirm}
        />
      )}

      {showStats && (
        <StatsModal
          stats={dailyStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}
