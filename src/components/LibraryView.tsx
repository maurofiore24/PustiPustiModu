import React, { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { ARCHETYPES } from "../types";

interface LibraryViewProps {
  onNavigate: (screen: string) => void;
  onSelectStyle: (styleId: string) => void;
}

const ARCH_IMGS: Record<string, string> = {
  classic: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Gisele_Bundchen_Versace_1998.jpg?w=600&q=80',
  streetwear: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
  oldmoney: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=600&q=80',
  avantgarde: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Naomi_Campbell_Versace_1994.jpg?w=600&q=80',
  sporty: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  bohemian: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  coquette: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  glamour: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Alexander_McQueen_SS99_Runway.jpg?w=600&q=80',
  darkacademia: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
  y2k: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600&q=80',
};

const DECADES_DATA = [
  { id: '1920s', label: "'20s", name: 'The Roaring Twenties', mood: 'Flappers, freedom, fringe — fashion broke its corset.', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Gisele_Bundchen_Versace_1998.jpg?w=700&q=80', styles: [{ name: 'Flapper', emoji: '✨', icon: 'Coco Chanel', tags: ['Fringe', 'Dropped Waist', 'Pearls'], desc: 'Dropped waistlines, fringe, and ropes of pearls. The flapper rejected Victorian corsetry.', pieces: 'Beaded shift dress · T-strap heels · Finger waves · Cloche hat' }] },
  { id: '1950s', label: "'50s", name: 'The New Look Era', mood: 'Post-war optimism reborn as nipped waists and full skirts.', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=700&q=80', styles: [{ name: 'New Look', emoji: '👗', icon: 'Christian Dior', tags: ['Full Skirt', 'Nipped Waist', 'Gloves'], desc: "Christian Dior's 1947 collection changed everything.", pieces: 'Circle skirt · Fitted bodice · White gloves · Pearl earrings · Kitten heels' }] },
  { id: '1970s', label: "'77", name: 'The Decade of Excess', mood: 'Disco, glam rock, and denim — fashion as performance.', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Alexander_McQueen_SS99_Runway.jpg?w=700&q=80', styles: [{ name: 'Disco', emoji: '🪩', icon: 'Bianca Jagger', tags: ['Sequins', 'Satin', 'Platforms'], desc: 'Studio 54 was the temple; sequins and plunging necklines.', pieces: 'Sequin jumpsuit · Platform shoes · Halter neck · Satin trousers' }] },
  { id: '2010s', label: "'10s", name: 'Instagram Era', mood: 'Athleisure, normcore, and the rise of the influencer.', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Naomi_Campbell_Versace_1994.jpg?w=700&q=80', styles: [{ name: 'Normcore', emoji: '🤍', icon: 'Steve Jobs', tags: ['Basic', 'Clean', 'Minimal'], desc: 'The anti-fashion fashion. Looking unremarkable on purpose.', pieces: 'Plain white tee · Levi\'s 501s · New Balance · Baseball cap' }] },
  { id: '2020s', label: "'20s", name: 'Post-Everything', mood: 'Quiet luxury, mob wife chaos, and the algorithm.', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Alexander_McQueen_SS99_Runway.jpg?w=700&q=80', styles: [{ name: 'Quiet Luxury', emoji: '🤍', icon: 'Gwyneth Paltrow', tags: ['Minimal', 'Expensive', 'No-Logo'], desc: 'The Row and Loro Piana. Impeccable cashmeres, zero branding.', pieces: 'Oatmeal cashmere knit · Wide trousers · Totême loafers · Soft leather tote' }] }
];

const GEO_STYLES = [
  { id: 'italia', flag: '🇮🇹', name: 'Milano / Roma', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80', styles: [{ name: 'Milano Chic', emoji: '🏛️', tags: ['Tailored', 'Luxury', 'Understated'], desc: ' Milan is where tailoring is engineered. No logos, just perfect fabrication.', pieces: 'Tailored blazer · Cigarette trousers · Handcrafted leather loafers' }] },
  { id: 'europa', flag: '🇪🇺', name: 'Paris / London / Copenhagen', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=700&q=80', styles: [{ name: 'Parisian Chic', emoji: '🗼', tags: ['Effortless', 'Classic', 'Breton'], desc: 'A striped marinière, tailored trousers, and ballet flats.', pieces: 'Breton tee · High-waist trousers · Flat pumps · Silk neckerchief' }] },
  { id: 'korea', flag: '🇰🇷', name: 'Seoul Streetwear', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Alexander_McQueen_SS99_Runway.jpg?w=700&q=80', styles: [{ name: 'K-Style Hype', emoji: '⚡', tags: ['Oversized', 'Y2K', 'Hype'], desc: 'The absolute capital of viral aesthetics and micro-trends.', pieces: 'Oversized blazer · Pleated micro mini · Chunky runners · Wire frames' }] }
];

export default function LibraryView({ onNavigate, onSelectStyle }: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<'archetypes' | 'eras'>('archetypes');
  const [activeSubTab, setActiveSubTab] = useState<'decades' | 'geo'>('decades');
  const [activeDetail, setActiveDetail] = useState<any | null>(null);

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 pb-28">
      {/* Header */}
      <div>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Style Library</h2>
        <p className="text-xs text-gray-400 mt-1">Sartorial knowledge spanning decades, regions, and philosophies</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-full">
        <button
          onClick={() => { setActiveTab('archetypes'); setActiveDetail(null); }}
          className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-full transition ${activeTab === 'archetypes' ? 'bg-white text-zinc-950 shadow-sm' : 'text-gray-500'}`}
        >
          ✦ Archetypes
        </button>
        <button
          onClick={() => { setActiveTab('eras'); setActiveDetail(null); }}
          className={`flex-1 py-2.5 text-center text-xs font-semibold rounded-full transition ${activeTab === 'eras' ? 'bg-white text-zinc-950 shadow-sm' : 'text-gray-500'}`}
        >
          🕰️ Eras & Region
        </button>
      </div>

      {activeDetail ? (
        <div className="flex flex-col gap-5 animate-fade-in bg-white border border-[#000]/5 p-6 rounded-3xl shadow-md">
          <button 
            onClick={() => setActiveDetail(null)} 
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 self-start"
          >
            <ArrowLeft size={16} /> Back to List
          </button>

          <div className="relative rounded-2xl overflow-hidden h-40">
            <img src={activeDetail.img} className="w-full h-full object-cover filter brightness-[0.5]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] font-black uppercase text-yellow-500 tracking-widest">{activeDetail.mood ? 'Decade' : 'Regional DNA'}</span>
              <h3 className="font-serif text-2xl font-black text-white">{activeDetail.name}</h3>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {activeDetail.styles.map((s: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <div className="font-serif font-black text-sm text-zinc-800">{s.name}</div>
                    {s.icon && <div className="text-[9px] text-gray-400">Arch-Iconic: {s.icon}</div>}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {s.tags.map((t: string) => (
                    <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded-full uppercase">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed mt-1">{s.desc}</p>
                <div className="text-[10px] text-gray-400 mt-1">
                  <strong className="text-zinc-800 uppercase tracking-wider text-[9px]">Key Pieces:</strong> {s.pieces}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'archetypes' ? (
        <div className="flex flex-col gap-4">
          {ARCHETYPES.map((a) => {
            const img = ARCH_IMGS[a.id];
            return (
              <div 
                key={a.id} 
                onClick={() => {
                  onSelectStyle(a.id);
                  onNavigate('analysis');
                }}
                className="bg-white border border-zinc-200 shadow-sm rounded-3xl overflow-hidden cursor-pointer hover:border-emerald-600 hover:shadow-md transition-all transform hover:-translate-y-1 group flex flex-col"
              >
                <div className="h-32 w-full overflow-hidden relative">
                  <img src={img} className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition duration-300" alt={a.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <span className="text-2xl">{a.emoji}</span>
                    <h3 className="font-serif text-xl font-bold text-white mt-1 leading-none">{a.name}</h3>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col gap-2.5">
                  <p className="text-xs text-gray-600 leading-relaxed">{a.desc}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {a.tags.map((t) => (
                      <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full uppercase border border-zinc-200/50">{t}</span>
                    ))}
                  </div>
                  <div className="text-[10px] font-bold text-[#C87744] hover:underline mt-1">Select and scan outfit in this archetype →</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Sub-tabs */}
          <div className="flex bg-gray-50 border border-zinc-200/50 p-1 rounded-full self-start max-w-xs gap-1">
            <button
              onClick={() => setActiveSubTab('decades')}
              className={`px-4 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-full transition ${activeSubTab === 'decades' ? 'bg-[#1D1D1F] text-white' : 'text-gray-500'}`}
            >
              🕰️ Decades
            </button>
            <button
              onClick={() => setActiveSubTab('geo')}
              className={`px-4 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-full transition ${activeSubTab === 'geo' ? 'bg-[#1D1D1F] text-white' : 'text-gray-500'}`}
            >
              🌍 By Region
            </button>
          </div>

          {activeSubTab === 'decades' ? (
            <div className="flex flex-col gap-3">
              {DECADES_DATA.map(d => (
                <div 
                  key={d.id}
                  onClick={() => setActiveDetail(d)}
                  className="relative rounded-2xl overflow-hidden h-28 cursor-pointer border border-[#000]/10 shadow-sm transition hover:-translate-y-1 transform hover:shadow-md"
                >
                  <img src={d.img} className="w-full h-full object-cover filter brightness-[0.4]" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="text-[10px] font-bold tracking-widest text-[#B8A87E] uppercase">{d.name}</div>
                    <div className="font-serif text-2xl font-black text-white leading-none mt-1">{d.label}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {GEO_STYLES.map(g => (
                <div 
                  key={g.id}
                  onClick={() => setActiveDetail(g)}
                  className="relative rounded-2xl overflow-hidden h-28 cursor-pointer border border-[#000]/10 shadow-sm transition hover:-translate-y-1 transform hover:shadow-md"
                >
                  <img src={g.img} className="w-full h-full object-cover filter brightness-[0.3]" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <span className="text-3xl mb-1">{g.flag}</span>
                    <div className="font-serif text-lg font-black text-white leading-none">{g.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
