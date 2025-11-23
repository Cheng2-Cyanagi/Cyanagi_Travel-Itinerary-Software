
import React, { useState, useEffect } from 'react';
import { TodoItem, CATEGORY_LABELS, Category, TIME_BASED_CATS, FUNCTION_BASED_CATS, CATEGORY_BADGE_STYLES } from '../types';
import { 
  X, MapPin, Calendar, Clock, Sparkles, Hourglass, 
  AlertTriangle, CheckCircle2, ClipboardList, Shirt, Zap, Coffee, 
  ShoppingBag, Utensils, Users, HelpCircle 
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Props {
  item?: TodoItem;
  initialDate?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<TodoItem>) => void;
}

// Icon mapping helper (duplicated locally to avoid circular deps or complex imports if not centralized)
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

// Helper for category colors in the grid
const getCategoryGridClass = (cat: Category, isSelected: boolean) => {
  const base = "border transition-all duration-200 rounded-xl flex flex-col items-center justify-center gap-1 p-2 h-20 relative overflow-hidden group";
  
  if (!isSelected) {
    return `${base} bg-white border-gray-100 text-gray-400 hover:border-c-purple hover:text-c-purple hover:shadow-md hover:-translate-y-0.5 hover:bg-purple-50/50`;
  }
  
  // Use the specific badge style but enhance it for selection state
  const style = CATEGORY_BADGE_STYLES[cat] || 'bg-gray-100 text-gray-700 border-gray-200';
  // We replace 'bg-x-100' with 'bg-x-50' for the grid item background to be lighter, and add ring
  return `${base} ${style} ring-2 ring-offset-1 ring-c-purple/50 shadow-md scale-[1.02]`;
};

const EditModal: React.FC<Props> = ({ item, initialDate, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<TodoItem>>({
    title: '',
    description: '',
    category: 'D',
    date: '',
    time: '',
    location: '',
    suggestedDuration: 0
  });

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...item });
      } else {
        setFormData({ 
          title: '', 
          description: '', 
          category: 'D', 
          date: initialDate || '',
          time: '',
          progress: 0,
          isCompleted: false,
          location: '',
          suggestedDuration: 0
        });
      }
    }
  }, [item, isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // onClose is handled by parent after save
  };

  const setToday = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData({...formData, date: format(new Date(), 'yyyy-MM-dd')});
  }

  const setTomorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData({...formData, date: format(addDays(new Date(), 1), 'yyyy-MM-dd')});
  }

  const handleDurationPreset = (e: React.MouseEvent, minutes: number) => {
    e.preventDefault();
    setFormData({...formData, suggestedDuration: minutes});
  }

  const handleAIGenerate = (e: React.MouseEvent) => {
    e.preventDefault();
    const cat = formData.category as Category;
    const title = formData.title || '行程';
    
    const prompts: Record<string, string[]> = {
      'Food': [`${title} 評價很高，記得先看 Google Maps 營業時間！`, `聽說 ${title} 的招牌菜必點，準備好胃口了嗎？`, '這家店可能需要排隊，建議避開尖峰時段。', '記得拍照打卡，這裡的裝潢很漂亮！'],
      'Inventory': [`別忘了把 ${title} 放進背包最外層，方便拿取。`, `檢查一下 ${title} 是否足夠，寧可多帶也不要少帶。`, '出發前再次確認有沒有帶到！'],
      'Critical': [`${title} 非常重要！建議設個鬧鐘提醒自己。`, `再次確認 ${title} 的時間地點，絕對不能遲到！`, '這件事優先級最高，務必專注完成。'],
      'A': [`${title} 需要花比較多時間，記得預留交通緩衝。`, `這趟行程比較長，帶個行動電源或水吧。`, '若是戶外行程，記得確認天氣狀況。'],
      'B': [`${title} 就在附近，可以順便看看周邊有什麼好玩的。`, '短暫的行程，適合穿插在空檔中。'],
      'Todo': [`${title} 趕快完成它，心情會更輕鬆！`, `把 ${title} 分解成小步驟會比較好執行喔。`, '做完這件事給自己一個小獎勵吧！'],
      'Costume': [`${title} 的細節是關鍵，加油！`, '穿起來舒適最重要，記得試穿確認活動度。'],
      'Meetup': [`跟對方確認一下時間地點，以免撲空。`, `準備個小禮物或話題，讓聚會更開心！`],
      'default': [`關於 ${title}，可以先查查看有沒有相關優惠或活動。`, `放輕鬆，享受 ${title} 的過程吧！`, '這聽起來很有趣，期待！']
    };

    const list = prompts[cat] || prompts[cat.substring(0, 1)] || prompts['default'];
    const randomText = list[Math.floor(Math.random() * list.length)];
    setFormData({...formData, description: randomText});
  };

  return (
    <div className="fixed inset-0 bg-c-purple/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh] border border-white/60 ring-1 ring-c-light/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-c-light via-c-cyan to-c-sky/30 p-5 flex justify-between items-center border-b border-white/50">
          <h3 className="font-bold text-c-purple text-lg flex items-center gap-2 drop-shadow-sm">
            <div className="bg-white p-2 rounded-full shadow-sm text-c-purple">
               {item ? <Edit2Icon size={18}/> : <PlusIcon size={18}/>}
            </div>
            {item ? '編輯行程' : '新增行程'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 p-2 bg-white/60 hover:bg-white rounded-full transition-all shadow-sm hover:rotate-90"><X size={22}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto scrollbar-hide flex-1">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">行程名稱</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-c-purple focus:bg-white outline-none transition font-bold text-gray-700 placeholder-gray-300 text-lg shadow-inner"
              placeholder="例如：買雨傘、去三創..."
            />
          </div>

          {/* Category Selector (Visual Grid) */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">行程分類</label>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block mb-2 ml-1">時間與重要性</span>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {TIME_BASED_CATS.map(cat => {
                    const Icon = getCategoryIcon(cat);
                    const isSelected = formData.category === cat;
                    return (
                      <button 
                        key={cat}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat})}
                        className={getCategoryGridClass(cat, isSelected)}
                        title={CATEGORY_LABELS[cat]}
                      >
                        <Icon size={20} strokeWidth={2.5} />
                        <span className="text-[9px] font-bold truncate w-full text-center leading-tight">{CATEGORY_LABELS[cat].split(' ')[0].replace(/[A-Z]\./, '')}</span>
                        {isSelected && <div className="absolute top-1 right-1 w-2 h-2 bg-current rounded-full animate-ping"/>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block mb-2 ml-1">功能與任務</span>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {FUNCTION_BASED_CATS.map(cat => {
                    const Icon = getCategoryIcon(cat);
                    const isSelected = formData.category === cat;
                    return (
                      <button 
                        key={cat}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat})}
                        className={getCategoryGridClass(cat, isSelected)}
                        title={CATEGORY_LABELS[cat]}
                      >
                        <Icon size={20} strokeWidth={2.5} />
                        <span className="text-[9px] font-bold truncate w-full text-center leading-tight">{CATEGORY_LABELS[cat].split(' ')[0]}</span>
                        {isSelected && <div className="absolute top-1 right-1 w-2 h-2 bg-current rounded-full animate-ping"/>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
            
          {/* Date & Time */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest ml-1">時間安排</label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-c-purple transition-colors" size={16}/>
                <input 
                  type="date" 
                  value={formData.date || ''}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3.5 pl-10 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-c-purple outline-none cursor-pointer text-sm font-bold text-gray-700"
                />
              </div>
              <div className="relative w-1/3 group">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-c-purple transition-colors" size={16}/>
                <input 
                  type="time" 
                  value={formData.time || ''}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3.5 pl-10 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-c-purple outline-none cursor-pointer text-sm font-bold text-gray-700"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={setToday}
                  className="flex-1 py-2 bg-sky-50 text-c-sky border border-sky-100 rounded-xl hover:bg-c-sky hover:text-white transition-all text-xs font-bold active:scale-95"
                >
                  今天
                </button>
                <button 
                  type="button" 
                  onClick={setTomorrow}
                  className="flex-1 py-2 bg-purple-50 text-c-purple border border-purple-100 rounded-xl hover:bg-c-purple hover:text-white transition-all text-xs font-bold active:scale-95"
                >
                  明天
                </button>
            </div>
          </div>

          {/* Suggested Duration */}
          <div>
             <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1 ml-1">
               <Hourglass size={12}/> 建議停留 (分鐘)
             </label>
             <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
               <input 
                 type="number" 
                 min="0"
                 step="15"
                 value={formData.suggestedDuration || ''}
                 onChange={e => setFormData({...formData, suggestedDuration: parseInt(e.target.value) || 0})}
                 className="w-20 p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-c-purple outline-none transition text-sm font-bold text-gray-700 text-center shadow-sm"
                 placeholder="0"
               />
               <div className="flex gap-1 flex-1 overflow-x-auto scrollbar-hide py-1">
                 {[30, 60, 90, 120].map(min => (
                   <button
                     key={min}
                     onClick={(e) => handleDurationPreset(e, min)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex-shrink-0 active:scale-95
                       ${formData.suggestedDuration === min 
                         ? 'bg-c-purple text-white border-c-purple shadow-md' 
                         : 'bg-white text-gray-500 border-gray-200 hover:border-c-purple hover:text-c-purple'}`}
                   >
                     {min}m
                   </button>
                 ))}
               </div>
             </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1 ml-1">
              <MapPin size={12}/> 地點 (導航用)
            </label>
            <input 
              type="text" 
              value={formData.location || ''}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-c-purple focus:bg-white outline-none transition text-sm font-medium text-gray-700 placeholder-gray-300"
              placeholder="輸入地點名稱或地址..."
            />
          </div>

          {/* Description with AI */}
          <div className="relative group">
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">詳細說明</label>
              <button 
                onClick={handleAIGenerate}
                className="text-[10px] flex items-center gap-1 text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 rounded-full hover:shadow-lg hover:scale-105 transition-all font-bold shadow-md active:scale-95"
                title="自動產生描述"
              >
                <Sparkles size={10} className="animate-pulse"/> AI 寫內容
              </button>
            </div>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-c-purple focus:bg-white outline-none h-28 resize-none text-sm text-gray-700 placeholder-gray-300 leading-relaxed"
              placeholder="備註、注意事項、必買清單..."
            />
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 bg-white">
           <button 
             onClick={handleSubmit} 
             className="w-full bg-gradient-to-r from-c-purple to-c-sky hover:from-purple-600 hover:to-sky-500 text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-c-purple/20 active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
           >
             {item ? <Edit2Icon size={20}/> : <PlusIcon size={20}/>}
             {item ? '儲存變更' : '確認新增'}
           </button>
        </div>
      </div>
    </div>
  );
};

const Edit2Icon = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const PlusIcon = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default EditModal;
