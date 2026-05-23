export interface Archetype {
  id: string;
  name: string;
  emoji: string;
  icon: string;
  tags: string[];
  desc: string;
}

export interface Legend {
  id: string;
  name: string;
  emoji: string;
  type: 'model' | 'designer';
  era: string;
  title: string;
  tags: string[];
  color: string;
  intro: string;
  suggestions: string[];
  stats: Record<string, string | number>;
  quote: string;
  timeline: { year: string; title: string; text: string }[];
  media: { icon: string; type: string; title: string; wide: boolean }[];
}

export interface Comment {
  av: string;
  user: string;
  text: string;
  time: string;
}

export interface FeedItem {
  user: string;
  av: string;
  time: string;
  arch: string;
  score: number;
  emoji: string;
  imgSrc: string | null;
  caption: string;
  likes: number;
  comments: Comment[];
  isCollab?: boolean;
  partner?: { name: string; av: string; handle: string };
  reactions?: Record<string, number>;
}

export interface WardrobeItem {
  cat: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'bags' | 'accessories';
  name: string;
  brand?: string;
  price?: number;
  img: string | null;
  worn: boolean;
  added: number;
  outfit?: boolean;
}

export const ARCHETYPES: Archetype[] = [
  { id: 'classic', name: 'Clean Girl', emoji: '🤍', icon: 'Hailey Bieber', tags: ['Minimal', 'Polished', 'Slick Bun'], desc: 'The most viral aesthetic of the era. Sleek buns, barely-there makeup, gold hoops, and effortlessly tailored basics.' },
  { id: 'streetwear', name: 'Streetwear', emoji: '👟', icon: 'Virgil Abloh', tags: ['Urban', 'Hype', 'Layered'], desc: 'Where luxury meets the block. Oversized silhouettes, bold graphics, limited-edition sneakers, and an effortless cool.' },
  { id: 'oldmoney', name: 'Old Money', emoji: '💼', icon: 'Grace Kelly', tags: ['Quiet Luxury', 'Heritage', 'Minimalist'], desc: 'Wealth that whispers. Logo-free but unmistakably expensive. Cashmere, linen, and heritage elements.' },
  { id: 'avantgarde', name: 'Avant-Garde', emoji: '🪡', icon: 'Rei Kawakubo', tags: ['Experimental', 'Sculptural', 'Conceptual'], desc: 'Fashion as art. Deconstructed silhouettes, unexpected materials, and shapes that challenge the status quo.' },
  { id: 'sporty', name: 'Sporty Luxe', emoji: '🎽', icon: 'Kendall Jenner', tags: ['Athletic', 'Luxury', 'Elevated'], desc: 'Performance fabrics elevated to runway status. Premium leggings, designer trainers, and sleek zip-ups.' },
  { id: 'bohemian', name: 'Cottagecore', emoji: '🌿', icon: 'Taylor Swift', tags: ['Whimsical', 'Nature', 'Romantic'], desc: 'Prairie dresses, floral prints, artisan knitwear, and earthy tones that signal a slower, more intentional lifestyle.' },
  { id: 'coquette', name: 'Coquette', emoji: '🎀', icon: 'Lily-Rose Depp', tags: ['Feminine', 'Romantic', 'Bows'], desc: 'Bows, lace, soft pastels, and delicate silhouettes. The hyper-feminine aesthetic with absolute elegance.' },
  { id: 'glamour', name: 'Mob Wife', emoji: '👠', icon: 'Bella Hadid', tags: ['Maximalist', 'Bold', 'Luxe'], desc: 'Fur coats, oversized sunglasses, gold chains, and zero apologies. More is more — always.' },
  { id: 'darkacademia', name: 'Dark Academia', emoji: '📚', icon: 'Tilda Swinton', tags: ['Intellectual', 'Gothic', 'Layered'], desc: 'Tweed blazers, turtlenecks, plaid, and leather-bound books. A brooding palette of earth tones.' },
  { id: 'y2k', name: 'Y2K / Cyber', emoji: '💿', icon: 'Doja Cat', tags: ['Nostalgic', 'Bold', 'Digital'], desc: 'Early 2000s nostalgia meets futurism. Low-rise jeans, metallic fabrics, butterfly clips, and velour tracksuits.' }
];

export const LEGENDS: Legend[] = [
  {
    id: 'audrey',
    name: 'Audrey Hepburn',
    emoji: '🎀',
    type: 'model',
    era: '1950s–1990s',
    title: 'Timeless Elegance Icon',
    tags: ['Classic', 'Givenchy', 'Hollywood'],
    color: '#fff0eb,#ffe8d0',
    intro: "Darling, fashion is not just about clothes — it's about the woman who wears them with grace. I am here to share everything.",
    suggestions: ['What made your style so iconic?', 'Tell me about your Givenchy era', 'How do I dress like Old Money?'],
    stats: { covers: '100+', decades: 4, films: 31 },
    quote: "Elegance is the only beauty that never fades.",
    timeline: [
      { year: '1953', title: 'Roman Holiday', text: 'Her debut in a white sundress and cropped haircut rewrote the rules of Hollywood glamour.' },
      { year: '1961', title: 'Breakfast at Tiffany\'s', text: 'The little black Givenchy dress, pearl necklace, and updo became the single most influential fashion moment in cinema.' }
    ],
    media: [
      { icon: '🎬', type: 'Film', title: 'Breakfast at Tiffany\'s (1961)', wide: false },
      { icon: '📸', type: 'Campaign', title: 'Givenchy L\'Interdit', wide: false }
    ]
  },
  {
    id: 'virgil',
    name: 'Virgil Abloh',
    emoji: '🧢',
    type: 'designer',
    era: '2010s–2021',
    title: 'Street & Luxury Architect',
    tags: ['Off-White', 'LV', 'Streetwear'],
    color: '#f0f0ff,#e0e0ff',
    intro: "Everything I create starts with a question mark. Fashion should provoke, disrupt, and ultimately belong to the next generation.",
    suggestions: ['How did you blend street and luxury?', 'What is the 3% rule?', 'How do I build a streetwear wardrobe?'],
    stats: { shows: 28, brands: 2, legacy: '∞' },
    quote: "Everything I do is for the 17-year-old version of me.",
    timeline: [
      { year: '2013', title: 'Off-White Founded', text: 'His Milan-based label redefined what a luxury streetwear brand could be.' },
      { year: '2018', title: 'Louis Vuitton Men\'s', text: 'His debut show — a rainbow runway bridge — made grown fashion critics weep.' }
    ],
    media: [
      { icon: '🎬', type: 'Documentary', title: 'Figures of Speech — Documentary', wide: true },
      { icon: '📸', type: 'Show', title: 'LV SS19 "The Wizard of Oz" Show', wide: false }
    ]
  },
  {
    id: 'gisele',
    name: 'Gisele Bündchen',
    emoji: '🌟',
    type: 'model',
    era: '1994–present',
    title: 'The World\'s Top Supermodel',
    tags: ['Victoria\'s Secret', 'Runway', 'Brazil'],
    color: '#f0fff4,#e0ffe8',
    intro: "Beauty starts from within — but a great outfit never hurts. I've walked every runway there is. Ask me anything, chérie.",
    suggestions: ['How did you become the highest paid model?', 'What is Brazilian beauty?', 'Tell me your Victoria\'s Secret era'],
    stats: { campaigns: '500+', runways: 400, years: 30 },
    quote: "Confidence is the most beautiful thing you can wear.",
    timeline: [
      { year: '1999', title: 'Runway Sensation', text: 'Her high-energy strut launched the era of the "Brazilian bombshell" in fashion.' },
      { year: '2000', title: 'Victoria\'s Secret Legend', text: 'Signed the most lucrative model contract ever, modeling the iconic Fantasy Bra.' }
    ],
    media: [
      { icon: '📸', type: 'Campaign', title: 'Versace Campaign 2000', wide: false },
      { icon: '🎬', type: 'Show', title: 'VS Fantasy Bra Finale 2005', wide: false }
    ]
  },
  {
    id: 'naomi',
    name: 'Naomi Campbell',
    emoji: '👑',
    type: 'model',
    era: '1986–present',
    title: 'The Supermodel of Supermodels',
    tags: ['Versace', 'Iconic Walk', 'London'],
    color: '#fff0f8,#ffe0f0',
    intro: "Nobody tells me what I can and cannot do. I walked so every model after me could run. Come. Ask. Learn.",
    suggestions: ['Tell me about the original supermodel era', 'What makes the perfect runway walk?', 'Tell me about the Versace legacy'],
    stats: { covers: 600, campaigns: '700+', decades: 4 },
    quote: "There are no rules in fashion — only rules you set yourself.",
    timeline: [
      { year: '1986', title: 'Discovery', text: 'Scouted at 15 in London, quickly skyrocketing to international status.' },
      { year: '1988', title: 'Racial Barriers Broken', text: 'Became the first Black model on the cover of French Vogue.' }
    ],
    media: [
      { icon: '📸', type: 'Campaign', title: 'Versace Spring/Summer 1994', wide: false },
      { icon: '🎬', type: 'Documentary', title: 'The Supermodels — Apple TV+', wide: false }
    ]
  },
  {
    id: 'mcqueen',
    name: 'Alexander McQueen',
    emoji: '🦅',
    type: 'designer',
    era: '1992–2010',
    title: 'The Romantic Anarchist',
    tags: ['Savage Beauty', 'Gothic', 'Sculptural'],
    color: '#f0f0ff,#e8e0ff',
    intro: "Fashion should be a form of escapism, and not a form of imprisonment. I made clothes to provoke and liberate.",
    suggestions: ['Tell me about Savage Beauty', 'What was your most iconic show?', 'How do I embrace dark romance?'],
    stats: { shows: 36, years: 18, exhibitions: '8M+' },
    quote: "You've got to know the rules to break them.",
    timeline: [
      { year: '1992', title: 'Central Saint Martins graduation', text: 'His legendary MA collection was bought in its entirety by Isabella Blow.' },
      { year: '1999', title: 'No. 13', text: 'Shalom Harlow spun on a rotating plate while industrial robots painted her gown.' }
    ],
    media: [
      { icon: '🏛️', type: 'Exhibition', title: 'Savage Beauty — Met Museum 2011', wide: true },
      { icon: '🎬', type: 'Documentary', title: 'McQueen Documentary (2018)', wide: false }
    ]
  },
  {
    id: 'bella',
    name: 'Bella Hadid',
    emoji: '🌹',
    type: 'model',
    era: '2014–present',
    title: 'Modern Editorial Icon',
    tags: ['Runway', 'Dior', 'Orebella'],
    color: '#fff0f0,#ffe0e8',
    intro: "I want to show the world that beauty is not about perfection. I've been broken and rebuilt. Fashion saved me.",
    suggestions: ['Tell me about the spray-on Coperni dress', 'What is your street style secret?', 'How did you launch Orebella?'],
    stats: { covers: '500+', shows: '500+', campaigns: 180 },
    quote: "I don't want to be the most beautiful. I want to be the most real.",
    timeline: [
      { year: '2016', title: 'Cannes Milestone', text: 'Her red Alexandre Vauthier gown put her at the absolute peak of red carpet iconography.' },
      { year: '2022', title: 'The Coperni Spray-On Dress', text: 'A liquid-fabric dress sprayed live on her body which instantly became the viral fashion milestone of the decade.' }
    ],
    media: [
      { icon: '🎬', type: 'Moment', title: 'Coperni Spray-On Dress — Paris FW 2022', wide: true },
      { icon: '💄', type: 'Brand', title: 'Orebella Fragrance — Sold Out Globally', wide: false }
    ]
  }
];

export const DEFAULT_FEED_ITEMS: FeedItem[] = [
  {
    user: 'sophia.m',
    av: '🌺',
    time: '2h ago',
    arch: 'Old Money',
    score: 8.9,
    emoji: '💼',
    imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Gisele_Bundchen_Versace_1998.jpg?w=600&q=80',
    caption: 'Weekend coastal look. The cashmere was worth every single penny 🤌',
    likes: 47,
    comments: [
      { av: '🌟', user: 'stella.k', text: 'The cashmere texture is impeccable! Quiet luxury gold.', time: '1h ago' },
      { av: '🦋', user: 'mia.fashion', text: 'Grace Kelly would 100% approve of this simplicity.', time: '40m ago' }
    ],
    reactions: { '🔥': 8, '😍': 12, '✦': 6 }
  },
  {
    user: 'marcus.style',
    av: '🦅',
    time: '4h ago',
    arch: 'Streetwear',
    score: 9.2,
    emoji: '👟',
    imgSrc: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
    caption: 'New drop. Entire streetwear fit balanced around this structure. Let me know your score 🔥',
    likes: 134,
    comments: [
      { av: '🎯', user: 'ace.drip', text: '9.2?? Absolute legendary score. The pants fit is perfect.', time: '3h ago' }
    ],
    reactions: { '🔥': 26, '✦': 15 }
  },
  {
    user: 'elena.v',
    av: '🌙',
    time: '6h ago',
    arch: 'Glamour',
    score: 7.8,
    emoji: '👠',
    imgSrc: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    caption: "Date night fit - AI recommended I add a bold statement necklace. What do you think?",
    likes: 89,
    comments: [
      { av: '💄', user: 'glamgurl', text: 'Add that bold gold necklace and it becomes a certified 10!', time: '4h ago' }
    ],
    reactions: { '😍': 14, '😐': 2 }
  }
];

export const CAT_EMOJIS: Record<string, string> = {
  tops: '👕',
  bottoms: '👖',
  dresses: '👗',
  outerwear: '🧥',
  shoes: '👠',
  bags: '👜',
  accessories: '💍'
};

export const DEFAULT_WARDROBE: WardrobeItem[] = [
  { cat: 'outerwear', name: 'Vintage Leather Trench', brand: 'Burberry', price: 850, img: null, worn: true, added: 1716301201000 },
  { cat: 'tops', name: 'Heavy Cotton Tee', brand: 'Uniqlo', price: 29, img: null, worn: false, added: 1716301202000 },
  { cat: 'bottoms', name: 'Selvedge Fitted Denim', brand: 'A.P.C.', price: 190, img: null, worn: true, added: 1716301203000 },
  { cat: 'shoes', name: 'Polished Derby Shoes', brand: 'Prada', price: 690, img: null, worn: false, added: 1716301204000 }
];

export const DEFAULT_FEED = DEFAULT_FEED_ITEMS;
