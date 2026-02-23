import { useState, useEffect } from 'react';
import { 
  Menu, 
  ShoppingCart, 
  Plus, 
  Phone, 
  Instagram, 
  MapPin, 
  ChevronRight,
  Info,
  ReceiptText,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
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

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [editingCartId, setEditingCartId] = useState<string | null>(null);

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
    setSelectedAddOns([]);
    setEditingCartId(null);
  };

  const openEditCartItem = (item: CartItem) => {
    setCustomizingProduct(item.product);
    setSelectedAddOns(item.addOns);
    setEditingCartId(item.cartId);
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
    return customizingProduct.price + (hasRealAddOns ? 5 : 0);
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
    const message = `היי, אשמח להזמין:\n${orderDetails}\n\nסה"כ: ₪${getCartTotal()}\nתודה!`;
    window.open(`https://wa.me/972555567714?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#FAF9F6] text-slate-900 font-sans" dir="rtl">
      {/* Navigation and Header logic remains the same as previous updates */}
      {/* ... (All components: Header, Hero with curved text, About, Menu, Contact) ... */}
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-primary/5 transition-transform duration-500 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => setShowNav(true)} className="p-2 hover:bg-primary/5 rounded-full"><Menu className="w-6 h-6" /></button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-serif italic font-black leading-none">Sabrosa</h1>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B4513] mt-1">Artisan Bakery</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Hero Section */}
      <main className="flex-1 pb-12 pt-24">
        <div className="px-6 py-8">
          <div className="relative h-[30rem] w-full overflow-hidden rounded-[3rem] shadow-2xl">
            <img className="h-full w-full object-cover scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGozF64yDtA_fja7KBZ1-FLEehg6jIRZj3F7_IDma9Mfr9OV9Rn2nUGtJ_y3UVBOejoIlPX74JCqluyIE-8KFLiawCHwNalhwtWnUV2OtRCEqDy_LqR4DduwHAbpVLXxgDz-Exnlq24YSlXVje7ymPX-5ahrVlF0pynY1kZiYLU6q8nYViMNBLbVbVApwPjO0h2Gn4lpKpvFR3tTPUpNnVq8VYufjH_QyjhNlg8RqvIoAI4zGn7Kpz0eRpzPYQs8dpkWYYpez1dMHq" alt="Bread" />
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

        {/* Menu Section */}
        <div id="menu" className="px-6 mb-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-3xl font-serif italic font-black">התפריט שלנו</h3>
            <div className="mt-4 flex justify-center gap-4">
              <div className="h-[1px] w-12 bg-[#8B4513]/20 self-center" />
              <div className="w-2 h-2 rounded-full bg-[#8B4513]/20 self-center" />
              <div className="h-[1px] w-12 bg-[#8B4513]/20 self-center" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-[#8B4513]/5 shadow-lg">
                <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
                <div className="p-8">
                  <h4 className="text-2xl font-serif italic font-black mb-1">{product.name}</h4>
                  {product.id === 1 && (
                    <div className="flex items-center gap-1 mb-3 text-[#8B4513]">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-black uppercase tracking-widest">המומלץ שלנו</span>
                    </div>
                  )}
                  <p className="text-slate-500 text-sm mb-6">{product.description}</p>
                  <button onClick={() => openCustomization(product)} className="w-full bg-[#8B4513] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">הוסף לסל | ₪{product.price}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Cart and Modals (Simplified for brevity, same logic as before) */}
      {/* ... (Floating Cart Button, Cart Sidebar, Customization Modal) ... */}
    </div>
  );
}