import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';
import { DailyStat } from '../types';
import { formatCurrency, formatTime } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import html2canvas from 'html2canvas';

interface StatsModalProps {
  stats: DailyStat[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Sort and get last 7 days
  const recentStats = [...stats]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  const handleExport = async () => {
    if (!chartRef.current) return;
    try {
      // Temporarily remove led-shadow for better canvas rendering
      const chartContainer = chartRef.current;
      const elementsWithShadow = chartContainer.querySelectorAll('.led-shadow');
      elementsWithShadow.forEach(el => ((el as HTMLElement).style.textShadow = 'none'));
      
      const canvas = await html2canvas(chartContainer, { backgroundColor: '#09090b' });
      
      elementsWithShadow.forEach(el => ((el as HTMLElement).style.textShadow = ''));

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `taxi-work-stats-${new Date().toISOString().split('T')[0]}.png`;
      a.click();
    } catch (e) {
      console.error('Failed to export chart', e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-2xl rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden">
        <div className="bg-zinc-900/80 px-6 py-4 flex justify-between items-center border-b border-zinc-700 shrink-0">
          <h2 className="text-xl font-bold font-sans text-orange-500 uppercase tracking-widest">DAILY EARNINGS REPORT</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-orange-500 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {recentStats.length === 0 ? (
            <div className="text-center opacity-50 py-10 uppercase tracking-widest">
              No shift data recorded yet.
            </div>
          ) : (
            <div ref={chartRef} id="chart-container" className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <div className="mb-6">
                <h3 className="text-xs opacity-70 uppercase tracking-widest text-orange-500 mb-1">LAST 7 SHIFTS REVENUE</h3>
                <div className="text-4xl text-orange-500 font-mono font-bold led-shadow">
                  ¥ {formatCurrency(recentStats.reduce((sum, s) => sum + s.totalEarnings, 0))}
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={recentStats}>
                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickFormatter={(val) => val.substring(5)} />
                    <YAxis stroke="#52525b" fontSize={12} />
                    <Tooltip 
                      cursor={{fill: '#27272a'}} 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', color: '#f97316', fontFamily: 'Share Tech Mono' }}
                      itemStyle={{ color: '#f97316' }}
                      formatter={(value: number) => [`¥ ${formatCurrency(value)}`, 'Earnings']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="totalEarnings" radius={[4,4,0,0]}>
                      {
                        recentStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.totalEarnings > 0 ? '#ea580c' : '#71717a'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-orange-500/70 text-xs uppercase tracking-widest">
                      <th className="pb-2">DATE</th>
                      <th className="pb-2 text-right">TIME</th>
                      <th className="pb-2 text-right">MILEAGE</th>
                      <th className="pb-2 text-right">EARNED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStats.map((s) => (
                      <tr key={s.date} className="border-b border-zinc-900 last:border-0 font-mono text-sm sm:text-base text-zinc-300">
                        <td className="py-3 opacity-70">{s.date}</td>
                        <td className="py-3 text-right opacity-70">{formatTime(s.totalTimeSeconds)}</td>
                        <td className="py-3 text-right text-green-500">{s.distanceKm.toFixed(1)} km</td>
                        <td className="py-3 text-right text-orange-500 font-bold">¥ {formatCurrency(s.totalEarnings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-700 bg-zinc-900/50 flex justify-end shrink-0">
          <button 
            onClick={handleExport}
            disabled={recentStats.length === 0}
            className="glass-panel text-orange-500 hover:bg-zinc-800 disabled:opacity-50 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest transition-colors"
          >
            <Download className="w-5 h-5" />
            EXPORT RECEIPT
          </button>
        </div>
      </div>
    </div>
  );
};
