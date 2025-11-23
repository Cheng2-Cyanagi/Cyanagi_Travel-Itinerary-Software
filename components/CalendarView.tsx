
import React, { useState } from 'react';
import { TodoItem, CATEGORY_DOT_COLORS, Category, CATEGORY_LABELS } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Props {
  items: TodoItem[];
  onDateSelect: (date: string) => void;
}

const CalendarView: React.FC<Props> = ({ items, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1)); // April 2026

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getItemsForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return items.filter(i => i.date === dateStr).sort((a, b) => (a.time || '24:00').localeCompare(b.time || '24:00'));
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#96EFFF]/20 border border-[#C5FFF8] overflow-hidden select-none transition-all duration-500 ring-1 ring-white/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#C5FFF8] to-[#96EFFF] p-6 flex justify-between items-center border-b border-white/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0" />
        <button onClick={prevMonth} className="relative z-10 p-2.5 bg-white/50 hover:bg-white rounded-full transition text-[#7B66FF] active:scale-95 shadow-sm"><ChevronLeft size={24}/></button>
        <h2 className="relative z-10 text-2xl font-black text-[#7B66FF] tracking-wider drop-shadow-sm font-mono">{format(currentMonth, 'yyyy / MM')}</h2>
        <button onClick={nextMonth} className="relative z-10 p-2.5 bg-white/50 hover:bg-white rounded-full transition text-[#7B66FF] active:scale-95 shadow-sm"><ChevronRight size={24}/></button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 text-center bg-white border-b border-gray-100 shadow-sm relative z-10">
        {weekDays.map(day => (
          <div key={day} className="py-4 text-xs font-black text-[#5FBDFF] uppercase tracking-widest opacity-70">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 bg-gray-50/30">
        {calendarDays.map((day) => {
          const dayItems = getItemsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date()); 

          return (
            <div 
              key={day.toISOString()} 
              onClick={() => onDateSelect(format(day, 'yyyy-MM-dd'))}
              className={`min-h-[100px] border-b border-r border-gray-100 p-1.5 relative transition-all duration-300 cursor-pointer flex flex-col gap-1 group hover:z-10
                ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-300' : 'bg-white hover:bg-purple-50/80 hover:shadow-md hover:scale-[1.02]'}
                ${isToday ? 'bg-purple-50/40' : ''}
              `}
            >
              {isToday && <div className="absolute inset-0 ring-2 ring-inset ring-[#7B66FF]/50 z-0 pointer-events-none"/>}
              
              <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full self-center mb-1 transition-all z-10
                 ${dayItems.length > 0 ? 'bg-[#7B66FF] text-white shadow-md shadow-[#7B66FF]/30 group-hover:scale-110 group-hover:rotate-3' : 'text-gray-400 group-hover:text-[#7B66FF]'}
                 ${isToday && dayItems.length === 0 ? 'bg-[#C5FFF8] text-[#7B66FF] ring-1 ring-[#7B66FF]' : ''}
              `}>
                {format(day, 'd')}
              </span>

              {/* Dots */}
              <div className="flex flex-col gap-1.5 px-0.5 w-full mt-1">
                {dayItems.slice(0, 4).map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-1.5 w-full overflow-hidden bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-gray-100 hover:scale-105 hover:shadow-md transition-transform group/item"
                    title={`${item.time || ''} ${item.title} (${CATEGORY_LABELS[item.category]})`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 shadow-sm ring-1 ring-white group-hover/item:animate-pulse ${CATEGORY_DOT_COLORS[item.category] || 'bg-gray-400'}`}></div>
                    <span className={`text-[10px] truncate font-bold flex items-center gap-1 ${item.isCompleted ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
                       {item.time && <span className="font-mono text-[#7B66FF]/90 tracking-tight bg-purple-50 px-1 rounded-md text-[9px]">{item.time}</span>}
                       {item.title}
                    </span>
                  </div>
                ))}
                {dayItems.length > 4 && (
                  <div className="text-[9px] text-[#5FBDFF] text-center font-bold bg-sky-50 rounded-full py-0.5 mx-2 border border-sky-100 shadow-sm">+ {dayItems.length - 4}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
