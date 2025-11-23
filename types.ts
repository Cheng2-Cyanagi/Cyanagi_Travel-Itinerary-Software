
export type Category = 'A' | 'B' | 'C' | 'D' | 'Critical' | 'Daily' | 'Costume' | 'Inventory' | 'Food' | 'Meetup' | 'Uncertain' | 'Todo';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  category: Category;
  date?: string; // ISO string YYYY-MM-DD
  time?: string; // ISO string HH:mm
  isCompleted: boolean;
  progress?: number; // 0-100
  location?: string;
  priority?: 'High' | 'Medium' | 'Low';
  suggestedDuration?: number; // in minutes
  timerStartedAt?: number; // timestamp
}

export const TIME_BASED_CATS: Category[] = ['Critical', 'A', 'B', 'C', 'D'];
export const FUNCTION_BASED_CATS: Category[] = ['Daily', 'Todo', 'Costume', 'Inventory', 'Food', 'Meetup', 'Uncertain'];

export const CATEGORY_LABELS: Record<Category, string> = {
  'Critical': '🔥 超級必要 (無法延後)',
  'Daily': '✅ 每日必做 (00:00 重置)',
  'Todo': '📝 待辦事項 (To-Do)',
  'Costume': '🛠️ 服裝製作 (CCF前完成)',
  'A': '📅 A. 半天以上行程',
  'B': '⏳ B. 3-4 小時短程',
  'C': '💤 C. 放鬆/低消耗',
  'D': '🆓 D. 填補空檔',
  'Inventory': '🎒 必備物品/購物',
  'Food': '🍜 必吃美食',
  'Meetup': '🤝 必約對象',
  'Uncertain': '❓ 待確認行程'
};

// 青凪色票：#C5FFF8 (Light), #96EFFF (Cyan), #5FBDFF (Sky), #7B66FF (Purple)
export const CATEGORY_COLORS: Record<Category, string> = {
  'Critical': 'border-l-4 border-red-400 bg-white/90 ring-1 ring-red-100 shadow-red-100/50',
  'Daily': 'border-l-4 border-[#7B66FF] bg-white/90 ring-1 ring-[#7B66FF]/20 shadow-[#7B66FF]/10',
  'Todo': 'border-l-4 border-[#5FBDFF] bg-white/90 ring-1 ring-[#5FBDFF]/20 shadow-[#5FBDFF]/10',
  'Costume': 'border-l-4 border-emerald-400 bg-white/90 ring-1 ring-emerald-100 shadow-emerald-100/50',
  
  'A': 'border-l-4 border-[#7B66FF] bg-white/80 ring-1 ring-[#7B66FF]/20',
  'B': 'border-l-4 border-[#5FBDFF] bg-white/80 ring-1 ring-[#5FBDFF]/20',
  'C': 'border-l-4 border-[#96EFFF] bg-white/80 ring-1 ring-[#96EFFF]/40',
  'D': 'border-l-4 border-gray-300 bg-white/80 ring-1 ring-gray-200',
  
  'Inventory': 'border-l-4 border-[#96EFFF] bg-white/90 ring-1 ring-[#96EFFF]/40',
  'Food': 'border-l-4 border-pink-400 bg-white/90 ring-1 ring-pink-100',
  'Meetup': 'border-l-4 border-indigo-400 bg-white/90 ring-1 ring-indigo-100',
  'Uncertain': 'border-l-4 border-slate-300 bg-slate-50/80 ring-1 ring-slate-200'
};

// Badge Styles - Modern Pill Design
export const CATEGORY_BADGE_STYLES: Record<Category, string> = {
  'Critical': 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
  'Daily': 'bg-[#7B66FF]/10 text-[#7B66FF] border-[#7B66FF]/20 hover:bg-[#7B66FF]/20',
  'Todo': 'bg-[#5FBDFF]/10 text-[#5FBDFF] border-[#5FBDFF]/20 hover:bg-[#5FBDFF]/20',
  'Costume': 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
  'A': 'bg-[#7B66FF]/5 text-[#7B66FF] border-[#7B66FF]/20 hover:bg-[#7B66FF]/10',
  'B': 'bg-[#5FBDFF]/5 text-[#5FBDFF] border-[#5FBDFF]/20 hover:bg-[#5FBDFF]/10',
  'C': 'bg-[#96EFFF]/20 text-teal-600 border-[#96EFFF]/50 hover:bg-[#96EFFF]/30', 
  'D': 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100',
  'Inventory': 'bg-[#96EFFF]/20 text-teal-600 border-[#96EFFF]/50 hover:bg-[#96EFFF]/30',
  'Food': 'bg-pink-50 text-pink-500 border-pink-200 hover:bg-pink-100',
  'Meetup': 'bg-indigo-50 text-indigo-500 border-indigo-200 hover:bg-indigo-100',
  'Uncertain': 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
};

// Dot Colors for Calendar
export const CATEGORY_DOT_COLORS: Record<Category, string> = {
  'Critical': 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
  'Daily': 'bg-[#7B66FF] shadow-[0_0_8px_rgba(123,102,255,0.6)]',
  'Todo': 'bg-[#5FBDFF]',
  'Costume': 'bg-emerald-500',
  'A': 'bg-[#7B66FF]',
  'B': 'bg-[#5FBDFF]',
  'C': 'bg-[#96EFFF]',
  'D': 'bg-gray-400',
  'Inventory': 'bg-[#96EFFF]',
  'Food': 'bg-pink-400',
  'Meetup': 'bg-indigo-400',
  'Uncertain': 'bg-slate-300'
};
