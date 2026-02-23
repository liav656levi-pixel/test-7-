/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Menu, 
  ShoppingCart, 
  Home, 
  UtensilsCrossed, 
  ReceiptText, 
  User,
  Plus,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    description: "100% קמח כוסמין",
    price: 30,
    category: "כוסמין",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRZBdzHp5_sKQosw5NBJE3p_435uZSTYuxSdAkRjLOvbD5BOwO5ekHemAJhV6f-ucqcKgir1bipAOfWOYsX6Ib7A99OTBDYGOc_daTtHoqp8WSchFh0W0pshDjSXrCbvDCpNe6c6ryxA8_02bXhXeE9UpYXCQrJ009XiT_aG3e5lilQmf7sR-E3LufkVTQbqZhe_7N00HnoN8VtGN65Hy3ZWU8N6z-x6mKo7DKJWpnBdHbjN7TfFLQDVO_JWM2jzYbWqP4b5yjaHZT"
  },
  {
    id: 2,
    name: "מחמצת חיטה מלאה",
    description: "100% קמח חיטה מלאה",
    price: 30,
    category: "חיטה מלאה",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZDeaSdtPFUHb9aCEtqdX7R2wNs_N-xKkv3ZDafQxZEuRtkPCTOfUtbY42xeVsaOXuRo6SWZpYJG5Eitkh0fwnXQFKcGVnrNG-yPEbYeJCI1X9QcCHx8_vp24PV-J-BsfICVibQsuilU2hd5YlzeD8r67Kuis2qnCas2gGem_ZC6YT4r8rsLXPswq-gdmJmH8B2boXqka7t6PGTHiP8zTQh6jadhzKM69IUZKWAAorxr8MaB9ydOA7r32tSRqVMGsZrOazLz_xpgT"
  },
  {
    id: 3,
    name: "מחמצת מתערובת קמחים ללא גלוטן",
    description: "תערובת קמחי מקור איכותיים ללא גלוטן בתהליך מחמצת טבעי וארוך.",
    price: 38,
    category: "ללא גלוטן",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrOVPYhP1aLXeCx2a2w61NcENELCcnZUyHxSC_XNrEPByG0htPg315bhSxAmpLI7Hj_flIkz-e71w25Wu6BUQVRRfm0YcSOwWxXSAGsrzCy71kJnEMVAmX-a6Bf2uK921zosmtszAYmxHVjab8PhrtFKBgo7iATbH8Q5oT4OSIDBK8KiFrN4K3QSapcP0Q4lZTU9qZ0BzvzDAFenK7BD1_dsI3l3T8Sdt0606ccPdfLUaAKVka2CikCnTImhFxNGDR2NfM-FtTYC2h"
  }
];

const CATEGORIES = ["הכל", "כוסמין", "חיטה מלאה", "ללא גלוטן"];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [editingCartId, setEditingCartId] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  const handleAddToCart = (product: Product, addOns: string[] = []) => {
    const hasRealAddOns = addOns.some(id => id !== 'plain');
    const addOnsTotal = hasRealAddOns ? 5 : 0;
    const itemPrice = product.price + addOnsTotal;

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

      const newItem: CartItem = {
        cartId: Math.random().toString(36).substr(2, 9),
        product,
        addOns,
        totalPrice: itemPrice,
        quantity: 1
      };
      return [...prev, newItem];
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openCustomization = (product: Product) => {
    setCustomizingProduct(product);
    setEditingCartId(null);
    setSelectedAddOns([]);
  };

  const openEditCartItem = (item: CartItem) => {
    setCustomizingProduct(item.product);
    setEditingCartId(item.cartId);
    setSelectedAddOns(item.addOns);
    setShowCart(false);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      if (id === 'plain') return prev.includes('plain') ? [] : ['plain'];
      const filtered = prev.filter(a => a !== 'plain');
      return filtered.includes(id) ? filtered.filter(a => a !== id) : [...filtered, id];
    });
  };

  const confirmCustomization = () => {
    if (customizingProduct) {
      const hasRealAddOns = selectedAddOns.some(id => id !== 'plain');
      const addOnsTotal = hasRealAddOns ? 5 : 0;
      const itemPrice = customizingProduct.price + addOnsTotal;

      if (editingCartId) {
        setCartItems(prev => prev.map(item => 
          item.cartId === editingCartId 
            ? { ...item, addOns: selectedAddOns, totalPrice: itemPrice * item.quantity }
            : item
        ));
        setShowCart(true);
      } else {
        handleAddToCart(customizingProduct, selectedAddOns);
      }
      setCustomizingProduct(null);
      setEditingCartId(null);
    }
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
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

  const calculateTotalPrice = () => {
    if (!customizingProduct) return 0;
    const hasRealAddOns = selectedAddOns.some(id => id !== 'plain');
    const addOnsTotal = hasRealAddOns ? 5 : 0;
    return customizingProduct.price + addOnsTotal;
  };

  const getCartTotal = () => cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const getCartItemsCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sendOrderWhatsApp = () => {
    const orderDetails = cartItems.map(item => {
      const addOnsText = item.addOns.length > 0 
        ? ` (תוספות: ${item.addOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ')})`
        : '';
      const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
      return `- ${item.product.name}${addOnsText}${quantityText}: ₪${item.totalPrice}`;
    }).join('\n');

    const total = getCartTotal();
    const message = encodeURIComponent(`שלום,\n\nאשמח להזמין את הלחמים הבאים:\n\n${orderDetails}\n\nסה"כ לתשלום: ₪${total}\n\nתודה!`);
    const myPhone = "972555567714"; 
    window.open(`https://wa.me/${myPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans" dir="rtl">
      {/* Side Navigation Menu */}
      <AnimatePresence>
        {showNav && (
          <div className="fixed inset-0 z-[150] flex justify-start">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowNav(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              className="relative w-full max-w-[280px] bg-background-light dark:bg-background-dark h-full shadow-2xl flex flex-col border-l border-primary/10"
            >
              <div className="p-8 border-b border-primary/10 flex items-center justify-between bg-white dark:bg-black/20">
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">תפריט</h3>
                <button onClick={() => setShowNav(false)} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <nav className="flex-1 p-8 space-y-6">
                {[
                  { id: 'about', label: 'הסיפור שלנו' },
                  { id: 'menu', label: 'התפריט שלנו' },
                  { id: 'contact', label: 'צור קשר' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      setShowNav(false);
                    }}
                    className="block w-full text-right text-xl font-serif italic hover:text-primary transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-8 border-t border-primary/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Sabrosa Artisan Bakery
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <div className="bg-white/20 rounded-full p-1"><Plus className="w-4 h-4 text-white" /></div>
            <span className="text-sm font-bold tracking-tight">התווסף לסל בהצלחה!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="relative w-full max-w-md bg-background-light dark:bg-background-dark h-full shadow-2xl flex flex-col border-r border-primary/10"
            >
              <div className="p-8 border-b border-primary/10 flex items-center justify-between bg-white dark:bg-black/20">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase italic">הסל שלי</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">{getCartItemsCount()} פריטים</p>
                </div>
                <button onClick={() => setShowCart(false)} className="p-3 hover:bg-primary/10 rounded-full transition-colors border border-primary/10">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center">
                      <ShoppingCart className="w-10 h-10 opacity-20 text-primary" />
                    </div>
                    <p className="text-xl font-serif italic">הסל שלך ריק כרגע</p>
                    <button onClick={() => setShowCart(false)} className="bg-primary text-white px-8 py-3 rounded-full font-bold">חזרה לחנות</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <motion.div layout key={item.cartId} className="group flex gap-5 bg-white dark:bg-white/5 p-5 rounded-3xl border border-primary/5 shadow-sm">
                        <div className="relative">
                          <img src={item.product.image} className="w-24 h-24 object-cover rounded-2xl" alt={item.product.name} referrerPolicy="no-referrer" />
                          <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">₪{item.totalPrice}</div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-xl leading-tight">{item.product.name}</h4>
                              <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-2 py-1">
                                <button onClick={() => updateQuantity(item.cartId, -1)} className="text-primary p-1"><Plus className="w-3 h-3 rotate-45" /></button>
                                <span className="text-xs font-black">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartId, 1)} className="text-primary p-1"><Plus className="w-3 h-3" /></button>
                              </div>
                            </div>
                            {item.addOns.length > 0 && (
                              <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-2 opacity-70">
                                {item.addOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(' • ')}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-4 mt-4">
                            <button onClick={() => openEditCartItem(item)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">עריכה</button>
                            <button onClick={() => removeFromCart(item.cartId)} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500">הסרה</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-8 border-t border-primary/10 bg-white dark:bg-black/20">
                  <div className="flex items-end justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">סה"כ לתשלום</span>
                      <span className="text-4xl font-serif italic font-black text-primary">₪{getCartTotal()}</span>
                    </div>
                  </div>
                  <button onClick={sendOrderWhatsApp} className="w-full bg-primary text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 uppercase tracking-widest">
                    שלח בוואצאפ <span className="opacity-50">|</span> ₪{getCartTotal()}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customization Modal */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setCustomizingProduct(null); if (editingCartId) setShowCart(true); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%", scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: "100%", scale: 0.95 }}
              className="relative w-full max-w-2xl bg-background-light dark:bg-background-dark rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-72 w-full shrink-0">
                <img src={customizingProduct.image} className="w-full h-full object-cover" alt={customizingProduct.name} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button onClick={() => { setCustomizingProduct(null); if (editingCartId) setShowCart(true); }} className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white p-3 rounded-full border border-white/20">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
                <div className="absolute bottom-6 right-8 left-8 text-white">
                  <h3 className="text-4xl font-serif italic font-black mb-2 drop-shadow-lg">{customizingProduct.name}</h3>
                  <p className="text-white/80 text-sm max-w-md drop-shadow-md">{customizingProduct.description}</p>
                </div>
              </div>
              
              <div className="p-8 pt-2 overflow-y-auto no-scrollbar">
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-6">
                    <h4 className="font-black text-xs uppercase tracking-[0.3em] text-primary">שדרוגים ותוספות</h4>
                    <span className="text-[10px] font-bold text-slate-400 italic">בחירה מרובה</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ADD_ONS.map((addon) => (
                      <button 
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`group flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all ${
                          selectedAddOns.includes(addon.id)
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAddOns.includes(addon.id) ? "bg-primary border-primary" : "border-slate-300"}`}>
                            {selectedAddOns.includes(addon.id) && <Plus className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-bold text-sm tracking-tight">{addon.name}</span>
                        </div>
                        <span className={`text-xs font-black ${selectedAddOns.includes(addon.id) ? "text-primary" : "text-slate-400"}`}>₪{addon.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white dark:bg-black/20 border-t border-primary/10 flex items-center justify-between gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">סה"כ</span>
                  <span className="text-3xl font-serif italic font-black text-primary">₪{calculateTotalPrice()}</span>
                </div>
                <button onClick={confirmCustomization} className="flex-1 bg-primary text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 uppercase tracking-widest">
                  {editingCartId ? 'עדכן הזמנה' : 'הוסף לסל'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 glass px-6 py-5 flex items-center justify-between border-b border-primary/10 transition-transform duration-500 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center">
          <button onClick={() => setShowNav(true)} className="p-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-2xl transition-all border border-primary/10" aria-label="תפריט">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">Sabrosa</h1>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary mt-1">Artisan Bakery</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Floating Cart Button */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <button onClick={() => setShowCart(true)} className="relative p-5 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all group">
          <ShoppingCart className="w-7 h-7" />
          <AnimatePresence>
            {getCartItemsCount() > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary text-xs font-black shadow-xl border-2 border-primary">
                {getCartItemsCount()}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <main className="flex-1 pb-12 pt-24">
        {/* Hero Section */}
        <div className="px-6 py-8">
          <div className="relative h-[30rem] w-full overflow-hidden rounded-[3rem] shadow-2xl">
            <img alt="Artisan Bread" className="h-full w-full object-cover scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGozF64yDtA_fja7KBZ1-FLEehg6jIRZj3F7_IDma9Mfr9OV9Rn2nUGtJ_y3UVBOejoIlPX74JCqluyIE-8KFLiawCHwNalhwtWnUV2OtRCEqDy_LqR4DduwHAbpVLXxgDz-Exnlq24YSlXVje7ymPX-5ahrVlF0pynY1kZiYLU6q8nYViMNBLbVbVApwPjO0h2Gn4lpKpvFR3tTPUpNnVq8VYufjH_QyjhNlg8RqvIoAI4zGn7Kpz0eRpzPYQs8dpkWYYpez1dMHq" referrerPolicy="no-referrer" />
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

        {/* About Section */}
        <section id="about" className="px-6 py-16 bg-primary/5 my-12 rounded-[3rem] mx-6">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-serif italic font-black mb-8">הסיפור שלנו</h3>
            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
              <p>הכל התחיל מרצון אמיתי ללחם טוב, כזה שנעשה בלי פשרות ובלי רגשות אשם, רצינו ליצור לחם שעונה על הצרכים של כולם – תערובת קמחים ללא גלוטן, כוסמין עשיר או חיטה מלאה.</p>
              <p>המחמצת שלנו עוברת תסיסה איטית ומבוקרת של 24 שעות להעמקת הטעמים והמרקם, המחמצת נאפית במיוחד עבורכם בעבודת יד, אנחנו משתמשים אך ורק בקמחי מקור איכותיים ובמחמצת ביתית טבעית, בלי קיצורי דרך ובלי שמרים תעשייתיים, בדיוק כמו שלחם אמיתי צריך להיות.</p>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <div id="menu" className="px-6 mb-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-3xl font-serif italic font-black">התפריט שלנו</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={product.id} className="group flex flex-col bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 w-full overflow-hidden">
                  <img alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" src={product.image} referrerPolicy="no-referrer" />
                  <div className="absolute top-6 left-6 glass px-4 py-2 rounded-2xl">
                    <span className="text-primary font-black text-lg">₪{product.price}</span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary px-2 py-1 bg-primary/5 rounded-md">{product.category}</span>
                    </div>
                    <h4 className="text-2xl font-serif italic font-black mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                    {product.id === 1 && (
                      <div className="flex items-center gap-1 mb-3 text-primary">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">המומלץ שלנו</span>
                      </div>
                    )}
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">{product.description}</p>
                  </div>
                  <div className="flex gap-3 mt-auto pt-8">
                    <button onClick={() => openCustomization(product)} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/10">הוסף לסל</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <section id="contact" className="px-6 py-16 border-t border-primary/10 mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-4xl font-serif italic font-black mb-6">צרו קשר</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center"><Phone className="w-5 h-5" /></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">טלפון</p><p className="font-bold">055-5567714</p></div>
                  </div>
                  <a href="https://instagram.com/liavbakery" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all"><Instagram className="w-5 h-5" /></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">אינסטגרם</p><p className="font-bold">@liavbakery</p></div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">מיקום</p><p className="font-bold">מושב קדרון</p></div>
                  </div>
                  <div className="flex gap-3">
                    <a href="https://waze.com/ul?ll=31.8219,34.8291&navigate=yes" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-4 py-2 rounded-xl">Waze</a>
                    <a href="https://www.google.com/maps/search/?api=1&query=מושב+קדרון" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-4 py-2 rounded-xl">Google Maps</a>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-primary/5 shadow-xl">
                <h4 className="text-xl font-serif italic font-bold mb-6">זמני הזמנה ואיסוף</h4>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-primary/5 pb-2">
                    <span className="text-slate-500">סגירת הזמנות</span>
                    <span className="font-bold text-red-500">רביעי ב-16:00</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">חלונות איסוף:</p>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-primary/5 pb-2">
                        <span className="text-slate-500">יום חמישי</span>
                        <span className="font-bold">17:00 - 21:00</span>
                      </div>
                      <div className="flex justify-between border-b border-primary/5 pb-2">
                        <span className="text-slate-500">יום שישי</span>
                        <span className="font-bold">08:00 - 12:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
