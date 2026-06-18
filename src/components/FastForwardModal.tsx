import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FastForwardModalProps {
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export const FastForwardModal: React.FC<FastForwardModalProps> = ({ onClose, onConfirm }) => {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');

  const handleConfirm = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const pastDate = new Date(Date.now() - (h * 3600 + m * 60) * 1000);
    onConfirm(pastDate);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-sm rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="bg-zinc-900/80 px-6 py-4 flex justify-between items-center border-b border-zinc-700">
          <h2 className="text-xl font-bold font-sans text-orange-500 uppercase tracking-widest">PAST START TIME</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-orange-500 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <p className="text-sm opacity-70">
            How long ago did you actually start working? The meter will fast-forward and calculate your earnings instantly.
          </p>
          
          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-2 flex-1 items-center">
              <input 
                type="number" 
                value={hours} 
                onChange={(e) => setHours(e.target.value)}
                min="0"
                className="w-full text-center bg-zinc-900 border border-zinc-700 rounded p-4 text-3xl font-mono focus:outline-none focus:border-orange-500 text-orange-400 transition-colors"
              />
              <span className="text-xs opacity-70 uppercase tracking-widest">HOURS</span>
            </div>
            <span className="text-3xl text-zinc-600 font-bold pb-6">:</span>
            <div className="flex flex-col gap-2 flex-1 items-center">
              <input 
                type="number" 
                value={minutes} 
                onChange={(e) => setMinutes(e.target.value)}
                min="0"
                max="59"
                className="w-full text-center bg-zinc-900 border border-zinc-700 rounded p-4 text-3xl font-mono focus:outline-none focus:border-orange-500 text-orange-400 transition-colors"
              />
              <span className="text-xs opacity-70 uppercase tracking-widest">MINS</span>
            </div>
          </div>
          
          <button 
            onClick={handleConfirm}
            className="w-full mt-2 btn-active text-zinc-900 font-bold py-4 rounded-lg uppercase tracking-widest transition-transform active:scale-[0.98]"
          >
            START & CATCH UP
          </button>
        </div>
      </div>
    </div>
  );
};
