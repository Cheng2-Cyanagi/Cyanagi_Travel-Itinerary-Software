
import { TodoItem } from './types';
import { v4 as uuidv4 } from 'uuid';

// Helper to create items easily
const createItem = (title: string, category: any, desc: string = "", date?: string, progress: number = 0, time?: string): TodoItem => ({
  id: uuidv4(),
  title,
  category,
  description: desc,
  date: date ? `2026-${date}` : undefined,
  time: time,
  isCompleted: false,
  progress,
  priority: 'Medium'
});

export const INITIAL_DATA: TodoItem[] = [
  // --- Critical ---
  createItem("印製認親卡/名片", 'Critical', "務必於 4/5 前完成設計與送印，以免開天窗。", "04-04"),
  createItem("季雪專場", 'Critical', "16:00 - 22:00。需提前確認交通與門票。", "04-05", 0, "16:00"),
  createItem("獸曜日 (嘉義日招所)", 'Critical', "需轉乘高鐵 & 區間車，注意轉乘時間。", "04-12"),
  createItem("計畫通行專場", 'Critical', "16:00 開始。準備好體力與應援物。", "04-19", 0, "16:00"),
  createItem("公視送禮", 'Critical', "地點：公視 A 棟 1F。送出巧克力 & 牛皮紙袋。", "04-22"),
  createItem("CCF", 'Critical', "全天活動。服裝務必在此之前 100% 完成。", "04-26", 0, "09:00"),
  createItem("PF Day1", 'Critical', "全天活動。主要場次。", "05-03", 0, "10:00"),
  createItem("PF Day2", 'Critical', "全天活動。收尾與交流。", "05-04", 0, "10:00"),

  // --- Daily ---
  createItem("打音遊", 'Daily', "維持手感習慣，每日至少一局。"),
  
  // --- Costume (Progress Tracking) ---
  createItem("綠色帽外套", 'Costume', "尋找版型或現成品修改。", undefined, 25),
  createItem("客製化修字白T", 'Costume', "設計圖稿並送印。", undefined, 0),
  createItem("黑色工裝褲", 'Costume', "需有多口袋設計，確認尺寸。", undefined, 50),
  createItem("綠色點綴球鞋", 'Costume', "尋找配色相符的款式。", undefined, 0),
  createItem("仿起司片裝飾", 'Costume', "造型用道具，需耐用。", undefined, 75),
  createItem("綠色隱眼", 'Costume', "特殊造型用，確認度數。", undefined, 0),
  createItem("黑色細全框眼鏡", 'Costume', "無鏡片，造型用。", undefined, 100),

  // --- A (Long) ---
  createItem("潮月沙茶匠 (桃園)", 'A', "知名沙茶火鍋，建議預留半天含交通與用餐。", "04-14"), 
  createItem("偏圓人 (八德)", 'A', "特色餐飲或活動地點，需交通時間。"),
  createItem("胖老虎桌遊 (板橋)", 'A', "適合多人同樂，建議下午時段。"),
  createItem("小樽中山店 (台北)", 'A', "逛街與用餐行程。"),
  createItem("高雄市立圖書館 & 翰林/咖啡", 'A', "參觀樓上建築設計，並於館內用餐。", undefined),
  createItem("烏托邦 獸人派對", 'A', "注意官方公告與納納熊預告。"),
  createItem("台中麗寶福容 + Outlet", 'A', "體驗獸無限場景，適合拍照。", undefined),

  // --- B (Short) ---
  createItem("三創十二樓 & 光華", 'B', "3C愛好者必逛，有炬集站時可去。"),
  createItem("椅人彩券行 (圓山)", 'B', "給椅人店長書親簽，順便試手氣。"),
  createItem("草空間 (北車)", 'B', "放鬆讀書的好地方，週一至週四擇一日去。"),
  createItem("安利美特", 'B', "第一週順路可去，補給動漫周邊。"),
  createItem("虎之穴", 'B', "同安利美特行程。"),
  createItem("僑先班 (台師大)", 'B', "必去地點回顧。"),

  // --- C (Relax) ---
  createItem("冒險者公會", 'C', "等待四月初官方 Vtuber 活動，氣氛放鬆。"),
  createItem("綠境 Aroma (圓山)", 'C', "品嚐麻婆豆腐，購買紀念明信片。"),
  createItem("壽司郎", 'C', "連鎖壽司，適合轉換心情。"),
  createItem("藏壽司", 'C', "連鎖壽司，有扭蛋可玩。"),
  createItem("公館雪腐冰", 'C', "第一週必吃！口感綿密的雪花冰。"),
  createItem("士林 Do bar", 'C', "如果有八熊或汪歐駐唱時必去。"),

  // --- D (Filler) ---
  createItem("胡椒餅", 'D', "回家前隨手買一個當點心。"),
  createItem("台中逢甲逛街", 'D', "需等朋友確認時間，隨意逛逛。"),

  // --- Inventory/Essentials ---
  createItem("延長線 (3-4插座)", 'Inventory', "住宿必備，確保電子設備充電無虞。"),
  createItem("大且堅固的雨傘", 'Inventory', "北部天氣多變，需耐強風。"),
  createItem("風扇 E 罐升級", 'Inventory', "散熱必備，若有訂購記得攜帶。"),
  createItem("DHC 速攻藍莓和鋅", 'Inventory', "保持體力與視力清晰。"),
  createItem("燊燊的手燈", 'Inventory', "第一週就要拿，避免拖延。"),
  
  // --- Food ---
  createItem("萬華市場生魚片", 'Food', "經典台灣美食，新鮮平價。"),
  createItem("涼拌冷筍", 'Food', "清爽開胃，季節限定。"),
  createItem("彰化控肉飯 (史考特家附近)", 'Food', "經典彰化味，與史考特約時一起吃。"),
  createItem("烏托邦控肉飯", 'Food', "有活動時順便品嚐。"),
  createItem("果然匯", 'Food', "蔬食吃到飽，需揪團。"),
  createItem("三創美食", 'Food', "逛街累了就近解決。"),
  createItem("南港美食", 'Food', "看展覽時順便吃。"),
  createItem("台中 湯聚所", 'Food', "台中特色湯品料理。"),
  createItem("饒河街 - 好腸好嚐", 'Food', "香腸與大腸圈，夜市必吃。"),

  // --- Meetups ---
  createItem("小灰 (宜蘭)", 'Meetup', "宜蘭行程。"),
  createItem("黑鹿季雪 (台北/宜蘭)", 'Meetup', "一鹿向光2，表演行程。"),
  createItem("吳玉成 (拖鞋)", 'Meetup', "台中行程。"),
  createItem("燊燊", 'Meetup', "台中行程。拿Google月曆與手燈。"),
  createItem("張啟元 (七元)", 'Meetup', "台中鼓機廳。"),
  createItem("史考特", 'Meetup', "彰化特別工作室。"),
  createItem("帕洛特", 'Meetup', "如果有表演一定要排第一優先。"),
  createItem("軍龍", 'Meetup', "注意當月台聚與宣傳。"),

  // --- Uncertain ---
  createItem("新竹豐邑喜來登", 'Uncertain', "UTFG 參觀，時間未定。"),
  createItem("台中藍海影智炒飯", 'Uncertain', "與朋友見面時去吃。"),
  createItem("高雄展覽館", 'Uncertain', "參觀來不及參加的場地。"),
];
