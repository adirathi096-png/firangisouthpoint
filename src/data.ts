export interface MenuItem {
  id: string;
  name: string;
  category: string;
  isVeg: boolean;
  isSpicy: boolean;
  isSpecial: boolean;
  price: number | { half: number; full: number };
  description: string;
  image?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  content: string;
  time: string;
  isLocalGuide?: boolean;
  totalReviews?: number;
  totalPhotos?: number;
  response?: string;
  likes?: number;
}

export const MENU_CATEGORIES = [
  "MOMOS",
  "FIRANGI'S SPL.",
  "BURGER",
  "SANDWICH",
  "WRAP",
  "PASTA",
  "FRIES",
  "SPECIAL CHAAP",
  "CHINESE",
  "ICE COOLER",
  "CLASSIC SHAKES",
  "FIRANGI SPL. SHAKE",
  "SOUP"
] as const;

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Neeraj Gandhi",
    rating: 5,
    content: "Tried their mix momos and noodles, and both tasted great, especially for the price. The flavors were well-balanced, and the quality was definitely worth it. What makes this place even better is the open seating perfect for those who enjoy dining in a natural setting. Overall, a great experience!",
    time: "1 year ago",
    isLocalGuide: true,
    totalReviews: 77,
    totalPhotos: 487,
    response: "Thank you for your valuable feedback",
    likes: 12
  },
  {
    id: "rev-2",
    name: "Harshit",
    rating: 3,
    content: "Thier service is very slow. Tried their pao bhaji. Pao were average but bhaji was spicy",
    time: "3 years ago",
    isLocalGuide: true,
    totalReviews: 125,
    totalPhotos: 130,
    response: "Thanks for your valuable feedback....we will work on it......sry for inconvenience",
    likes: 4
  },
  {
    id: "rev-3",
    name: "Koushal Arora",
    rating: 4,
    content: "Chilli potato 👍👍",
    time: "4 months ago",
    isLocalGuide: false,
    totalReviews: 1,
    totalPhotos: 3,
    likes: 2
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // --- MOMOS ---
  {
    id: "m-1",
    name: "Veg Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 79,
    description: "Classic steamed dumplings stuffed with finely chopped fresh garden vegetables and mild herbs."
  },
  {
    id: "m-2",
    name: "Veg Fried Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: { half: 49, full: 89 },
    description: "Crispy deep-fried veg momos with a beautiful golden crunch, served with spicy red chutney."
  },
  {
    id: "m-3",
    name: "Veg Kurkure Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: { half: 65, full: 105 },
    description: "Double-crunch cornflake crust momos, fried to perfection and sprinkled with tangy secret spices."
  },
  {
    id: "m-4",
    name: "Veg Afgani Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: { half: 79, full: 129 },
    description: "Dumplings marinated in rich, creamy cashew paste and mild spices, grilled to smoky goodness."
  },
  {
    id: "m-5",
    name: "Veg Gravy Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: { half: 79, full: 129 },
    description: "Steamed momos smothered in a finger-licking, savory and spicy house-special gravy."
  },
  {
    id: "m-6",
    name: "Veg Malai Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: { half: 89, full: 129 },
    description: "Delectable momos tossed in fresh liquid cream, loaded with butter and garnished with fresh coriander."
  },
  {
    id: "m-7",
    name: "Paneer Veg Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: { half: 49, full: 89 },
    description: "Soft momos packed with premium graded paneer (cottage cheese) and delicate herbs."
  },
  {
    id: "m-8",
    name: "Paneer Veg Fried Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: { half: 65, full: 105 },
    description: "Golden-crisped paneer momos loaded with soft melting cottage cheese filling."
  },
  {
    id: "m-9",
    name: "Paneer Veg Kurkure Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: { half: 79, full: 115 },
    description: "Super crispy batter-coated paneer momos. A crowd favorite at Firangi."
  },
  {
    id: "m-10",
    name: "Paneer Veg Afgani Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: { half: 89, full: 139 },
    description: "Smoky tandoor-kissed paneer momos bathed in velvety rich cream and spices."
  },
  {
    id: "m-11",
    name: "Paneer Veg Gravy Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: { half: 89, full: 139 },
    description: "Rich paneer momos drenched in a spicy, seasoned Indo-Chinese style gravy."
  },
  {
    id: "m-12",
    name: "Paneer Veg Malai Momos",
    category: "MOMOS",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: { half: 79, full: 119 },
    description: "Richly layered paneer momos bathed in rich Amul butter and sweet cream."
  },

  // --- CHINESE ---
  {
    id: "c-1",
    name: "Spring Roll",
    category: "CHINESE",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: { half: 39, full: 75 },
    description: "Crispy paper-thin pastry sheets rolled with spiced cabbage, carrot, and onion juliennes."
  },
  {
    id: "c-2",
    name: "Kurkure Spring Roll",
    category: "CHINESE",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: { half: 49, full: 89 },
    description: "Standard spring rolls elevated with an ultra-crunchy crust and chatpata peri-peri seasoning."
  },
  {
    id: "c-3",
    name: "Veg. Chowmin",
    category: "CHINESE",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 89,
    description: "Street-style stir-fried wok noodles with crunchy cabbage, capsicum, onions, and dark soy sauce."
  },
  {
    id: "c-4",
    name: "Singapuri Chowmin",
    category: "CHINESE",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 129,
    description: "Yellow-tinted noodles stir-fried with hot curry powder, garlic, colorful peppers, and dry spices."
  },
  {
    id: "c-5",
    name: "Hakka Noodles",
    category: "CHINESE",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 89,
    description: "Perfectly boiled noodles tossed in mild wok-heat with garlic oil, spring onion, and crunchy vegetables."
  },
  {
    id: "c-6",
    name: "Manchurian Noodles",
    category: "CHINESE",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 115,
    description: "A combination of standard wok noodles topped with sweet, sour, and spicy Manchurian sauce."
  },
  {
    id: "c-7",
    name: "Firangi Special Noodles",
    category: "CHINESE",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 129,
    description: "Our signature fusion noodles packed with secret spicy sauces, dry red chilies, and paneer cubes."
  },
  {
    id: "c-8",
    name: "Manchurian Dry/Gravy",
    category: "CHINESE",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 115,
    description: "Crispy deep-fried mixed vegetable balls tossed in a tangy, spicy ginger-garlic soy gravy."
  },
  {
    id: "c-9",
    name: "Chilli Potato",
    category: "CHINESE",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 115,
    description: "Crispy fried potato fingers coated in a sticky spicy chili sauce, garlic, and fresh green capsicum."
  },
  {
    id: "c-10",
    name: "Honey Chilli Potato",
    category: "CHINESE",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 129,
    description: "Crispy sweet potato fingers glazed with liquid honey, spicy chili, and sprinkled with white sesame."
  },
  {
    id: "c-11",
    name: "Chilli Paneer Dry/Gravy",
    category: "CHINESE",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 195,
    description: "Chunky paneer cubes tossed in a rich wok-base with green chilies, onions, bell peppers, and chili paste."
  },

  // --- ICE COOLER ---
  {
    id: "ic-1",
    name: "Mint Mojito",
    category: "ICE COOLER",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 65,
    description: "Ultra-refreshing combination of freshly muddled mint leaves, lemon chunks, simple syrup, and cold soda."
  },
  {
    id: "ic-2",
    name: "Green Apple",
    category: "ICE COOLER",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 75,
    description: "Crisp, sweet, and tart green apple syrup topped with refreshing iced soda and mint."
  },
  {
    id: "ic-3",
    name: "Blue Moon",
    category: "ICE COOLER",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 75,
    description: "Vibrant blue curaçao mocktail with citrus notes, crushed ice, and sparkling fizzy water."
  },
  {
    id: "ic-4",
    name: "Kala Khatta",
    category: "ICE COOLER",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 89,
    description: "A nostalgic sweet and sour Indian summer cooler made with blackberry (jamun) syrup and black salt."
  },
  {
    id: "ic-5",
    name: "Imly Banta",
    category: "ICE COOLER",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 89,
    description: "Traditional Sonipat special: Tangy tamarind paste with toasted cumin, black salt, and carbonated water."
  },

  // --- CLASSIC SHAKES ---
  {
    id: "cs-1",
    name: "Vanilla Shake",
    category: "CLASSIC SHAKES",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 89,
    description: "Classic creamy milkshake blended with premium French vanilla bean ice cream."
  },
  {
    id: "cs-2",
    name: "Strawberry Shake",
    category: "CLASSIC SHAKES",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 89,
    description: "Blended sweet strawberries and cream, finished with strawberry drizzle."
  },
  {
    id: "cs-3",
    name: "Butter Scotch Shake",
    category: "CLASSICSHAKES",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 89,
    description: "Buttery caramel shake with crunchy praline pieces blended into smooth vanilla cream."
  },
  {
    id: "cs-4",
    name: "Chocolate Shake",
    category: "CLASSIC SHAKES",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 89,
    description: "Rich, velvety shake loaded with high-quality dark cocoa and milk chocolate fudge."
  },
  {
    id: "cs-5",
    name: "Cold Coffee",
    category: "CLASSIC SHAKES",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 89,
    description: "Perfectly aerated frothy espresso blended with chilled milk and a dollop of ice cream."
  },

  // --- FIRANGI SPL. SHAKE ---
  {
    id: "fss-1",
    name: "Perfect Rum Shake",
    category: "FIRANGI SPL. SHAKE",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 115,
    description: "Non-alcoholic rum extract flavor blended with rich cocoa and a smoky-sweet vanilla core."
  },
  {
    id: "fss-2",
    name: "Unique Whiskey Shake",
    category: "FIRANGI SPL. SHAKE",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 115,
    description: "Indulgent non-alcoholic malt whiskey essence whipped with rich caramel cream and toasted almonds."
  },
  {
    id: "fss-3",
    name: "Red Velvet Shake",
    category: "FIRANGI SPL. SHAKE",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 115,
    description: "Decadent cream cheese blended with a whole slice of red velvet cake and strawberry coulis."
  },
  {
    id: "fss-4",
    name: "Easy Oreo Shake",
    category: "FIRANGI SPL. SHAKE",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 115,
    description: "A thick, frosty blend of premium cookies-and-cream ice cream and crushed Oreo cookies."
  },
  {
    id: "fss-5",
    name: "Sweet Rasmalai Shake",
    category: "FIRANGI SPL. SHAKE",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 115,
    description: "The ultimate Indian dessert shake! Saffron, cardamom, and pistachio blended with actual rasmalai dumplings."
  },

  // --- SOUP ---
  {
    id: "s-1",
    name: "Lime Chilli Soup",
    category: "SOUP",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 65,
    description: "Zesty clear hot vegetable broth cooked with squeezed fresh lime juice, green chilies, and coriander."
  },
  {
    id: "s-2",
    name: "Garden Mint Soup",
    category: "SOUP",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 65,
    description: "A comforting aromatic soup loaded with diced summer garden veggies and a cooling mint infusion."
  },
  {
    id: "s-3",
    name: "Chilli Garlic Soup",
    category: "SOUP",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 65,
    description: "A punchy, spicy broth loaded with minced garlic cloves, red chilies, and crunchy cabbage juliennes."
  },
  {
    id: "s-4",
    name: "Manchow Soup",
    category: "SOUP",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 65,
    description: "Famous Indo-Chinese thick soup with assorted minced vegetables, served topped with crispy fried noodles."
  },

  // --- FIRANGI'S SPL. ---
  {
    id: "fs-1",
    name: "Vada Pao",
    category: "FIRANGI'S SPL.",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: { half: 39, full: 65 },
    description: "Golden fried spiced potato dumpling pressed inside soft butter-toasted buns with spicy garlic-peanut powder."
  },
  {
    id: "fs-2",
    name: "Pao Bhaji",
    category: "FIRANGI'S SPL.",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 90,
    description: "Thick, flavorful mashed vegetable curry cooked with special spices on flat griddle, served with 2 warm buttered buns."
  },
  {
    id: "fs-3",
    name: "Masala Vada Pao",
    category: "FIRANGI'S SPL.",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 90,
    description: "Standard Vada Pao with a splash of hot masala gravy poured right inside the buns for extra moisture."
  },
  {
    id: "fs-4",
    name: "Cheese Vada Pao",
    category: "FIRANGI'S SPL.",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 90,
    description: "Spiced potato vada inside buttered pao buns, melted cheddar slice, and creamy mayo."
  },
  {
    id: "fs-5",
    name: "Extra Pao",
    category: "FIRANGI'S SPL.",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 25,
    description: "A single pair of fresh bakery-baked pao buns toasted with warm yellow butter."
  },

  // --- BURGER ---
  {
    id: "b-1",
    name: "Aloo Tikki Burger",
    category: "BURGER",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 50,
    description: "Traditional street food flavor: Crispy potato patty, chopped sweet onions, tomatoes, and sweet-sour mint sauce."
  },
  {
    id: "b-2",
    name: "Herb Chilli Burger",
    category: "BURGER",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 75,
    description: "A golden-fried potato patty spiced with savory herbs, red chili flakes, and creamy spicy sauce."
  },
  {
    id: "b-3",
    name: "Veggie Burger",
    category: "BURGER",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 75,
    description: "Assorted vegetables patty, layered with fresh lettuce leaf, crisp cucumber, and standard eggless mayo."
  },
  {
    id: "b-4",
    name: "Royal Paneer Burger",
    category: "BURGER",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 90,
    description: "Thick paneer slab marinated, golden fried, topped with dynamic chili sauce and premium cheese blend."
  },
  {
    id: "b-5",
    name: "Jumbo Classic Burger",
    category: "BURGER",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 129,
    description: "Double patty (veggie + potato) stack with double cheese slices, lettuce, and house-special thousand island dressing."
  },
  {
    id: "b-6",
    name: "Extra Cheese",
    category: "BURGER",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 20,
    description: "Add an extra slice of creamy, gooey processed cheddar cheese to your burger."
  },

  // --- SANDWICH ---
  {
    id: "sa-1",
    name: "Cold Sandwich",
    category: "SANDWICH",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 50,
    description: "Diced cucumber, carrot, and sweet corn tossed in dynamic cream cheese and black pepper, served chilled."
  },
  {
    id: "sa-2",
    name: "Cheese Grilled Sandwich",
    category: "SANDWICH",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 75,
    description: "Toasted white bread loaded with grated mozzarella and cheddar cheese, grilled until molten gold."
  },
  {
    id: "sa-3",
    name: "Chilli Garlic Sandwich",
    category: "SANDWICH",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 75,
    description: "A fiery mix of hot red garlic chili paste, golden sweet corn, and melty cheese grilled to perfection."
  },
  {
    id: "sa-4",
    name: "Cheese Corn Sandwich",
    category: "SANDWICH",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 90,
    description: "Sweet American sweetcorn mixed with gooey mozzarella cheese and soft herbs, grilled beautifully."
  },
  {
    id: "sa-5",
    name: "Tandoori Paneer Sandwich",
    category: "SANDWICH",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 105,
    description: "Cubes of paneer seasoned in a high-flavor tandoori marinade, green bell peppers, onions, and tandoori mayo."
  },

  // --- WRAP ---
  {
    id: "w-1",
    name: "Veg Wrap",
    category: "WRAP",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 75,
    description: "Crispy fried vegetable patty rolled in a soft flatbread with julienned cabbage, onions, and creamy mayo."
  },
  {
    id: "w-2",
    name: "Spicy Fries Wrap",
    category: "WRAP",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 75,
    description: "Unique fusion wrap: Crispy hot french fries loaded inside a wrap with fiery sriracha and salsa."
  },
  {
    id: "w-3",
    name: "Mexican Wrap",
    category: "WRAP",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 90,
    description: "A hearty wrap with mixed vegetable beans, sweetcorn, crunchy nacho chips, cheese, and spicy Mexican salsa."
  },
  {
    id: "w-4",
    name: "Paneer Salsa Wrap",
    category: "WRAP",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 105,
    description: "Chunks of fresh cottage cheese stir-fried with diced bell peppers and mixed with tangy tomato salsa inside a warm wrap."
  },

  // --- PASTA ---
  {
    id: "pa-1",
    name: "Tomato Pasta",
    category: "PASTA",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 105,
    description: "Penne pasta tossed in an aromatic, slow-simmered marinara sauce with garlic, basil, and black olives."
  },
  {
    id: "pa-2",
    name: "White Sauce Pasta",
    category: "PASTA",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 129,
    description: "Rich and creamy penne pasta bathed in butter, fresh cream, white flour roux, sweetcorn, and broccoli."
  },
  {
    id: "pa-3",
    name: "Red Sauce Pasta",
    category: "PASTA",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: 129,
    description: "Spicy, herb-flavored tomato gravy coated penne pasta loaded with mushrooms, capsicum, and oregano."
  },
  {
    id: "pa-4",
    name: "Mix Sauce Pasta",
    category: "PASTA",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 155,
    description: "The best of both worlds! A luscious creamy pink sauce combining spicy red and smooth white pasta bases."
  },

  // --- FRIES ---
  {
    id: "fr-1",
    name: "French Fries",
    category: "FRIES",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: 90,
    description: "Golden fried crispy potato fingers lightly seasoned with fine table salt. Crispy outside, fluffy inside."
  },
  {
    id: "fr-2",
    name: "Peri Peri Fries",
    category: "FRIES",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: 105,
    description: "Our classic salted fries tossed in a generous coating of spicy, tangy African peri-peri spice dust."
  },
  {
    id: "fr-3",
    name: "Ultimate Cheese Fries",
    category: "FRIES",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: 129,
    description: "A mountain of crispy fries drenched in rich, molten warm cheese sauce and garnished with chives."
  },

  // --- SPECIAL CHAAP ---
  {
    id: "ch-1",
    name: "Malai Chaap",
    category: "SPECIAL CHAAP",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    price: { half: 155, full: 255 },
    description: "Soft soybean chaap cutlets marinated in premium cashew nut paste, sweet cream, butter, and mild herbs."
  },
  {
    id: "ch-2",
    name: "Achari Chaap",
    category: "SPECIAL CHAAP",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: { half: 155, full: 255 },
    description: "Tangy and spicy marinated soya sticks coated in pickled mango spices and grilled over red-hot charcoals."
  },
  {
    id: "ch-3",
    name: "Afgani Chaap",
    category: "SPECIAL CHAAP",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    price: { half: 155, full: 255 },
    description: "Soya sticks infused with crushed black pepper, heavy cream, garlic paste, and roasted in a traditional tandoor."
  },
  {
    id: "ch-4",
    name: "Gravy Chaap",
    category: "SPECIAL CHAAP",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: { half: 155, full: 255 },
    description: "Grilled soy chaap pieces simmered inside a rich, spicy, onion-tomato-cashew masala gravy."
  },
  {
    id: "ch-5",
    name: "Rogan Chaap",
    category: "SPECIAL CHAAP",
    isVeg: true,
    isSpicy: true,
    isSpecial: false,
    price: { half: 155, full: 255 },
    description: "Soya chaap cooked in a deep red, aromatic royal Kashmiri style gravy flavored with fennel and dry ginger."
  },
  {
    id: "ch-6",
    name: "Tandoori Chaap",
    category: "SPECIAL CHAAP",
    isVeg: true,
    isSpicy: true,
    isSpecial: true,
    price: { half: 139, full: 245 },
    description: "Soybean chaap marinated in thick yogurt, mustard oil, lemon juice, red chili powder, and baked in hot tandoor."
  }
];
