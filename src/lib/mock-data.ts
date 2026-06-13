/**
 * Mock data for CARWO GOBSAN kitchenware products
 * Used for development and as fallback when API is unavailable
 */

import { Product } from './insforge';

export const mockProducts: Product[] = [
  // Cookware
  {
    id: 'prod-001',
    name_en: 'Non-Stick Frying Pan 28cm',
    name_so: 'Dhiso Albaabada Ah 28cm',
    description_en: 'Premium non-stick frying pan with heat-resistant handle. Perfect for everyday cooking.',
    description_so: 'Dhiso albaabada ah oo tayo sare leh, xidid kululeyska leh. Ku habboon cunto karinta maalin kasta.',
    price: 24.99,
    image: '/products/frying-pan-28cm.jpg',
    category: 'Cookware',
    stock: 50,
    featured: true,
  },
  {
    id: 'prod-002',
    name_en: 'Stainless Steel Pot Set 5-Piece',
    name_so: 'Dhisdada Birta Ah 5 Qaybood',
    description_en: 'Complete 5-piece stainless steel pot set with lids. Durable and dishwasher safe.',
    description_so: 'Dhisdada birta ah oo 5 qaybo ah, lakabaya dhalo. Mid adag oo mashiinka dharka lagu dhaqdo.',
    price: 89.99,
    image: '/products/pot-set-5pc.jpg',
    category: 'Cookware',
    stock: 30,
    featured: true,
  },
  {
    id: 'prod-003',
    name_en: 'Cast Iron Dutch Oven 4.5L',
    name_so: 'Dhiso Biraa Ah 4.5L',
    description_en: 'Heavy-duty cast iron dutch oven with enameled interior. Perfect for slow cooking.',
    description_so: 'Dhiso biraa ah oo adag, gudaha mid casri ah. Ku habboon karinta si tartiib ah.',
    price: 79.99,
    image: '/products/dutch-oven.jpg',
    category: 'Cookware',
    stock: 20,
    featured: false,
  },
  {
    id: 'prod-004',
    name_en: 'Aluminum Saucepan 20cm',
    name_so: 'Dhiso Alumiinyam 20cm',
    description_en: 'Lightweight aluminum saucepan with glass lid. Heat distributes evenly.',
    description_so: 'Dhiso alumiinyam oo fudud, lakabaya dhalo quraar ah. Kulaylka si siman u gaara.',
    price: 19.99,
    image: '/products/saucepan-20cm.jpg',
    category: 'Cookware',
    stock: 45,
    featured: false,
  },
  {
    id: 'prod-005',
    name_en: 'Wok Pan 32cm with Lid',
    name_so: 'Dhiso Wok 32cm oo Dhalo Le',
    description_en: 'Traditional wok pan with flat bottom for modern stoves. Includes lid.',
    description_so: 'Dhiso wok tradishanka ah, hoose siman. Lakabaya dhalo.',
    price: 34.99,
    image: '/products/wok-32cm.jpg',
    category: 'Cookware',
    stock: 35,
    featured: false,
  },
  {
    id: 'prod-006',
    name_en: 'Stock Pot 12L Stainless Steel',
    name_so: 'Dhiso Weyn 12L Birta Ah',
    description_en: 'Large capacity stock pot for soups and stews. Commercial grade quality.',
    description_so: 'Dhiso weyn oo awood weyn leh, lagu kariyo maraq iyo cunto kale. Tayo ganacsadeed.',
    price: 49.99,
    image: '/products/stock-pot-12l.jpg',
    category: 'Cookware',
    stock: 25,
    featured: false,
  },
  {
    id: 'prod-007',
    name_en: 'Grill Pan with Ridges',
    name_so: 'Dhiso Sharanle Le',
    description_en: 'Cast aluminum grill pan for perfect searing. Works on all cooktops.',
    description_so: 'Dhiso sharanle le oo alumiinyam ah. Ku shaqeeya kulayl dhammaan noocaba.',
    price: 29.99,
    image: '/products/grill-pan.jpg',
    category: 'Cookware',
    stock: 40,
    featured: false,
  },

  // Small Appliances
  {
    id: 'prod-008',
    name_en: 'Digital Rice Cooker 1.8L',
    name_so: 'Mashiinka Bariiska 1.8L',
    description_en: 'Automatic rice cooker with digital display. Makes perfect rice every time.',
    description_so: 'Mashiin bariis ah oo automatic ah. Wuxuu sameeyaa bariis wanaagsan mar walba.',
    price: 45.99,
    image: '/products/rice-cooker-1.8l.jpg',
    category: 'Small Appliances',
    stock: 60,
    featured: true,
  },
  {
    id: 'prod-009',
    name_en: 'Blender 1200W Professional',
    name_so: 'Blender 1200W Xirfadlayaal',
    description_en: 'Powerful 1200W blender for smoothies, soups, and more. BPA-free pitcher.',
    description_so: 'Blender awood badan oo 1200W ah. Ku habboon shaambo, maraq, iyo waxyaabo kale.',
    price: 69.99,
    image: '/products/blender-1200w.jpg',
    category: 'Small Appliances',
    stock: 35,
    featured: true,
  },
  {
    id: 'prod-010',
    name_en: 'Electric Kettle 1.7L',
    name_so: 'Dhamas Shidan 1.7L',
    description_en: 'Fast boiling electric kettle with auto shut-off. Stainless steel body.',
    description_so: 'Dhamas kulayl ah oo degdeg ah. Jasad birta ah, si toos ah u damay.',
    price: 29.99,
    image: '/products/electric-kettle-1.7l.jpg',
    category: 'Small Appliances',
    stock: 55,
    featured: false,
  },
  {
    id: 'prod-011',
    name_en: 'Food Processor 1000W',
    name_so: 'Mashiinka Cunto 1000W',
    description_en: 'Multi-function food processor with multiple attachments. 10-cup capacity.',
    description_so: 'Mashiin cunto ah oo qayb badan leh. Awood 10 koob ah.',
    price: 89.99,
    image: '/products/food-processor-1000w.jpg',
    category: 'Small Appliances',
    stock: 25,
    featured: false,
  },
  {
    id: 'prod-012',
    name_en: 'Hand Mixer 300W',
    name_so: 'Mixer Gacanta 300W',
    description_en: 'Lightweight hand mixer with 5 speeds. Includes beaters and dough hooks.',
    description_so: 'Mixer gacanta ah oo fudud, 5 xawaare. Lakabaya qalab kala duwan.',
    price: 24.99,
    image: '/products/hand-mixer-300w.jpg',
    category: 'Small Appliances',
    stock: 40,
    featured: false,
  },
  {
    id: 'prod-013',
    name_en: 'Toaster Oven 1500W',
    name_so: 'Fornada 1500W',
    description_en: 'Versatile toaster oven with convection. Fits a 12-inch pizza.',
    description_so: 'Fornada yaab badan leh. Wuxuu qabaa baasto 12 inji ah.',
    price: 59.99,
    image: '/products/toaster-oven-1500w.jpg',
    category: 'Small Appliances',
    stock: 30,
    featured: false,
  },
  {
    id: 'prod-014',
    name_en: 'Air Fryer 5.5L Digital',
    name_so: 'Mashiinka Fry-ga Hawada 5.5L',
    description_en: 'Large capacity air fryer with digital controls. Healthier frying option.',
    description_so: 'Mashiin fry ah oo hawada ah. Cunto caafimaad qabta.',
    price: 79.99,
    image: '/products/air-fryer-5.5l.jpg',
    category: 'Small Appliances',
    stock: 45,
    featured: true,
  },
  {
    id: 'prod-015',
    name_en: 'Coffee Maker 12-Cup',
    name_so: 'Mashiinka Qaxwada 12-Koob',
    description_en: 'Programmable coffee maker with thermal carafe. Keeps coffee hot for hours.',
    description_so: 'Mashiin qaxwo ah oo barnaamij lagu sameeyo. Wuxuu qaxwada kululiya saacad badan.',
    price: 54.99,
    image: '/products/coffee-maker-12cup.jpg',
    category: 'Small Appliances',
    stock: 35,
    featured: false,
  },

  // Tableware
  {
    id: 'prod-016',
    name_en: 'Ceramic Dinner Set 16-Piece',
    name_so: 'Dhisko Cunto 16-Qaybood',
    description_en: 'Elegant ceramic dinner set for 4. Includes plates, bowls, and mugs.',
    description_so: 'Dhisko cunto qurux badan oo 4 qof ah. Lakabaya saxano, dhalo, iyo finyo.',
    price: 64.99,
    image: '/products/ceramic-dinner-set-16pc.jpg',
    category: 'Tableware',
    stock: 25,
    featured: true,
  },
  {
    id: 'prod-017',
    name_en: 'Glass Water Pitcher 2L',
    name_so: 'Dhalo Biyo Quraar Ah 2L',
    description_en: 'Elegant glass pitcher with stainless steel lid. Perfect for serving.',
    description_so: 'Dhalo biyo quraar ah, lakabaya dhalo birta ah. Ku habboon adeegga.',
    price: 19.99,
    image: '/products/glass-pitcher-2l.jpg',
    category: 'Tableware',
    stock: 50,
    featured: false,
  },
  {
    id: 'prod-018',
    name_en: 'Stainless Steel Cutlery Set 24-Piece',
    name_so: 'Qalab Cunto 24-Qaybood',
    description_en: 'Premium stainless steel cutlery set for 6. Includes forks, spoons, and knives.',
    description_so: 'Qalab cunto tayo sare leh oo 6 qof ah. Lakabaya foolal, malqacad, iyo mindi.',
    price: 34.99,
    image: '/products/cutlery-set-24pc.jpg',
    category: 'Tableware',
    stock: 40,
    featured: false,
  },
  {
    id: 'prod-019',
    name_en: 'Plastic Food Storage Set 18-Piece',
    name_so: 'Wakaalada Cunto 18-Qaybood',
    description_en: 'BPA-free food storage containers with snap-lock lids. Various sizes.',
    description_so: 'Wakaalada cunto ah oo BPA la\'aan. Cabbir kala duwan.',
    price: 24.99,
    image: '/products/storage-set-18pc.jpg',
    category: 'Tableware',
    stock: 55,
    featured: false,
  },
  {
    id: 'prod-020',
    name_en: 'Serving Tray Set 3-Piece',
    name_so: 'Saxan Adeeg 3-Qaybood',
    description_en: 'Set of 3 serving trays in different sizes. Elegant design for any occasion.',
    description_so: '3 saxan adeeg ah oo cabbir kala duwan. Naqshad qurux badan.',
    price: 29.99,
    image: '/products/serving-tray-3pc.jpg',
    category: 'Tableware',
    stock: 35,
    featured: false,
  },
  {
    id: 'prod-021',
    name_en: 'Porcelain Tea Set 6-Piece',
    name_so: 'Dhisko Shaah 6-Qaybood',
    description_en: 'Beautiful porcelain tea set with teapot and 4 cups with saucers.',
    description_so: 'Dhisko shaah qurux badan oo faroole leh iyo 4 finyo.',
    price: 44.99,
    image: '/products/tea-set-6pc.jpg',
    category: 'Tableware',
    stock: 30,
    featured: false,
  },
  {
    id: 'prod-022',
    name_en: 'Wooden Salad Bowl Set',
    name_so: 'Saxan Salate Alayga Ah',
    description_en: 'Natural wooden salad bowl with serving spoons. Eco-friendly.',
    description_so: 'Saxan salate geed ah, lakabaya malqacad. Dabcan degdeg ah.',
    price: 39.99,
    image: '/products/wooden-salad-bowl.jpg',
    category: 'Tableware',
    stock: 25,
    featured: false,
  },
  {
    id: 'prod-023',
    name_en: 'Glass Mixing Bowls Set 5-Piece',
    name_so: 'Dhisdada Isku-darka 5-Qaybood',
    description_en: 'Nested glass mixing bowls in 5 sizes. Microwave and dishwasher safe.',
    description_so: 'Dhisdada isku-darka ah ee 5 cabbir. Ku shaqeeya microwave iyo mashiinka dharka.',
    price: 27.99,
    image: '/products/mixing-bowls-5pc.jpg',
    category: 'Tableware',
    stock: 45,
    featured: false,
  },
];

// Helper function to get products by category
export function getProductsByCategory(category: Product['category']): Product[] {
  return mockProducts.filter(product => product.category || "" === category);
}

// Helper function to get featured products
export function getFeaturedProducts(): Product[] {
  return mockProducts.filter(product => product.featured);
}

// Helper function to search products
export function searchProducts(query: string, lang: 'en' | 'so' = 'en'): Product[] {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product => {
    const name = lang === 'en' ? product.name_en : product.name_so;
    const description = lang === 'en' ? product.description_en : product.description_so;
    return (
      name.toLowerCase().includes(lowerQuery) ||
      (description && description.toLowerCase().includes(lowerQuery)) ||
      product.category || "".toLowerCase().includes(lowerQuery)
    );
  });
}

// Categories with translations
export const categories = [
  { id: 'Cookware', name_en: 'Cookware', name_so: 'Dhismo Cunto Karin' },
  { id: 'Small Appliances', name_en: 'Small Appliances', name_so: 'Mashiinada Yar' },
  { id: 'Tableware', name_en: 'Tableware', name_so: 'Qalabka Miiska' },
];

export default mockProducts;
