
import React, { useState, useEffect } from 'react';
import { TodoItem, CATEGORY_COLORS, CATEGORY_LABELS, Category, TIME_BASED_CATS, FUNCTION_BASED_CATS, CATEGORY_BADGE_STYLES } from '../types';
import ProgressBar from './ProgressBar';
import { 
  Trash2, Edit2, Calendar, ChevronDown, MapPin, Clock, Share2, Timer, StopCircle, Hourglass,
  AlertTriangle, CheckCircle2, ClipboardList, Shirt, Coffee, ShoppingBag, Utensils, Users, HelpCircle,
  Zap, Sparkles, Bell, Search
} from 'lucide-react';
import { isToday, isTomorrow } from 'date-fns';

interface Props {
  item: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: TodoItem) => void;
  onProgressChange?: (id: string, val: number) => void;
  onDateClick: (item: TodoItem) => void;
  onCategoryChange?: (id: string, newCategory: Category) => void;
  onTimerToggle?: (id: string) => void;
  highlighted?: boolean;
}

const getCategoryIcon = (cat: Category) => {
  switch(cat) {
    case 'Critical': return AlertTriangle;
    case 'Daily': return CheckCircle2;
    case 'Todo': return ClipboardList;
    case 'Costume': return Shirt;
    case 'A': return Calendar;
    case 'B': return Zap;
    case 'C': return Coffee;
    case 'D': return Hourglass;
    case 'Inventory': return ShoppingBag;
    case 'Food': return Utensils;
    case 'Meetup': return Users;
    case 'Uncertain': return HelpCircle;
    default: return Calendar;
  }
};

const ItemCard: React.FC<Props> = ({ item, onToggle, onDelete, onEdit, onProgressChange, onDateClick, onCategoryChange, onTimerToggle, highlighted }) => {
  const isCostume = item.category === 'Costume';
  const CatIcon = getCategoryIcon(item.category);
  
  const itemDate = item.date ? new Date(item.date) : null;
  let dateAlert = false;
  let dateLabel = item.date ? item.date.slice(5) : '';

  if (itemDate) {
     if (isToday(itemDate)) {
       dateLabel = '今天';
       dateAlert = !item.isCompleted;
     } else if (isTomorrow(itemDate)) {
       dateLabel = '明天';
       dateAlert = !item.isCompleted;
     }
  }

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!item.timerStartedAt) {
      setTimeLeft('');
      setIsTimeUp(false);
      setProgressPercent(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - item.timerStartedAt!) / 1000);
      
      if (item.suggestedDuration) {
        const totalSeconds = item.suggestedDuration * 60;
        const remaining = totalSeconds - elapsed;
        
        const pct = Math.min(100, (elapsed / totalSeconds) * 100);
        setProgressPercent(pct);

        if (remaining <= 0) {
          setTimeLeft('00:00');
          if (!isTimeUp) {
             setIsTimeUp(true);
             if (Notification.permission === 'granted') {
               new Notification('⏳ 時間到！', {
                 body: `行程「${item.title}」的建議時間 (${item.suggestedDuration}分) 已結束。`,
               });
             }
          }
        } else {
          const m = Math.floor(remaining / 60);
          const s = remaining % 60;
          setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
        }
      } else {
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [item.timerStartedAt, item.suggestedDuration, item.id, item.title, isTimeUp]);

  // Handlers
  const handleTimerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTimerToggle) {
      if (!item.timerStartedAt && item.suggestedDuration && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      onTimerToggle(item.id);
    }
  };

  const handleNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = item.location || item.title;
    if (!query) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `【靑凪旅程】${item.title}\n${item.date ? `📅 ${item.date}` : ''} ${item.location ? `@ ${item.location}` : ''}`;
    if (navigator.share) {
      try { await navigator.share({ title: item.title, text: shareText }); } catch (err) { console.error(err); }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('已複製到剪貼簿');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent defaults
    e.stopPropagation(); // Stop bubbling to card
    onDelete(item.id);
  };

  const handleEditAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDateAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateClick(item);
  };

  return (
    <div 
      id={`item-${item.id}`}
      onClick={() => onEdit(item)}
      className={`
        relative p-4 mb-3 rounded-[1.5rem] transition-all duration-500 group border backdrop-blur-xl select-none cursor-pointer overflow-hidden
        animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards
        ${CATEGORY_COLORS[item.category] || 'bg-white border-gray-200'}
        ${highlighted 
          ? 'ring-4 ring-[#7B66FF]/50 shadow-[0_0_40px_rgba(123,102,255,0.5)] scale-[1.03] z-10 bg-purple-50/95' 
          : 'hover:shadow-xl hover:shadow-[#96EFFF]/20 hover:-translate-y-0.5 shadow-sm'
        }
        ${item.isCompleted ? 'opacity-60 grayscale-[0.4]' : 'opacity-100'}
        ${item.timerStartedAt && !item.isCompleted ? 'ring-2 ring-offset-2 ring-[#7B66FF]/50 shadow-lg shadow-[#7B66FF]/20' : ''}
      `}
    >
      {/* Shimmer Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none" />

      {highlighted && (
        <div className="absolute -top-3 -right-3 text-[#7B66FF] animate-bounce z-20 drop-shadow-lg">
          <Sparkles size={32} fill="currentColor" />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* Checkbox */}
        <div className="pt-1.5 pl-1" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex items-center justify-center group/check">
             <input 
               type="checkbox" 
               checked={item.isCompleted} 
               onChange={() => onToggle(item.id)}
               className="peer w-6 h-6 appearance-none border-[2.5px] border-[#5FBDFF]/40 rounded-lg checked:bg-[#7B66FF] checked:border-[#7B66FF] cursor-pointer transition-all duration-300 shadow-sm hover:border-[#7B66FF] hover:scale-110 active:scale-95 bg-white"
             />
             <CheckCircle2 className="absolute w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-all duration-300 scale-50 peer-checked:scale-100 peer-checked:rotate-0 rotate-[-45deg]" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h3 className={`font-bold text-gray-800 leading-tight text-[15px] transition-all duration-300 tracking-wide ${item.isCompleted ? 'line-through text-gray-400 decoration-2 decoration-gray-300' : ''}`}>
              {item.title}
            </h3>
            
            {/* Date Pill */}
            {item.date && (
               <button 
                  type="button"
                  onClick={handleDateAction}
                  className={`flex-shrink-0 cursor-pointer flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all duration-300 active:scale-95 shadow-sm z-10
                  ${dateAlert 
                    ? 'bg-red-50 text-red-500 border-red-100 animate-pulse ring-1 ring-red-200' 
                    : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-[#C5FFF8] hover:border-[#96EFFF] hover:text-[#7B66FF]'
                  }`}
               >
                  <span>{dateLabel}</span>
                  {item.time && (
                    <span className={`flex items-center gap-0.5 pl-1.5 border-l ${dateAlert ? 'border-red-200' : 'border-gray-200'}`}>
                       <Clock size={10} className="stroke-[3px]" />
                       {item.time}
                    </span>
                  )}
                  {dateAlert && <AlertTriangle size={10}/>}
               </button>
            )}
          </div>
          
          {/* Timer / Status Bar */}
          {item.timerStartedAt && !item.isCompleted && (
            <div className={`relative overflow-hidden mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-colors shadow-md ring-1 ring-inset animate-in zoom-in duration-300
              ${isTimeUp ? 'bg-red-50 text-red-500 ring-red-200 animate-pulse' : 'bg-gray-900 text-[#96EFFF] ring-gray-800'}
            `}>
              {item.suggestedDuration && !isTimeUp && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-[#7B66FF]/50 transition-all duration-1000 ease-linear pointer-events-none"
                  style={{ width: `${progressPercent}%` }}
                />
              )}
              <Timer size={14} className={`relative z-10 ${isTimeUp ? '' : 'animate-spin-slow'}`}/>
              <span className="relative z-10">{timeLeft}</span>
              {isTimeUp && <span className="relative z-10 text-xs ml-1">時間到!</span>}
            </div>
          )}
          
          {/* Description */}
          {item.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed font-medium bg-white/60 p-2 rounded-xl border border-white/50 transition-colors group-hover:bg-white/90 group-hover:border-[#C5FFF8]">{item.description}</p>
          )}

          {/* Suggested Duration Label */}
          {item.suggestedDuration && !item.timerStartedAt && !item.isCompleted && (
             <button 
               type="button"
               onClick={handleEditAction}
               className="mt-2 text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-50/80 w-fit px-2 py-1 rounded-md border border-gray-100 cursor-pointer hover:bg-[#7B66FF] hover:text-white hover:shadow-sm transition-all active:scale-95 group/dur z-10"
               title="點擊修改建議時間"
             >
                <Hourglass size={10} className="group-hover/dur:rotate-180 transition-transform duration-500"/> 建議: {item.suggestedDuration}分
             </button>
          )}
          
          {isCostume && onProgressChange && (
            <ProgressBar progress={item.progress || 0} onChange={(val) => onProgressChange(item.id, val)} />
          )}

          {/* Metadata & Actions Row */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
             {/* Category Quick Switch */}
             <div className="relative group/cat z-20" onClick={(e) => e.stopPropagation()}>
               <div className={`
                 text-[10px] pl-2 pr-1.5 py-1.5 border rounded-full font-bold flex items-center gap-1 transition-all duration-300 cursor-pointer select-none shadow-sm
                 ${item.isCompleted ? 'bg-gray-100 text-gray-400 border-gray-200' : `${CATEGORY_BADGE_STYLES[item.category] || 'bg-gray-100 text-gray-500 border-gray-200'} hover:scale-105 hover:shadow-md`}
               `}>
                 <CatIcon size={12} className="opacity-90"/>
                 <span>{CATEGORY_LABELS[item.category]?.split(' ')[0].replace(/[A-Z]\./, '')}</span>
                 <ChevronDown size={10} className="opacity-50 group-hover/cat:opacity-100 transition-opacity ml-0.5"/>
               </div>
               {onCategoryChange && (
                 <select 
                   value={item.category}
                   onChange={(e) => onCategoryChange(item.id, e.target.value as Category)}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                 >
                    <optgroup label="📅 時間與重要性">
                      {TIME_BASED_CATS.map(key => <option key={key} value={key}>{CATEGORY_LABELS[key]}</option>)}
                    </optgroup>
                    <optgroup label="🛠️ 功能與任務">
                      {FUNCTION_BASED_CATS.map(key => <option key={key} value={key}>{CATEGORY_LABELS[key]}</option>)}
                    </optgroup>
                 </select>
               )}
             </div>
             
             {/* Navigation */}
             {item.location ? (
                <button 
                  type="button"
                  onClick={handleNavigation}
                  onMouseDown={e => e.stopPropagation()}
                  className="group/nav relative overflow-hidden text-[10px] flex items-center pl-2.5 pr-3 py-1.5 rounded-full transition-all duration-300 shadow-sm z-20 max-w-[140px] active:scale-95
                             bg-gradient-to-r from-[#5FBDFF] to-blue-500 text-white border border-blue-200/20 hover:shadow-lg hover:shadow-blue-300/40 font-bold hover:-translate-y-0.5"
                  title={`導航至：${item.location}`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/nav:translate-y-0 transition-transform duration-300" />
                  <MapPin size={11} className="mr-1.5 flex-shrink-0 text-white animate-bounce-slow"/>
                  <span className="truncate max-w-[80px] relative z-10">{item.location}</span>
                </button>
             ) : (
                <button 
                  type="button"
                  onClick={handleNavigation}
                  onMouseDown={e => e.stopPropagation()}
                  className="text-[10px] flex items-center pl-2.5 pr-3 py-1.5 rounded-full border transition-all duration-300 shadow-sm z-20 active:scale-95
                             bg-white border-gray-200 text-gray-400 hover:bg-[#C5FFF8] hover:text-[#7B66FF] hover:border-[#96EFFF] hover:shadow-md"
                  title="搜尋地點"
                >
                  <Search size={11} className="mr-1.5 flex-shrink-0"/>
                  <span className="truncate">搜尋</span>
                </button>
             )}

             {/* Timer Toggle */}
             {onTimerToggle && !item.isCompleted && (
               <button
                 type="button"
                 onClick={handleTimerClick}
                 onMouseDown={e => e.stopPropagation()}
                 className={`text-[10px] flex items-center px-3 py-1.5 rounded-full border transition-all duration-300 shadow-sm font-bold active:scale-95 z-20
                   ${item.timerStartedAt 
                     ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100 hover:border-red-200 hover:shadow-red-100' 
                     : 'bg-white text-gray-500 border-gray-200 hover:bg-[#7B66FF] hover:text-white hover:border-[#7B66FF] hover:shadow-purple-200'
                   }
                 `}
               >
                 {item.timerStartedAt ? <StopCircle size={11} className="mr-1.5 animate-pulse"/> : <Timer size={11} className="mr-1.5"/>}
                 {item.timerStartedAt ? '停止' : '計時'}
               </button>
             )}
          </div>
        </div>

        {/* Side Action Buttons (Sticky Right) */}
        <div 
          className="flex flex-col gap-1 pl-2 border-l border-gray-100/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 relative z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            type="button"
            onClick={handleShare} 
            onMouseDown={e => e.stopPropagation()}
            className="text-gray-300 hover:text-indigo-500 transition-all duration-200 p-1.5 hover:bg-indigo-50 rounded-lg active:scale-90 hover:scale-110 hover:shadow-sm" 
            title="分享"
          >
            <Share2 size={14} />
          </button>
          <button 
            type="button"
            onClick={handleEditAction} 
            onMouseDown={e => e.stopPropagation()}
            className="text-gray-300 hover:text-[#7B66FF] transition-all duration-200 p-1.5 hover:bg-[#7B66FF]/10 rounded-lg active:scale-90 hover:scale-110 hover:shadow-sm" 
            title="編輯"
          >
            <Edit2 size={14} />
          </button>
          <button 
            type="button"
            onClick={handleDateAction} 
            onMouseDown={e => e.stopPropagation()}
            className="text-gray-300 hover:text-[#5FBDFF] transition-all duration-200 p-1.5 hover:bg-[#5FBDFF]/10 rounded-lg active:scale-90 hover:scale-110 hover:shadow-sm" 
            title="日期"
          >
            <Calendar size={14} />
          </button>
          
          {/* Delete Button - Critical Fix: Removed active:scale-90 to prevent click cancellation */}
          <button 
            type="button"
            onClick={handleDeleteClick} 
            onMouseDown={e => e.stopPropagation()}
            className="text-gray-300 hover:text-red-500 transition-all duration-200 p-1.5 hover:bg-red-50 rounded-lg hover:scale-110 hover:shadow-sm group/del relative z-50" 
            title="刪除"
          >
            <Trash2 size={14} className="group-hover/del:animate-bounce text-current pointer-events-none"/> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
