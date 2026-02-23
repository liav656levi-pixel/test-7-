import { useState, useEffect } from 'react';
import { 
  Menu, 
  ShoppingCart, 
  Plus,
  Phone,
  MapPin,
  Instagram,
  Star,
  ReceiptText,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  cartId: string;
  product: Product;
  addOns: string[];
  totalPrice: number;
  quantity: number;
}

const ADD_ONS: AddOn[] = [
  { id: 'plain', name: 'נקי', price: 0 },
  { id: 'walnuts', name: 'אגוזי מלך', price: 5 },
  { id: 'pecan', name: 'פקאן', price: 5 },
  { id: 'seeds_mix', name: 'תערובת גרעינים', price: 5 },
  { id: 'kalamata', name: 'זיתי קלמטה', price: 5 },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "מחמצת כוסמין קלאסית",
    description: "100% קמח כוסמין. לחם עשיר בסיבים תזונתיים, בעל מרקם רך וטעם עמוק של מחמצת טבעית.",
    price: 30,
    category: "כוסמין",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRZBdzHp5_sKQosw5NBJE3p_435uZSTYuxSdAkRjLOvbD5BOwO5ekHemAJhV6f-ucqcKgir1bipAOfWOYsX6Ib7A99OTBDYGOc_daTtHoqp8WSchFh0W0pshDjSXrCbvDCpNe6c6ryxA8_02bXhXeE9UpYXCQrJ009XiT_aG3e5lilQmf7sR-E3LufkVTQbqZhe_7N00HnoN8VtGN65Hy3ZWU8N6z-x6mKo7DKJWpnBdHbjN7TfFLQDVO_JWM2jzYbWqP4b5yjaHZT"
  },
  {
    id: 2,
    name: "מחמצת חיטה מלאה",
    description: "100% קמח חיטה מלאה. לחם בריא ומשביע, נאפה בתהליך תסיסה ארוך לשמירה על הערכים התזונתיים.",
    price: 30,
    category: "חיטה מלאה",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZDeaSdtPFUHb9aCEtqdX7R2wNs_N-xKkv3ZDafQxZEuRtkPCTOfUtbY42xeVsaOXuRo6SWZpYJG5Eitkh0fwnXQFKcGVnrNG-yPEbYeJCI1X9QcCHx8_vp24PV-J-BsfICVibQsuilU2hd5YlzeD8r67Kuis2qnCas2gGem_ZC6YT4r8rsLXPswq-gdmJmH8B2boXqka7t6PGTHiP8zTQh6jadhzKM69IUZKWAAorxr8MaB9ydOA7r32tSRqVMGsZrOazLz_xpgT"
  },
  {
    id: 3,
    name: "מחמצת ללא גלוטן",
    description: "תערובת קמחי מקור איכותיים ללא גלוטן בתהליך מחמצת טבעי וארוך. מרקם מפתיע וטעם נפלא.",
    price: 38,
    category: "ללא גלוטן",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrOVPYhP1aLXeCx2a2w61NcENELCcnZUyHxSC_XNrEPByG0htPg315bhSxAmpLI7Hj_flIkz-e71w25Wu6BUQVRRfm0YcSOwWxXSAGsrzCy71kJnEMVAmX-a6Bf2uK921zosmtszAYmxHVjab8PhrtFKBgo7iATbH8Q5oT4OSIDBK8KiFrN4K3QSapcP0Q4lZTU9qZ0BzvzDAFenK7BD1_dsI3l3T8Sdt0606ccPdfLUaAKVka2CikCnTImhFxNGDR2NfM-FtTYC2h"
  }
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;
        if (currentScrollY > lastScrollY && currentScrollY > 100) setShowHeader(false);
        else setShowHeader(true);
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  const handleAddToCart = (product: Product, addOns: string[] = []) => {
    const hasRealAddOns = addOns.some(id => id !== 'plain');
    const itemPrice = product.price + (hasRealAddOns ? 5 : 0);

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify([...item.addOns].sort()) === JSON.stringify([...addOns].sort())
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
          totalPrice: newItems[existingItemIndex].totalPrice + itemPrice
        };
        return newItems;
      }

      return [...prev, {
        cartId: Math.random().toString(36).substr(2, 9),
        product,
        addOns,
        totalPrice: itemPrice,
        quantity: 1
      }];
    });
    setCustomizingProduct(null);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      if (id === 'plain') return prev.includes('plain') ? [] : ['plain'];
      const filtered = prev.filter(a => a !== 'plain');
      return filtered.includes(id) ? filtered.filter(a => a !== id) : [...filtered, id];
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        const unitPrice = item.totalPrice / item.quantity;
        return { ...item, quantity: newQuantity, totalPrice: unitPrice * newQuantity };
      }
      return item;
    }));
  };

  const getCartTotal = () => cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const getCartItemsCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sendOrderWhatsApp = () => {
    const orderDetails = cartItems.map(item => {
      const addOnsText = item.addOns.length > 0 
        ? ` (תוספות: ${item.addOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ')})`
        : '';
      return `- ${item.product.name}${addOnsText} x${item.quantity}: ₪${item.totalPrice}`;
    }).join('\n');

    const message = encodeURIComponent(`שלום,\nאשמח להזמין:\n\n${orderDetails}\n\nסה"כ: ₪${getCartTotal()}\nתודה!`);
    window.open(`https://wa.me/972555567714?text=${message}`, '_blank');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#FAF9F6]" dir="rtl">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 glass px-6 py-5 flex items-center justify-between border-b border-primary/10 transition-transform duration-500 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center">
          <button 
            onClick={() => setShowNav(true)}
            className="p-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-2xl transition-all border border-primary/10"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Sabrosa</h1>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary mt-1">Artisan Bakery</span>
        </div>
        <div className="w-12" />
      </header>

      {/* Side Nav */}
      <AnimatePresence>
        {showNav && (
          <div className="fixed inset-0 z-[150] flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNav(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="relative w-full max-w-[280px] bg-[#FAF9F6] h-full shadow-2xl flex flex-col">
              <div className="p-8 border-b border-primary/10 flex items-center justify-between">
                <h3 className="text-2xl font-black italic">תפריט</h3>
                <button onClick={() => setShowNav(false)} className="p-2 hover:bg-primary/10 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 p-8 space-y-6">
                <button onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setShowNav(false); }} className="block w-full text-right text-xl font-serif italic hover:text-primary">הסיפור שלנו</button>
                <button onClick={() => { document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); setShowNav(false); }} className="block w-full text-right text-xl font-serif italic hover:text-primary">התפריט שלנו</button>
                <button onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setShowNav(false); }} className="block w-full text-right text-xl font-serif italic hover:text-primary">צור קשר</button>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 pb-12 pt-24">
        {/* Hero */}
        <div className="px-6 py-8">
          <div className="relative h-[30rem] w-full overflow-hidden rounded-[3rem] shadow-2xl">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGozF64yDtA_fja7KBZ1-FLEehg6jIRZj3F7_IDma9Mfr9OV9Rn2nUGtJ_y3UVBOejoIlPX74JCqluyIE-8KFLiawCHwNalhwtWnUV2OtRCEqDy_LqR4DduwHAbpVLXxgDz-Exnlq24YSlXVje7ymPX-5ahrVlF0pynY1kZiYLU6q8nYViMNBLbVbVApwPjO0h2Gn4lpKpvFR3tTPUpNnVq8VYufjH_QyjhNlg8RqvIoAI4zGn7Kpz0eRpzPYQs8dpkWYYpez1dMHq" className="h-full w-full object-cover scale-110" alt="Hero" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-3xl pointer-events-none">
              <svg viewBox="0 0 500 150" className="w-full drop-shadow-2xl">
                <path id="heroCurve" d="M 50,120 Q 250,20 450,120" fill="transparent" />
                <text className="fill-white font-serif italic text-5xl font-black uppercase tracking-[0.3em]">
                  <textPath xlinkHref="#heroCurve" startOffset="50%" textAnchor="middle">Sabrosa</textPath>
                </text>
                <text y="140" x="250" textAnchor="middle" className="fill-white/80 font-sans text-[10px] font-black uppercase tracking-[0.6em]">Artisan Bakery</text>
              </svg>
            </div>
          </div>
        </div>

        {/* About */}
        <section id="about" className="px-6 py-16 bg-primary/5 my-12 rounded-[3rem] mx-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-serif italic font-black mb-8">הסיפור שלנו</h3>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium italic">
              <p>הכל התחיל מרצון אמיתי ללחם טוב, כזה שנעשה בלי פשרות ובלי רגשות אשם.</p>
              <p>המחמצת שלנו עוברת תסיסה איטית של 24 שעות להעמקת הטעמים. כל כיכר נאפית בעבודת יד עם המון אהבה.</p>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="px-6 mb-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-3xl font-serif italic font-black">התפריט שלנו</h3>
            <div className="mt-4 flex justify-center gap-4">
              <div className="h-px w-12 bg-primary/20 self-center" />
              <div className="w-2 h-2 rounded-full bg-primary/20 self-center" />
              <div className="h-px w-12 bg-primary/20 self-center" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-lg">
                <img src={product.image} className="h-64 w-full object-cover" alt={product.name} referrerPolicy="no-referrer" />
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-2xl font-serif italic font-black mb-1">{product.name}</h4>
                  {product.id === 1 && <div className="flex items-center gap-1 mb-3 text-primary"><Star className="w-3 h-3 fill-current" /><span className="text-[10px] font-black uppercase">המומלץ שלנו</span></div>}
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">{product.description}</p>
                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <span className="text-xl font-black text-primary">₪{product.price}</span>
                    <button onClick={() => { setCustomizingProduct(product); setSelectedAddOns([]); }} className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">הוסף לסל</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="px-6 py-16 border-t border-primary/10 mt-20">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-4xl font-serif italic font-black">צרו קשר</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary"><Phone className="w-5 h-5" /></div>
                  <div><p className="text-[10px] font-black text-slate-400">טלפון</p><p className="font-bold">055-5567714</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary"><Instagram className="w-5 h-5" /></div>
                  <div><p className="text-[10px] font-black text-slate-400">אינסטגרם</p><p className="font-bold">@liavbakery</p></div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary"><MapPin className="w-5 h-5" /></div>
                    <div><p className="text-[10px] font-black text-slate-400">מיקום</p><p className="font-bold">מושב קדרון</p></div>
                  </div>
                  <div className="relative w-full h-48 rounded-[2rem] overflow-hidden border border-primary/10">
                    <img src="https://picsum.photos/seed/bakery-map/800/400" className="w-full h-full object-cover grayscale opacity-50" alt="Map" />
                    <div className="absolute inset-0 flex items-center justify-center"><div className="bg-white p-3 rounded-xl shadow-xl flex flex-col items-center gap-1"><MapPin className="w-5 h-5 text-primary animate-bounce" /><span className="text-[10px] font-black">מושב קדרון</span></div></div>
                  </div>
                  <div className="flex gap-3">
                    <a href="https://waze.com/ul?ll=31.8219,34.8291&navigate=yes" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black bg-primary/10 text-primary px-4 py-2 rounded-xl">Waze</a>
                    <a href="https://www.google.com/maps/search/?api=1&query=מושב+קדרון" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black bg-primary/10 text-primary px-4 py-2 rounded-xl">Google Maps</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-xl">
              <h4 className="text-xl font-serif italic font-bold mb-6">זמני הזמנה ואיסוף</h4>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">סגירת הזמנות</span><span className="font-bold text-red-500">רביעי ב-16:00</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">יום חמישי</span><span className="font-bold">17:00 - 21:00</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-slate-500">יום שישי</span><span className="font-bold">08:00 - 12:00</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Cart */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <button onClick={() => setShowCart(true)} className="relative p-5 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-all">
          <ShoppingCart className="w-7 h-7" />
          {getCartItemsCount() > 0 && <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary text-xs font-black border-2 border-primary">{getCartItemsCount()}</span>}
        </button>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="relative w-full max-w-md bg-white h-full p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10"><h3 className="text-3xl font-black italic">הסל שלי</h3><button onClick={() => setShowCart(false)}><X /></button></div>
              <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                {cartItems.map(item => (
                  <div key={item.cartId} className="flex justify-between items-center border-b pb-4">
                    <div><p className="font-bold">{item.product.name}</p><p className="text-[10px] text-slate-400">{item.addOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ')}</p>
                      <div className="flex items-center gap-3 mt-2"><button onClick={() => updateQuantity(item.cartId, -1)} className="w-6 h-6 border rounded-full">-</button><span className="text-sm font-black">{item.quantity}</span><button onClick={() => updateQuantity(item.cartId, 1)} className="w-6 h-6 border rounded-full">+</button></div>
                    </div>
                    <span className="font-black">₪{item.totalPrice}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t mt-auto">
                <div className="flex justify-between mb-8 font-black text-2xl"><span>סה"כ:</span><span className="text-primary">₪{getCartTotal()}</span></div>
                <button onClick={sendOrderWhatsApp} className="w-full bg-primary text-white py-6 rounded-2xl font-black text-lg shadow-xl">הזמן עכשיו בוואצאפ</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customization Modal */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCustomizingProduct(null)} />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl">
              <h3 className="text-2xl font-serif italic font-black mb-8 text-center">תוספות ל{customizingProduct.name}</h3>
              <div className="space-y-4">
                {ADD_ONS.map(a => (
                  <button key={a.id} onClick={() => toggleAddOn(a.id)} className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${selectedAddOns.includes(a.id) ? 'border-primary bg-primary/5' : 'border-slate-100'}`}>
                    <span className="font-bold text-lg">{a.name}</span>
                    <span className="text-sm font-black text-primary">{a.id === 'plain' ? '₪0' : '₪5'}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => handleAddToCart(customizingProduct, selectedAddOns)} className="w-full bg-primary text-white py-6 rounded-2xl mt-10 font-black text-lg shadow-xl">אישור והוספה</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
