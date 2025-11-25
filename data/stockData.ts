
// Curated Stock Library for "Wizard of Oz" Demo
// Unsplash IDs selected for high quality, North American aesthetic, and diversity

export type StockCategory = 'NAILS' | 'BARBER' | 'HAIR' | 'SPA' | 'TUTORIAL' | 'PRODUCT' | 'GENERAL';

interface StockImage {
  id: string;
  url: string;
  prompt: string; // Used for alt text or fallback
}

const STOCK_LIBRARY: Record<StockCategory, StockImage[]> = {
  NAILS: [
    { id: 'n1', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80', prompt: 'Close up of gel manicure' },
    { id: 'n2', url: 'https://images.unsplash.com/photo-1632973547304-46e75e927088?w=800&q=80', prompt: 'Aesthetic nail art details' },
    { id: 'n3', url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=800&q=80', prompt: 'Woman getting manicure in salon' },
    { id: 'n4', url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80', prompt: 'Pastel nail polish bottles' },
    { id: 'n5', url: 'https://images.unsplash.com/photo-1599693929330-919691bb947c?w=800&q=80', prompt: 'Acrylic nails close up' },
    { id: 'n6', url: 'https://images.unsplash.com/photo-1505250056177-db7f06ba4b02?w=800&q=80', prompt: 'Pedicure setup with flowers' },
  ],
  BARBER: [
    { id: 'b1', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80', prompt: 'Barber giving a fade haircut' },
    { id: 'b2', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80', prompt: 'Beard trim with hot towel' },
    { id: 'b3', url: 'https://images.unsplash.com/photo-1503951914875-befbb7135952?w=800&q=80', prompt: 'Vintage barbershop interior' },
    { id: 'b4', url: 'https://images.unsplash.com/photo-1599351431202-6e0c06e76553?w=800&q=80', prompt: 'Barber tools and clippers' },
    { id: 'b5', url: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?w=800&q=80', prompt: 'Man getting haircut profile view' },
    { id: 'b6', url: 'https://images.unsplash.com/photo-1512690459411-b9245aed6191?w=800&q=80', prompt: 'Grooming products for men' },
    { id: 'b7', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80', prompt: 'Close up of shaver and foam' },
  ],
  HAIR: [
    { id: 'h1', url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80', prompt: 'Professional hair coloring process' },
    { id: 'h2', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80', prompt: 'Stylist blow drying hair' },
    { id: 'h3', url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80', prompt: 'Braided hair styling' },
    { id: 'h4', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', prompt: 'Modern hair salon interior' },
    { id: 'h5', url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80', prompt: 'Curly hair styling' },
    { id: 'h6', url: 'https://images.unsplash.com/photo-1521590832169-dca21b3346b9?w=800&q=80', prompt: 'Salon reception desk' },
    { id: 'h7', url: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&q=80', prompt: 'Diverse hair textures model' },
  ],
  SPA: [
    { id: 's1', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80', prompt: 'Woman enjoying a facial mask' },
    { id: 's2', url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80', prompt: 'Relaxing spa massage setting' },
    { id: 's3', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', prompt: 'Skincare products and towel' },
    { id: 's4', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af93?w=800&q=80', prompt: 'Zen stones and flower' },
    { id: 's5', url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80', prompt: 'Applying serum to face' },
  ],
  TUTORIAL: [
    { id: 't1', url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80', prompt: 'Makeup tutorial setup with ring light' },
    { id: 't2', url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', prompt: 'Hands styling hair close up' },
    { id: 't3', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', prompt: 'Business owner recording video' },
    { id: 't4', url: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?w=800&q=80', prompt: 'Flatlay of tools for tutorial' },
  ],
  PRODUCT: [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', prompt: 'Minimal skincare bottle serum' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1571781535021-7b08dd2b7252?w=800&q=80', prompt: 'Shelf with beauty products' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80', prompt: 'Aesthetic product packaging' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1556228720-1957be83f360?w=800&q=80', prompt: 'Shopping bag and items' },
    { id: 'p5', url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80', prompt: 'Shampoo and conditioner bottles' },
    { id: 'p6', url: 'https://images.unsplash.com/photo-1585232561025-535b2084df71?w=800&q=80', prompt: 'Hair care products on shelf' },
    { id: 'p7', url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800&q=80', prompt: 'Salon retail display shelves' },
    { id: 'p8', url: 'https://images.unsplash.com/photo-1592910147752-5e08890c9972?w=800&q=80', prompt: 'Luxury conditioner bottle' },
  ],
  GENERAL: [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1521590832169-dca21b3346b9?w=800&q=80', prompt: 'Modern small business reception' },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', prompt: 'Clean aesthetic workspace' },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', prompt: 'Handshake transaction success' },
    { id: 'g4', url: 'https://images.unsplash.com/photo-1493612276216-9c78370631f6?w=800&q=80', prompt: 'Coffee and planning notebook' },
  ]
};

export const getSmartImages = (text: string): StockImage[] => {
  const t = text.toLowerCase();
  
  if (t.includes('nail') || t.includes('manicure') || t.includes('pedicure') || t.includes('polish') || t.includes('gel') || t.includes('acrylic')) {
    return STOCK_LIBRARY.NAILS;
  }
  if (t.includes('barber') || t.includes('fade') || t.includes('shave') || t.includes('beard') || t.includes('men') || t.includes('gentleman') || t.includes('trim') || t.includes('grooming') || t.includes('razor')) {
    return STOCK_LIBRARY.BARBER;
  }
  if (t.includes('hair') || t.includes('cut') || t.includes('blow') || t.includes('color') || t.includes('dye') || t.includes('blonde') || t.includes('brunette') || t.includes('balayage') || t.includes('style') || t.includes('salon')) {
    return STOCK_LIBRARY.HAIR;
  }
  if (t.includes('spa') || t.includes('facial') || t.includes('skin') || t.includes('mask') || t.includes('massage') || t.includes('relax') || t.includes('wax') || t.includes('botox') || t.includes('esthetician')) {
    return STOCK_LIBRARY.SPA;
  }
  if (t.includes('tutorial') || t.includes('how to') || t.includes('process') || t.includes('teach') || t.includes('learn') || t.includes('behind the scenes') || t.includes('bts')) {
    return STOCK_LIBRARY.TUTORIAL;
  }
  if (t.includes('product') || t.includes('serum') || t.includes('shampoo') || t.includes('buy') || t.includes('sale') || t.includes('shelf') || t.includes('retail') || t.includes('conditioner') || t.includes('lotion') || t.includes('shop') || t.includes('store')) {
    return STOCK_LIBRARY.PRODUCT;
  }

  // Fallback
  return STOCK_LIBRARY.GENERAL;
};
