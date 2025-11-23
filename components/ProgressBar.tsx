
import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  progress: number;
  onChange: (newProgress: number) => void;
}

const ProgressBar: React.FC<Props> = ({ progress, onChange }) => {
  const steps = [25, 50, 75, 100];
  
  const getColorClass = (val: number) => {
    if (val >= 100) return 'bg-gradient-to-br from-emerald-300 to-emerald-500 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]';
    if (val >= 75) return 'bg-gradient-to-br from-[#96EFFF] to-[#7B66FF] border-[#7B66FF] shadow-[0_0_10px_rgba(123,102,255,0.5)]';
    if (val >= 50) return 'bg-gradient-to-br from-[#C5FFF8] to-[#5FBDFF] border-[#5FBDFF] shadow-[0_0_8px_rgba(95,189,255,0.4)]';
    if (val >= 25) return 'bg-gradient-to-br from-white to-[#96EFFF] border-[#96EFFF] shadow-[0_0_5px_rgba(150,239,255,0.4)]';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-4 select-none group/bar">
      <div className="flex justify-between items-end px-1">
        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Completion</span>
        <span className={`text-xs font-mono font-black transition-all duration-500 ${progress === 100 ? 'text-emerald-500 scale-110' : 'text-[#7B66FF]'}`}>
          {progress}%
        </span>
      </div>
      
      <div className="flex items-center gap-2 h-4" title="點擊切換進度">
        {steps.map((step) => {
          const isFilled = progress >= step;
          const isCurrent = progress === step;

          return (
            <div 
              key={step}
              onClick={(e) => {
                e.stopPropagation();
                onChange(isCurrent && step !== 100 ? step - 25 : step); 
              }}
              className={`
                relative flex-1 h-full rounded-full border transition-all duration-500 ease-out cursor-pointer overflow-hidden
                ${isFilled ? getColorClass(progress) : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}
                ${isCurrent ? 'scale-110 z-10 ring-2 ring-white ring-offset-1 ring-offset-transparent' : 'opacity-80 hover:opacity-100'}
                active:scale-95
              `}
            >
              {/* Glossy Highlight */}
              {isFilled && (
                <div className="absolute inset-x-0 top-0 h-[40%] bg-white/40 rounded-t-full pointer-events-none" />
              )}
              
              {/* Living Gradient Animation */}
              {isFilled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"/>
              )}

              {/* Celebration Icon for 100% */}
              {step === 100 && isFilled && (
                <div className="absolute -top-3 -right-1.5 animate-in zoom-in duration-300">
                  <Sparkles size={14} className="text-yellow-400 drop-shadow-sm fill-yellow-200 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
