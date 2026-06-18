import React, { useState } from 'react';
import { UserSettings } from '../types';
import { saveSettings } from '../lib/storage';
import { X } from 'lucide-react';

interface SettingsModalProps {
  settings: UserSettings;
  onClose: () => void;
  onUpdate: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onClose, onUpdate }) => {
  const [local, setLocal] = useState({ ...settings });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    saveSettings(local);
    onUpdate(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-md rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="bg-zinc-900/80 px-6 py-4 flex justify-between items-center border-b border-zinc-700">
          <h2 className="text-xl font-bold font-sans text-orange-500 uppercase tracking-widest">Meter Settings</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-orange-500 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-70 uppercase tracking-widest text-orange-500">MONTHLY SALARY (¥)</label>
            <input 
              type="number" 
              name="monthlySalary" 
              value={local.monthlySalary || ''} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 focus:outline-none focus:border-orange-500 text-xl font-bold text-orange-400 font-mono transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs opacity-70 uppercase tracking-widest text-orange-500">WORK DAYS/MO</label>
              <input 
                type="number" 
                name="workDaysPerMonth" 
                value={local.workDaysPerMonth || ''} 
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 focus:outline-none focus:border-orange-500 text-lg text-orange-400 font-mono transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs opacity-70 uppercase tracking-widest text-orange-500">HOURS/DAY</label>
              <input 
                type="number" 
                name="hoursPerDay" 
                value={local.hoursPerDay || ''} 
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 focus:outline-none focus:border-orange-500 text-lg text-orange-400 font-mono transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs opacity-70 uppercase tracking-widest text-orange-500">METER JUMP UNIT (¥)</label>
            <input 
              type="number" 
              name="jumpUnit" 
              step="0.01"
              value={local.jumpUnit || ''} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 focus:outline-none focus:border-orange-500 text-lg text-orange-400 font-mono transition-colors"
            />
          </div>
          
          <button 
            onClick={handleSave}
            className="w-full mt-4 btn-active text-zinc-900 font-bold py-4 rounded-lg uppercase tracking-widest transition-transform active:scale-[0.98]"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
};
