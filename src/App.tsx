import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Utensils, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Share2, 
  Navigation, 
  Search, 
  Sparkles, 
  Plus, 
  Minus, 
  ShoppingBag, 
  X, 
  Check, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  ChefHat, 
  Award, 
  Info,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MENU_ITEMS, INITIAL_REVIEWS, MENU_CATEGORIES, MenuItem, Review } from "./data";

interface BagItem {
  id: string;
  name: string;
  price: number;
  portion: "half" | "full" | "standard";
  quantity: number;
  isVeg: boolean;
  category: string;
}

export default function App() {
  // Menu search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [onlySpecial, setOnlySpecial] = useState(false);
  const [maxBudget, setMaxBudget] = useState<number>(200);

  // Portion selection state for double-price items
  // Format: { [itemId]: 'half' | 'full' }
  const [itemPortions, setItemPortions] = useState<Record<string, "half" | "full">>({});

  // Bag / Combo builder states
  const [bag, setBag] = useState<BagItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewTag, setNewReviewTag] = useState("Awesome Taste");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [likedReviews, setLikedReviews] = useState<string[]>([]);

  // Surprise Combo generator
  const [surpriseCombo, setSurpriseCombo] = useState<{
    food: MenuItem;
    drink: MenuItem;
    foodPortion?: "half" | "full";
    total: number;
  } | null>(null);

  // Initialize data from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem("firangi_reviews");
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
    }

    const savedBag = localStorage.getItem("firangi_bag");
    if (savedBag) {
      try {
        setBag(JSON.parse(savedBag));
      } catch (e) {
        setBag([]);
      }
    }
  }, []);

  // Sync bag to localStorage
  useEffect(() => {
    if (bag.length > 0) {
      localStorage.setItem("firangi_bag", JSON.stringify(bag));
    } else {
      localStorage.removeItem("firangi_bag");
    }
  }, [bag]);

  // Calculate dynamic average and count of reviews
  const reviewStats = useMemo(() => {
    const totalCount = reviews.length + 37; // Based on 40 original reviews, we start with 3 (in data.ts) and add users' new ones.
    const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0) + (37 * 4.6); // Pad out the remaining 37 with the 4.6 average.
    const average = Math.round((sumRatings / totalCount) * 10) / 10;

    // Distribute star ratings beautifully
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating))) as 5|4|3|2|1;
      starCounts[rating] += 1;
    });

    // Add baseline distribution for the other 37 reviews
    starCounts[5] += 26;
    starCounts[4] += 8;
    starCounts[3] += 2;
    starCounts[2] += 1;
    starCounts[1] += 0;

    return {
      average,
      totalCount,
      starCounts
    };
  }, [reviews]);

  // Handle portion selection toggle for an item
  const handlePortionChange = (itemId: string, portion: "half" | "full") => {
    setItemPortions(prev => ({
      ...prev,
      [itemId]: portion
    }));
  };

  // Add item to bag
  const addToBag = (item: MenuItem) => {
    let price: number;
    let portionSelected: "half" | "full" | "standard" = "standard";

    if (typeof item.price === "object") {
      const selectedPortion = itemPortions[item.id] || "full";
      price = item.price[selectedPortion];
      portionSelected = selectedPortion;
    } else {
      price = item.price;
    }

    const uniqueId = `${item.id}-${portionSelected}`;

    setBag(prevBag => {
      const existing = prevBag.find(i => i.id === uniqueId);
      if (existing) {
        return prevBag.map(i => i.id === uniqueId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prevBag,
        {
          id: uniqueId,
          name: item.name,
          price,
          portion: portionSelected,
          quantity: 1,
          isVeg: item.isVeg,
          category: item.category
        }
      ];
    });

    // Open bag drawer so they see feedback
    setIsBagOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setBag(prevBag => {
      return prevBag.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is BagItem => item !== null);
    });
  };

  const clearBag = () => {
    setBag([]);
  };

  // Check the Under ₹200 Feast Challenge
  // Challenge criteria: Subtotal <= 200, contains at least one food item (not a shake/cooler/soup), and contains at least 1 drink/side.
  const bagSubtotal = bag.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const feastChallengeStatus = useMemo(() => {
    if (bag.length === 0) return { active: false, success: false, message: "Add items to check!" };
    
    const hasFood = bag.some(item => 
      ["MOMOS", "BURGER", "SANDWICH", "WRAP", "PASTA", "FRIES", "SPECIAL CHAAP", "FIRANGI'S SPL.", "CHINESE"].includes(item.category)
    );
    const hasDrink = bag.some(item => 
      ["ICE COOLER", "CLASSIC SHAKES", "FIRANGI SPL. SHAKE"].includes(item.category)
    );

    if (bagSubtotal > 200) {
      return {
        active: true,
        success: false,
        message: `Oops! Total is ₹${bagSubtotal}. Bring it down under ₹200 to win the Feast Challenge!`
      };
    }

    if (hasFood && hasDrink) {
      return {
        active: true,
        success: true,
        message: "🎉 Success! You built a perfect Fusion Feast (Food + Drink) under ₹200! Haryana Foodie Badge Unlocked!"
      };
    }

    return {
      active: true,
      success: false,
      message: "Add both a food item (Main) and a refreshing drink (Cooler/Shake) under ₹200!"
    };
  }, [bag, bagSubtotal]);

  // Filter items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesSpicy = !onlySpicy || item.isSpicy;
      const matchesSpecial = !onlySpecial || item.isSpecial;

      // Price filter
      let itemPrice = 0;
      if (typeof item.price === "object") {
        const portion = itemPortions[item.id] || "full";
        itemPrice = item.price[portion];
      } else {
        itemPrice = item.price;
      }
      const matchesBudget = itemPrice <= maxBudget;

      return matchesSearch && matchesCategory && matchesSpicy && matchesSpecial && matchesBudget;
    });
  }, [searchQuery, selectedCategory, onlySpicy, onlySpecial, maxBudget, itemPortions]);

  // Generate a surprise fusion combo
  const generateSurpriseCombo = () => {
    const foods = MENU_ITEMS.filter(item => 
      ["MOMOS", "BURGER", "SANDWICH", "WRAP", "PASTA", "FRIES", "SPECIAL CHAAP", "FIRANGI'S SPL.", "CHINESE"].includes(item.category)
    );
    const drinks = MENU_ITEMS.filter(item => 
      ["ICE COOLER", "CLASSIC SHAKES", "FIRANGI SPL. SHAKE"].includes(item.category)
    );

    if (foods.length && drinks.length) {
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];

      let foodPrice = 0;
      let foodPortion: "half" | "full" | undefined;

      if (typeof randomFood.price === "object") {
        foodPortion = Math.random() > 0.5 ? "full" : "half";
        foodPrice = randomFood.price[foodPortion];
      } else {
        foodPrice = randomFood.price;
      }

      const drinkPrice = typeof randomDrink.price === "object" ? randomDrink.price.full : randomDrink.price;

      setSurpriseCombo({
        food: randomFood,
        drink: randomDrink,
        foodPortion,
        total: foodPrice + drinkPrice
      });
    }
  };

  // Add Surprise Combo to Bag
  const addSurpriseComboToBag = () => {
    if (!surpriseCombo) return;

    // Add food
    let foodPrice = 0;
    let foodPortion: "half" | "full" | "standard" = "standard";
    if (typeof surpriseCombo.food.price === "object") {
      foodPortion = surpriseCombo.foodPortion || "full";
      foodPrice = surpriseCombo.food.price[foodPortion];
    } else {
      foodPrice = surpriseCombo.food.price;
    }

    const foodBagItem: BagItem = {
      id: `${surpriseCombo.food.id}-${foodPortion}`,
      name: surpriseCombo.food.name,
      price: foodPrice,
      portion: foodPortion,
      quantity: 1,
      isVeg: surpriseCombo.food.isVeg,
      category: surpriseCombo.food.category
    };

    // Add drink
    const drinkPrice = typeof surpriseCombo.drink.price === "object" ? surpriseCombo.drink.price.full : surpriseCombo.drink.price;
    const drinkBagItem: BagItem = {
      id: `${surpriseCombo.drink.id}-standard`,
      name: surpriseCombo.drink.name,
      price: drinkPrice,
      portion: "standard",
      quantity: 1,
      isVeg: surpriseCombo.drink.isVeg,
      category: surpriseCombo.drink.category
    };

    setBag(prev => {
      let temp = [...prev];
      // Insert food
      const existFood = temp.find(i => i.id === foodBagItem.id);
      if (existFood) existFood.quantity += 1;
      else temp.push(foodBagItem);

      // Insert drink
      const existDrink = temp.find(i => i.id === drinkBagItem.id);
      if (existDrink) existDrink.quantity += 1;
      else temp.push(drinkBagItem);

      return temp;
    });

    setIsBagOpen(true);
    setSurpriseCombo(null);
  };

  // Handle submitting review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewContent.trim()) return;

    const newReview: Review = {
      id: `rev-custom-${Date.now()}`,
      name: newReviewName,
      rating: newReviewRating,
      content: `${newReviewContent} [Tagged: ${newReviewTag}]`,
      time: "Just now",
      isLocalGuide: false,
      likes: 0
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem("firangi_reviews", JSON.stringify(updatedReviews));

    // Reset Form
    setNewReviewName("");
    setNewReviewContent("");
    setNewReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // Thumbs up / Like a review
  const likeReview = (id: string) => {
    if (likedReviews.includes(id)) return;
    
    setReviews(prevReviews => {
      const updated = prevReviews.map(r => {
        if (r.id === id) {
          return { ...r, likes: (r.likes || 0) + 1 };
        }
        return r;
      });
      localStorage.setItem("firangi_reviews", JSON.stringify(updated));
      return updated;
    });

    setLikedReviews(prev => [...prev, id]);
  };

  // Mock ordering process
  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setBag([]);
      setIsBagOpen(false);
    }, 4000);
  };

  // Simple direct copy of address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText("Shop no 190P, Sector 23 Main Rd, near cyber crime station, market, Sonipat, Haryana 131001");
    alert("Address copied to clipboard!");
  };

  // Thursday Hourly Popularity data from G-Maps
  const popularHoursData = [
    { hour: "6a", popularity: 15 },
    { hour: "9a", popularity: 25 },
    { hour: "12p", popularity: 55 },
    { hour: "3p", popularity: 40 },
    { hour: "6p", popularity: 95 },
    { hour: "9p", popularity: 80 }
  ];

  // Helper to render Bag/Cart content
  const renderBagContent = (isMobileLayout = false) => {
    return (
      <div className="bg-white rounded-2xl border border-[#F0EBE3] shadow-xs overflow-hidden">
        <div className="bg-[#5A5A40] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#EAB308]" />
            <span className="font-serif font-bold text-sm">Firangi Combo Bag</span>
          </div>
          <span className="bg-[#FAF9F5] text-[#5A5A40] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
            {bag.reduce((sum, i) => sum + i.quantity, 0)} Items
          </span>
        </div>

        {bag.length === 0 ? (
          <div className="p-8 text-center text-[#3E3D39]/50 space-y-2 font-sans">
            <ShoppingBag className="mx-auto text-[#E6E6DF]" size={32} />
            <p className="text-xs font-semibold text-[#3E3D39]/80">Your bag is currently empty.</p>
            <p className="text-[11px] text-[#3E3D39]/50">Select yummy momos, wraps, or shakes to build your ultimate combo!</p>
            <button
              onClick={() => {
                const random = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
                addToBag(random);
              }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F2ED] hover:bg-[#E6E6DF] text-[#3E3D39] text-[11px] font-bold rounded-lg transition cursor-pointer"
            >
              Quick Add Random!
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4 font-sans">
            {/* Bag Items list */}
            <div className={`${isMobileLayout ? "max-h-[40vh]" : "max-h-64"} overflow-y-auto divide-y divide-[#F0EBE3] pr-1`}>
              {bag.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs first:pt-0">
                  <div className="min-w-0">
                    <span className="font-bold text-[#3E3D39] block truncate">{item.name}</span>
                    <span className="text-[10px] text-[#3E3D39]/40 capitalize">
                      {item.portion !== "standard" ? `${item.portion} portion` : item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 bg-[#F5F2ED] rounded-md p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-0.5 hover:bg-white text-[#3E3D39]/60 rounded cursor-pointer"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="font-bold w-4 text-center text-[#3E3D39]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-0.5 hover:bg-white text-[#3E3D39]/60 rounded cursor-pointer"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="font-extrabold text-[#3E3D39] w-12 text-right">
                      ₹{item.price * item.quantity}/-
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* UNDER ₹200 FEAST CHALLENGE WIDGET (STORY BASED ON REAL PRICE TIERS) */}
            <div className="bg-[#FAF9F5] border border-[#F0EBE3] rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[#5A5A40] font-bold text-xs">
                <Award size={14} className="text-[#EAB308] animate-pulse" />
                <span>The Under-₹200 Feast Challenge</span>
              </div>
              <p className="text-[10px] text-[#3E3D39]/70 leading-relaxed">
                {feastChallengeStatus.message}
              </p>
              
              {feastChallengeStatus.success && (
                <motion.div 
                  initial={{ scale: 0.9 }} 
                  animate={{ scale: 1 }}
                  className="bg-emerald-50 text-emerald-800 p-2 rounded-lg text-center font-bold text-[10px] uppercase border border-emerald-200"
                >
                  🏆 CHALLENGE COMPLETED!
                </motion.div>
              )}
            </div>

            {/* Total calculation */}
            <div className="border-t border-[#F0EBE3] pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#3E3D39]/50">
                <span>Subtotal</span>
                <span>₹{bagSubtotal}/-</span>
              </div>
              <div className="flex justify-between text-[#3E3D39]/50">
                <span>SGST / CGST (0%)</span>
                <span className="text-emerald-700 font-semibold">FREE / Zero Tax</span>
              </div>
              <div className="flex justify-between text-[#3E3D39] font-extrabold text-sm pt-1 border-t border-dashed border-[#F0EBE3]">
                <span>Total Estimated Bill</span>
                <span className="text-[#5A5A40] text-base font-bold font-serif">₹{bagSubtotal}/-</span>
              </div>
            </div>

            {/* Ordering simulated actions */}
            {orderSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-center p-3 rounded-xl text-xs font-bold">
                🎉 Order Estimated! Please call 076962 95330 with your list for instant prep!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearBag}
                  className="py-2 px-3 border border-[#F0EBE3] hover:bg-[#FAF9F5] text-[#3E3D39]/80 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Reset Bag
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="py-2 px-3 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Review Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E3D39] font-sans selection:bg-[#E6E6DF] selection:text-[#3E3D39] pb-20">
      
      {/* 1. TOP NOTICE BAR */}
      <div className="bg-[#3E3E2E] text-[#F5F2ED] text-xs px-4 py-2 flex items-center justify-between gap-4 font-medium overflow-hidden border-b border-[#2D2D1F]">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-serif italic">100% Pure Vegetarian Street-Fusion Cafe</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-1"><Clock size={13} /> 10:00 AM - 10:00 PM</span>
          <span className="flex items-center gap-1"><MapPin size={13} /> Sector 23, Sonipat</span>
        </div>
      </div>

      {/* 2. LOGO & HEADER HERO */}
      <header className="relative bg-[#F5F2ED] border-b border-[#F0EBE3] py-12 px-4 md:px-8 text-center overflow-hidden">
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#5a5a40_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur rounded-full border border-[#F0EBE3] text-[#5A5A40] text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <ChefHat size={14} className="text-[#5A5A40]" />
            THE ULTIMATE INDO-WESTERN STREET HAVEN
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="font-serif italic text-4xl md:text-6xl font-bold text-[#5A5A40] tracking-tight leading-none mb-2">
              The Firangi South Point
            </h1>
            <h2 className="font-serif italic text-lg md:text-2xl font-bold text-[#3E3D39]/80 tracking-wide mb-4">
              थे फिरंगी साउथ पॉइंट
            </h2>
          </motion.div>

          <p className="text-[#3E3D39]/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-6 font-sans">
            Sonipat's beloved open-seating hangout spot. From tandoori-baked soy chaaps to crunchy kurkure momos and fusion ice shakes. Highly rated street food served with absolute passion!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[#3E3D39]">
            <span className="px-3 py-1.5 bg-white border border-[#F0EBE3] rounded-full flex items-center gap-1">
              <span className="text-[#EAB308]">★</span> 4.6 (40 Google Reviews)
            </span>
            <span className="px-3 py-1.5 bg-white border border-[#F0EBE3] rounded-full">
              ₹100 - ₹200 average spend
            </span>
            <span className="px-3 py-1.5 bg-[#E6E6DF] text-[#3E3D39] border border-[#F0EBE3] rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Dine-In
            </span>
            <span className="px-3 py-1.5 bg-[#E6E6DF] text-[#3E3D39] border border-[#F0EBE3] rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Drive-Through
            </span>
            <span className="px-3 py-1.5 bg-[#E6E6DF] text-[#3E3D39] border border-[#F0EBE3] rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Delivery
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a 
              href="#menu-section"
              className="px-6 py-3 bg-[#5A5A40] hover:bg-[#484833] text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Utensils size={16} />
              Explore Food Menu
            </a>
            <a 
              href="#reviews-section"
              className="px-6 py-3 bg-white hover:bg-[#F5F2ED] text-[#3E3D39] border border-[#F0EBE3] font-medium text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Star size={16} className="text-[#EAB308] fill-[#EAB308]" />
              Customer Reviews
            </a>
            <a 
              href="tel:07696295330"
              className="px-6 py-3 bg-[#3E3D39] hover:bg-[#2D2C28] text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Phone size={16} className="text-[#E6E6DF]" />
              Call 076962 95330
            </a>
          </div>
        </div>
      </header>

      {/* 3. AUTO-SCROLLING TICKER MARQUEE */}
      <div className="bg-[#E6E6DF] text-[#5A5A40] py-3 border-y border-[#F0EBE3] overflow-hidden relative select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-serif text-sm font-bold uppercase tracking-widest italic">
          {/* First loop */}
          <span className="flex items-center gap-2">🔥 MUST TRY: Veg Kurkure Momos</span>
          <span className="flex items-center gap-2">⭐ CLASSIC: Vada Pao (Just ₹39)</span>
          <span className="flex items-center gap-2">🔥 BESTSELLER: Honey Chilli Potato</span>
          <span className="flex items-center gap-2">🍦 COZY VIBES: Sweet Rasmalai Shake</span>
          <span className="flex items-center gap-2">🔥 CHEF SPECIAL: Firangi Special Noodles</span>
          <span className="flex items-center gap-2">⭐ CRUNCHY: Kurkure Spring Roll</span>
          <span className="flex items-center gap-2">🔥 CRISPY: Tandoori Chaap</span>
          <span className="flex items-center gap-2">🍦 CHEESY: Ultimate Cheese Fries</span>
          {/* Duplicate loop for seamless continuous scroll */}
          <span className="flex items-center gap-2">🔥 MUST TRY: Veg Kurkure Momos</span>
          <span className="flex items-center gap-2">⭐ CLASSIC: Vada Pao (Just ₹39)</span>
          <span className="flex items-center gap-2">🔥 BESTSELLER: Honey Chilli Potato</span>
          <span className="flex items-center gap-2">🍦 COZY VIBES: Sweet Rasmalai Shake</span>
          <span className="flex items-center gap-2">🔥 CHEF SPECIAL: Firangi Special Noodles</span>
          <span className="flex items-center gap-2">⭐ CRUNCHY: Kurkure Spring Roll</span>
          <span className="flex items-center gap-2">🔥 CRISPY: Tandoori Chaap</span>
          <span className="flex items-center gap-2">🍦 CHEESY: Ultimate Cheese Fries</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* LEFT COLUMN: INTERACTIVE MENU & FOOD SELECTOR (8 Cols) */}
        <div className="lg:col-span-8 space-y-8" id="menu-section">
          
          {/* SEARCH & FILTERS CONTROLS */}
          <div className="bg-white rounded-[24px] border border-[#F0EBE3] p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif italic text-xl font-bold text-[#3E3D39] flex items-center gap-2">
                  <Filter size={18} className="text-[#5A5A40]" />
                  What's Your Flavor Today?
                </h3>
                <p className="text-xs text-[#3E3D39]/60 font-sans">Filter through our extensive street-fusion menu</p>
              </div>

              {/* SURPRISE ME ACTION BUTTON */}
              <button
                onClick={generateSurpriseCombo}
                className="self-start md:self-auto px-4 py-2 bg-[#F5F2ED] hover:bg-[#E6E6DF] text-[#5A5A40] border border-[#F0EBE3] text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-[#EAB308]" />
                <span>✨ Surprise Me! (Auto Combo Picker)</span>
              </button>
            </div>

            {/* SURPRISE ME RESULT POPUP */}
            <AnimatePresence>
              {surpriseCombo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#F5F2ED] border border-[#F0EBE3] rounded-xl p-4 overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] bg-[#E6E6DF] text-[#5A5A40] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Chef's Recommended Pair 🍔🥤
                      </span>
                      <h4 className="font-serif italic font-bold text-[#3E3D39] mt-2.5 text-base">
                        {surpriseCombo.food.name} {surpriseCombo.foodPortion ? `(${surpriseCombo.foodPortion})` : ""} + {surpriseCombo.drink.name}
                      </h4>
                      <p className="text-xs text-[#3E3D39]/70 mt-1 max-w-xl font-sans">
                        A perfect combination: {surpriseCombo.food.description.split('.')[0]}. Paired with our cooling {surpriseCombo.drink.name}.
                      </p>
                      <p className="text-sm font-bold text-[#5A5A40] mt-2.5">
                        Combo Total: ₹{surpriseCombo.total}/- <span className="text-xs font-normal text-[#3E3D39]/60">({surpriseCombo.foodPortion ? 'Portion adjusted' : 'Standard prices'})</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={addSurpriseComboToBag}
                        className="px-3.5 py-2 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
                      >
                        Add to Bag
                      </button>
                      <button 
                        onClick={() => setSurpriseCombo(null)}
                        className="p-1.5 hover:bg-[#E6E6DF] text-[#3E3D39] rounded-lg cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3E3D39]/40" />
                <input
                  type="text"
                  placeholder="Search momos, shakes, pasta, chaap..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-[#F0EBE3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition-all placeholder:text-[#3E3D39]/40 text-[#3E3D39]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E3D39]/40 hover:text-[#3E3D39]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Budget Slider */}
              <div className="bg-[#FAF9F5] border border-[#F0EBE3] rounded-xl px-4 py-2 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center text-xs text-[#3E3D39]/60 mb-1">
                    <span>Max Budget Per Item:</span>
                    <span className="font-bold text-[#5A5A40]">₹{maxBudget}</span>
                  </div>
                  <input
                    type="range"
                    min="39"
                    max="255"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-[#5A5A40] cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setMaxBudget(255)}
                  className="px-2 py-1 text-[10px] font-bold bg-[#F5F2ED] hover:bg-[#E6E6DF] rounded text-[#3E3D39] transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Quick Badges Filter Row */}
            <div className="flex flex-wrap items-center gap-3 border-t border-[#F0EBE3] pt-4 text-xs font-semibold">
              <span className="text-[#3E3D39]/50">Quick Filters:</span>
              <button
                onClick={() => setOnlySpicy(!onlySpicy)}
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                  onlySpicy 
                  ? "bg-red-50 text-red-800 border-red-100" 
                  : "bg-white hover:bg-[#F5F2ED] text-[#3E3D39] border-[#F0EBE3]"
                }`}
              >
                🌶️ Spicy Delights
              </button>
              <button
                onClick={() => setOnlySpecial(!onlySpecial)}
                className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                  onlySpecial 
                  ? "bg-[#E6E6DF] text-[#5A5A40] border-[#F0EBE3]" 
                  : "bg-white hover:bg-[#F5F2ED] text-[#3E3D39] border-[#F0EBE3]"
                }`}
              >
                ✨ Firangi Signature Special
              </button>
              {(onlySpicy || onlySpecial || selectedCategory !== "ALL" || searchQuery) && (
                <button
                  onClick={() => {
                    setOnlySpicy(false);
                    setOnlySpecial(false);
                    setSelectedCategory("ALL");
                    setSearchQuery("");
                    setMaxBudget(255);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#3E3D39] hover:bg-[#2D2D29] text-white text-[11px] font-bold cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Scrolling Category Pill Navigation */}
            <div className="relative border-t border-[#F0EBE3] pt-4">
              <div className="flex overflow-x-auto scrollbar-none gap-2 pb-2 -mx-2 px-2 scroll-smooth">
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === "ALL"
                      ? "bg-[#5A5A40] text-white shadow-xs"
                      : "bg-[#F5F2ED] hover:bg-[#E6E6DF] text-[#3E3D39]"
                  }`}
                >
                  All Items ({MENU_ITEMS.length})
                </button>
                {MENU_CATEGORIES.map((category) => {
                  const count = MENU_ITEMS.filter(item => item.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === category
                          ? "bg-[#5A5A40] text-white shadow-xs"
                          : "bg-[#F5F2ED] hover:bg-[#E6E6DF] text-[#3E3D39]"
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MENU ITEMS GRID */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif italic text-2xl font-bold text-[#5A5A40]">
                {selectedCategory === "ALL" ? "Full Menu" : selectedCategory}
              </h3>
              <p className="text-xs text-[#3E3D39]/60 font-semibold font-sans">
                Showing {filteredMenuItems.length} delicious option{filteredMenuItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filteredMenuItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#F0EBE3] p-12 text-center">
                <AlertTriangle className="mx-auto text-[#EAB308] mb-3" size={32} />
                <h4 className="font-serif text-lg font-bold text-[#3E3D39]">No items match your filters</h4>
                <p className="text-sm text-[#3E3D39]/60 mt-1 max-w-sm mx-auto font-sans">
                  Try clearing some filters, expanding your budget, or writing a different search term.
                </p>
                <button
                  onClick={() => {
                    setOnlySpicy(false);
                    setOnlySpecial(false);
                    setSelectedCategory("ALL");
                    setSearchQuery("");
                    setMaxBudget(255);
                  }}
                  className="mt-4 px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  View Full Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => {
                  const isDoublePrice = typeof item.price === "object";
                  const currentPortion = itemPortions[item.id] || "full";
                  const displayPrice = isDoublePrice 
                    ? (item.price as { half: number; full: number })[currentPortion]
                    : (item.price as number);

                  const targetId = isDoublePrice ? `${item.id}-${currentPortion}` : `${item.id}-standard`;
                  const bagItem = bag.find(b => b.id === targetId);
                  const quantityInBag = bagItem ? bagItem.quantity : 0;
                  const isSelected = quantityInBag > 0;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      key={item.id}
                      className={`rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between relative group ${
                        isSelected 
                          ? "bg-[#FAF9F5] border-2 border-[#5A5A40] shadow-md ring-1 ring-[#5A5A40]/10" 
                          : "bg-white border border-[#F0EBE3] shadow-xs hover:shadow-md hover:border-[#5A5A40]/30"
                      }`}
                    >
                      {/* Veg Indicator + Specialty Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {/* 100% Veg Green Box Icon */}
                          <div className="w-4 h-4 border border-emerald-600 p-0.5 flex items-center justify-center bg-white rounded-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          </div>
                          
                          {item.isSpecial && (
                            <span className="text-[10px] bg-[#E6E6DF] text-[#5A5A40] font-bold px-2 py-0.5 rounded tracking-wide uppercase flex items-center gap-0.5">
                              <Sparkles size={10} className="fill-[#5A5A40]" />
                              SIGNATURE
                            </span>
                          )}
                          {item.isSpicy && (
                            <span className="text-[10px] bg-red-50 text-red-800 font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                              🌶️ SPICY
                            </span>
                          )}
                        </div>

                        {/* Portion Toggle for Half/Full pricing */}
                        {isDoublePrice && (
                          <div className="flex rounded-lg bg-[#F5F2ED] p-0.5 text-[11px] font-bold">
                            <button
                              onClick={() => handlePortionChange(item.id, "half")}
                              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                currentPortion === "half"
                                  ? "bg-white text-[#3E3D39]"
                                  : "text-[#3E3D39]/50 hover:text-[#3E3D39]"
                              }`}
                            >
                              Half
                            </button>
                            <button
                              onClick={() => handlePortionChange(item.id, "full")}
                              className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                currentPortion === "full"
                                  ? "bg-white text-[#3E3D39]"
                                  : "text-[#3E3D39]/50 hover:text-[#3E3D39]"
                              }`}
                            >
                              Full
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-lg font-bold text-[#3E3D39] group-hover:text-[#5A5A40] transition-colors">
                            {item.name}
                          </h4>
                          <span className="font-serif text-lg font-bold text-[#5A5A40] shrink-0">
                            ₹{displayPrice}/-
                          </span>
                        </div>
                        <p className="text-xs text-[#3E3D39]/60 leading-relaxed min-h-[36px] font-sans">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#F0EBE3] flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#3E3D39]/40 tracking-wider uppercase font-sans">
                          {item.category}
                        </span>
                        
                        {isSelected ? (
                          <div className="flex items-center bg-[#5A5A40] text-white text-xs font-bold rounded-lg p-0.5 shadow-xs transition-all gap-1">
                            <button
                              onClick={() => updateQuantity(targetId, -1)}
                              className="px-2 py-1 hover:bg-white/10 rounded transition cursor-pointer"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-1 text-center font-extrabold text-white text-xs min-w-[50px]">
                              {quantityInBag} Added
                            </span>
                            <button
                              onClick={() => updateQuantity(targetId, 1)}
                              className="px-2 py-1 hover:bg-white/10 rounded transition cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToBag(item)}
                            className="px-3.5 py-1.5 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                          >
                            <Plus size={14} />
                            Add to Bag
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. REVIEWS SECTION (INTEGRAL CORE BLOCK) */}
          <section id="reviews-section" className="bg-white rounded-[32px] border border-[#F0EBE3] p-6 md:p-8 shadow-sm space-y-8">
            <div className="border-b border-[#F0EBE3] pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif italic text-3xl font-bold text-[#5A5A40]">
                    What Customers Say
                  </h3>
                  <p className="text-sm text-[#3E3D39]/60 font-sans">Real verified feedback from the cyber station market, Sonipat</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end text-[#EAB308]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={18} 
                          className={star <= Math.round(reviewStats.average) ? "fill-[#EAB308] text-[#EAB308]" : "text-[#E6E6DF]"} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#3E3D39] font-sans">{reviewStats.average} out of 5 stars</span>
                  </div>
                  <div className="bg-[#F5F2ED] border border-[#F0EBE3] p-2.5 rounded-2xl text-center">
                    <span className="block font-serif text-xl font-bold text-[#5A5A40] leading-none">{reviewStats.totalCount}</span>
                    <span className="text-[10px] text-[#3E3D39]/60 font-bold uppercase tracking-wider font-sans">Total Reviews</span>
                  </div>
                </div>
              </div>

              {/* Stars breakout layout */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#F5F2ED]/70 p-4 rounded-2xl border border-[#F0EBE3]">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#3E3D39]/60 uppercase tracking-wider mb-2 font-sans">Review Summary Distribution</h4>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviewStats.starCounts[stars as 5|4|3|2|1] || 0;
                    const percent = Math.round((count / reviewStats.totalCount) * 100);
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs font-sans">
                        <span className="w-12 font-bold text-[#3E3D39]/70 flex items-center justify-end gap-1">
                          {stars} <Star size={12} className="fill-[#EAB308] text-[#EAB308]" />
                        </span>
                        <div className="flex-1 h-2 bg-[#E6E6DF] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#EAB308] rounded-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[#3E3D39]/60 font-semibold">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-xs text-[#3E3D39]/80 space-y-2 border-t md:border-t-0 md:border-l border-[#F0EBE3] pt-4 md:pt-0 md:pl-6 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌿</span>
                    <span><strong>14 people</strong> highlighted the lush open dining seating.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <span><strong>Most praised:</strong> Mix Momos, Chilli Potatoes, and dynamic shakes.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <span><strong>Constructive feedback:</strong> Peak hour service can sometimes be cozy but slower due to handcrafted custom menu preparation.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ADD A REVIEW FORM */}
            <div className="bg-[#FAF9F5] rounded-2xl border border-[#F0EBE3] p-5 md:p-6 space-y-4">
              <h4 className="font-serif italic text-lg font-bold text-[#5A5A40] flex items-center gap-2">
                <MessageSquare size={18} className="text-[#5A5A40]" />
                Been to Firangi? Share Your Experience!
              </h4>

              {reviewSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-xs"
                >
                  <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
                  <div>
                    <strong className="block">Review published successfully!</strong>
                    <span>Your rating has been integrated into the total score. Thank you for your feedback!</span>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3E3D39]/70 mb-1 font-sans">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Neeraj Kumar"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-[#F0EBE3] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition text-[#3E3D39]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3E3D39]/70 mb-1 font-sans">Highlight Dish Tag</label>
                      <select
                        value={newReviewTag}
                        onChange={(e) => setNewReviewTag(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-[#F0EBE3] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition text-[#3E3D39]"
                      >
                        <option value="Awesome Taste">Awesome Taste & Flavor</option>
                        <option value="Great Price">Unbeatable Value & Price</option>
                        <option value="Lovely Open Air Seating">Lovely Open Air Seating</option>
                        <option value="Spicy Momos">Spicy Momos Flavor</option>
                        <option value="Fast Service">Super Friendly & Fast</option>
                        <option value="Slow but Worth It">Slow Prep, Worth It</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E3D39]/70 mb-1 font-sans">Star Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 hover:scale-110 transition cursor-pointer"
                        >
                          <Star
                            size={24}
                            className={star <= newReviewRating ? "fill-[#EAB308] text-[#EAB308]" : "text-[#E6E6DF]"}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-[#3E3D39]/60 ml-2 font-sans">({newReviewRating} stars out of 5)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E3D39]/70 mb-1 font-sans">Your Honest Feedback</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How was the food flavor, quality, pricing, and the cozy open-air vibes?"
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#F0EBE3] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:bg-white transition text-[#3E3D39]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Submit Review & Sync Live
                  </button>
                </form>
              )}
            </div>

            {/* CUSTOMER REVIEWS RENDERED */}
            <div className="space-y-4">
              {reviews.map((r) => {
                const isLiked = likedReviews.includes(r.id);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={r.id}
                    className="border border-[#F0EBE3] rounded-2xl p-5 md:p-6 space-y-3 bg-[#FAF9F5] hover:bg-white hover:border-[#5A5A40]/30 transition duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-[#F5F2ED] flex items-center justify-center text-[#5A5A40] font-bold text-sm shrink-0 border border-[#F0EBE3]">
                          {r.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#3E3D39] font-sans">{r.name}</span>
                            {r.isLocalGuide && (
                              <span className="text-[9px] bg-[#E6E6DF] text-[#5A5A40] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#F0EBE3] font-sans">
                                Local Guide
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#3E3D39]/50 font-sans">
                            <span>{r.time}</span>
                            {r.totalReviews && <span>• {r.totalReviews} reviews</span>}
                            {r.totalPhotos && <span>• {r.totalPhotos} photos</span>}
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-[#EAB308]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= r.rating ? "fill-[#EAB308]" : "text-[#E6E6DF]"} 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#3E3D39]/80 leading-relaxed pl-1.5 border-l-2 border-[#F0EBE3] font-sans">
                      {r.content}
                    </p>

                    {/* Likes & Feedback Actions */}
                    <div className="flex items-center gap-3 pt-1 pl-1.5 font-sans">
                      <button
                        onClick={() => likeReview(r.id)}
                        className={`text-[11px] font-bold flex items-center gap-1.5 transition ${
                          isLiked 
                            ? "text-[#5A5A40] font-black cursor-default" 
                            : "text-[#3E3D39]/40 hover:text-[#3E3D39] cursor-pointer"
                        }`}
                      >
                        <ThumbsUp size={12} className={isLiked ? "fill-[#5A5A40]" : ""} />
                        Helpful ({r.likes || 0})
                      </button>
                      <span className="text-[#F0EBE3] text-xs">|</span>
                      <span className="text-[11px] text-[#3E3D39]/50 font-semibold flex items-center gap-1">
                        <Check size={12} className="text-emerald-600" /> Dine-in
                      </span>
                    </div>

                    {/* Owner Response Box */}
                    {r.response && (
                      <div className="bg-[#F5F2ED] border-l-2 border-[#5A5A40] p-3.5 rounded-r-xl mt-3 text-xs text-[#3E3D39]">
                        <div className="flex items-center gap-1.5 mb-1 text-[#5A5A40] font-bold font-sans">
                          <ChefHat size={13} />
                          <span>Response from the Owner</span>
                        </div>
                        <p className="italic text-[#3E3D39]/80 font-sans">
                          "{r.response}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: REVIEWS BREAKDOWN, CART, CHALLENGE, MAP & HOURS (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* STICKY CONTAINER FOR COMBOS & CART */}
          <div className="lg:sticky lg:top-6 space-y-8">

            {/* A. COZY SHOPPING BAG / ESTIMATOR */}
            <div className="hidden lg:block">
              {renderBagContent(false)}
            </div>

            {/* B. POPULAR TIMES HISTOGRAM CHART (From user text G-Maps) */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#3E3D39] flex items-center gap-1.5">
                    <Calendar size={15} className="text-[#5A5A40]" />
                    Popular Times: Thursdays
                  </h4>
                  <p className="text-[10px] text-[#3E3D39]/40 font-sans">Peak hours from Google Maps history</p>
                </div>
                <span className="text-[10px] bg-[#FAF9F5] border border-[#F0EBE3] font-bold px-2 py-0.5 rounded text-[#5A5A40] font-sans">Sonipat Peak</span>
              </div>

              {/* Graphical representation */}
              <div className="h-32 flex items-end justify-between pt-4 pb-2 border-b border-[#F0EBE3]">
                {popularHoursData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group font-sans">
                    <span className="text-[8px] text-[#3E3D39]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold">
                      {data.popularity}%
                    </span>
                    <div className="w-6 bg-[#E6E6DF] rounded-t-xs hover:bg-[#5A5A40] transition-colors duration-200 relative" style={{ height: `${data.popularity * 0.9}px` }}>
                      {/* Highlight evening hours */}
                      {data.hour === "6p" && <div className="absolute inset-0 bg-[#5A5A40] animate-pulse rounded-t-xs" />}
                    </div>
                    <span className="text-[9px] font-bold text-[#3E3D39]/70 mt-1">
                      {data.hour}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-[#3E3D39]/60 leading-relaxed flex items-start gap-1.5 font-sans">
                <Info size={12} className="text-[#5A5A40] shrink-0 mt-0.5" />
                <span>Our busiest hours are <strong>6 PM – 9 PM</strong>. If you want a quick, quiet dine-in under the stars, our lunch hours (12 PM – 3 PM) are perfect!</span>
              </div>
            </div>

            {/* C. DIRECT CONTACT & LOCATION MAP DETAILS CARD */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-5 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#3E3D39]">
                Cafe Location & Contact
              </h4>

              <div className="space-y-3 text-xs text-[#3E3D39]/80 font-sans">
                <div className="flex gap-2 items-start">
                  <MapPin className="text-[#5A5A40] shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-[#3E3D39]">Address</span>
                    <p className="text-[#3E3D39]/60 mt-0.5">Shop no 190P, Sector 23 Main Rd, near cyber crime station, market, Sonipat, Haryana 131001</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={copyAddress}
                        className="text-[10px] bg-[#F5F2ED] hover:bg-[#E6E6DF] text-[#3E3D39] px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        Copy Address
                      </button>
                      <a
                        href="https://maps.google.com/?q=The+Firangi+South+Point+Sonipat+Haryana"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] bg-[#3E3D39] hover:bg-[#3E3D39]/80 text-[#FAF9F5] px-2.5 py-1 rounded-md font-bold transition flex items-center gap-1"
                      >
                        <Navigation size={10} />
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-start pt-2 border-t border-[#F0EBE3]">
                  <Phone className="text-[#5A5A40] shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-[#3E3D39]">Phone & Instant Orders</span>
                    <p className="text-[#3E3D39]/60 mt-0.5">Place bulk delivery or pre-orders instantly</p>
                    <a
                      href="tel:07696295330"
                      className="text-[#5A5A40] hover:text-[#3E3D39] font-bold block mt-1 text-sm flex items-center gap-1 font-serif italic"
                    >
                      📞 076962 95330
                    </a>
                  </div>
                </div>

                <div className="flex gap-2 items-start pt-2 border-t border-[#F0EBE3]">
                  <Clock className="text-[#5A5A40] shrink-0" size={16} />
                  <div>
                    <span className="font-bold text-[#3E3D39]">Operating Hours</span>
                    <p className="text-[#3E3D39]/60 mt-0.5">Monday to Sunday</p>
                    <span className="font-semibold text-[#3E3D39] block mt-0.5">10:00 AM - 10:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Ambient Open seating description */}
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#F0EBE3] text-[11px] text-[#3E3D39]/70 leading-relaxed font-sans">
                🌳 <strong>Cozy Vibe Note:</strong> Featuring open seating under beautiful natural settings, complete with ambient light lines. Perfect for warm evening gatherings.
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#3E3D39] text-[#FAF9F5]/70 text-xs py-12 px-4 border-t border-[#5A5A40]/30 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h5 className="font-serif text-[#FAF9F5] text-base font-bold tracking-wide">The Firangi South Point</h5>
            <p className="leading-relaxed font-sans">Sonipat's premium fast-food street-fusion cafe. Experience authentic kurkure momos, tandoori soya chaap, and indulgent shakes crafted by hand daily.</p>
            <p className="text-[10px] text-[#FAF9F5]/40 font-sans">© 2026 The Firangi South Point • All rights reserved.</p>
          </div>
          <div>
            <h5 className="font-serif text-[#FAF9F5] text-sm font-bold tracking-wider mb-3 uppercase">Popular Food Categories</h5>
            <div className="flex flex-wrap gap-2">
              {MENU_CATEGORIES.slice(0, 8).map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCategory(c);
                    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[#5A5A40] hover:bg-[#484833] text-[#FAF9F5] px-2.5 py-1 rounded text-[10px] font-semibold transition cursor-pointer font-sans"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 font-sans">
            <h5 className="font-serif text-[#FAF9F5] text-sm font-bold tracking-wider uppercase">Contact & Help</h5>
            <p>Shop no 190P, Sector 23 Main Rd, near cyber crime station, Sonipat, Haryana 131001</p>
            <p>Phone: <a href="tel:07696295330" className="text-[#FAF9F5] hover:underline font-serif italic font-semibold">076962 95330</a></p>
            <p className="text-[11px] text-[#FAF9F5]/40">Website designed with a cozy digital interface representing physical menu cards and active community feedback.</p>
          </div>
        </div>
      </footer>

      {/* MOBILE FLOATING CART PILL */}
      {bag.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 lg:hidden">
          <button
            onClick={() => setIsBagOpen(true)}
            className="w-full bg-[#5A5A40] text-white shadow-xl rounded-full p-4 flex items-center justify-between border border-[#FAF9F5]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-[#FAF9F5]/10 rounded-full">
                <ShoppingBag size={20} className="text-[#EAB308]" />
                <span className="absolute -top-1 -right-1 bg-[#EAB308] text-[#5A5A40] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#5A5A40]">
                  {bag.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider block font-bold text-[#FAF9F5]/60">Your Firangi Bag</span>
                <span className="text-sm font-bold">₹{bagSubtotal}/-</span>
              </div>
            </div>
            <span className="bg-white/15 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
              View Bag →
            </span>
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM SLIDE-UP DRAWER */}
      <AnimatePresence>
        {isBagOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBagOpen(false)}
              className="absolute inset-0 bg-black/60 cursor-pointer"
            />
            
            {/* Slide Up Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-[#FDFBF7] rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col border-t border-[#F0EBE3] shadow-2xl z-10"
            >
              {/* Top Close indicator/handle */}
              <div className="flex items-center justify-between p-4 border-b border-[#F0EBE3] bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#5A5A40]" />
                  <h3 className="font-serif font-extrabold text-[#3E3D39] text-base">Your Bag</h3>
                </div>
                <button
                  onClick={() => setIsBagOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F5F2ED] text-[#3E3D39]/60 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Scrollable bag content */}
              <div className="overflow-y-auto p-4 flex-1">
                {renderBagContent(true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
