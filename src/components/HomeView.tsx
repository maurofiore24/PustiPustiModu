import React from "react";
import { Camera, Gamepad2, Sparkles, Sliders, ChevronRight } from "lucide-react";
import { Archetype, ARCHETYPES } from "../types";

interface HomeViewProps {
  onNavigate: (screen: string) => void;
  onSelectStyle: (styleId: string) => void;
  onLaunchGame: (archId: string, name: string, emoji: string) => void;
  recentLooks: { style: string; emoji: string; score: number; date: string }[];
  legends: any[];
  onOpenLegend: (legendId: string) => void;
}

const ARCH_IMAGES: Record<string, string> = {
  classic: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Gisele_Bundchen_Versace_1998.jpg?w=300&q=85',
  streetwear: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&q=85',
  oldmoney: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=300&q=85',
  avantgarde: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Naomi_Campbell_Versace_1994.jpg?w=300&q=85',
  sporty: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=85',
  bohemian: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=85',
  coquette: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=85',
  glamour: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Alexander_McQueen_SS99_Runway.jpg?w=300&q=85',
  darkacademia: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=85',
  y2k: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=300&q=85',
};

const INSPO = [
  { img: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Gisele_Bundchen_Versace_1998.jpg?w=400&q=80', arch: 'Old Money', label: 'Coastal Quiet Luxury', score: '9.1' },
  { img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80', arch: 'Streetwear', label: 'Clean Monochrome Drop', score: '8.7' },
  { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', arch: 'Glamour', label: 'Evening Statement Suit', score: '9.4' },
];

export default function HomeView({ onNavigate, onSelectStyle, onLaunchGame, recentLooks, legends, onOpenLegend }: HomeViewProps) {
  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto p-4 pb-28">
      {/* Hero Banner with organic luxury / deep metallic overlay */}
      <div className="relative bg-zinc-950 text-white rounded-3xl p-7 flex flex-col gap-3 overflow-hidden shadow-xl border border-white/5 min-h-[220px]">
        {/* Background photo placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter saturate-50 scale-105"
          style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=800&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111115]/40 via-[#0c0c0e]/85 to-[#08080a]" />

        <div className="relative z-10 flex flex-col items-start gap-4">
          <span className="px-3 py-1 bg-yellow-500/15 border border-yellow-500/25 rounded-full text-[10px] font-black tracking-widest text-[#B8A87E]/90 uppercase flex items-center gap-1">
            <Sparkles size={11} /> AI-Powered Fashion Hub
          </span>
          <h1 className="font-serif text-3xl font-bold leading-[1.05] tracking-tight text-white">
            Dress Like <br />
            <span className="text-yellow-500 italic">A Legend.</span>
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
            Upload your outfit and get evaluated by professional styling grids, chat with fashion legends, and explore curated seasonal aesthetics.
          </p>

          <div className="flex gap-2.5 w-full mt-2">
            <button 
              onClick={() => onNavigate('analysis')}
              className="flex-1 py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full font-bold text-xs uppercase tracking-wider transition transform active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
            >
              <Camera size={14} /> Score Outfit
            </button>
            <button 
              onClick={() => onLaunchGame('classic', 'Clean Girl', '🤍')}
              className="py-3 px-5 bg-white/10 hover:bg-white/15 text-white rounded-full font-bold text-xs uppercase tracking-wider transition border border-white/15 flex items-center justify-center gap-1.5"
            >
              <Gamepad2 size={14} /> F-Tetris
            </button>
          </div>
        </div>
      </div>

      {/* Trending line ticker */}
      <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl overflow-hidden shadow-sm">
        <span className="text-[10px] uppercase font-black text-yellow-500 tracking-widest flex-shrink-0">🔥 Trending</span>
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hidden items-center select-none text-xs w-full text-zinc-800 dark:text-[#F5ECD4]">
          <span onClick={() => onNavigate('feed')} className="px-2.5 py-1 bg-black/5 hover:bg-emerald-500 hover:text-white rounded-full transition cursor-pointer white-space-nowrap">Quiet Luxury</span>
          <span className="text-gray-400 font-mono text-[9px]">•</span>
          <span onClick={() => onOpenLegend('bella')} className="px-2.5 py-1 bg-black/5 hover:bg-emerald-500 hover:text-white rounded-full transition cursor-pointer">Hadid Style</span>
          <span className="text-gray-400 font-mono text-[9px]">•</span>
          <span onClick={() => onNavigate('colorme')} className="px-2.5 py-1 bg-black/5 hover:bg-emerald-500 hover:text-white rounded-full transition cursor-pointer">Color seasons</span>
        </div>
      </div>

      {/* Style Archetypes scrolling row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Style Archetypes</h2>
          <button onClick={() => onNavigate('library')} className="text-xs text-[#B8A87E] font-semibold hover:text-[#C87744] flex items-center gap-0.5">
            View All <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hidden">
          {ARCHETYPES.map((a) => (
            <div 
              key={a.id} 
              onClick={() => {
                onSelectStyle(a.id);
                onNavigate('analysis');
              }}
              className="flex-shrink-0 w-24 border border-zinc-200/80 rounded-2xl bg-white shadow-sm overflow-hidden cursor-pointer hover:border-[#C87744] transition-all transform hover:-translate-y-1"
            >
              <img 
                src={ARCH_IMAGES[a.id]} 
                alt={a.name} 
                className="w-full h-24 object-cover filter brightness-[0.9] hover:brightness-100 transition" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="text-[10px] font-black text-[#1D1D1F] text-center py-2.5 border-t border-zinc-100 uppercase tracking-wider">{a.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Stats display column */}
      <div className="grid grid-cols-3 gap-3 bg-white border border-[#000]/5 p-4 rounded-2xl shadow-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#1D1D1F] font-serif">14.6K</div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Looks Scored</div>
        </div>
        <div className="text-center border-x border-[#000]/5">
          <div className="text-2xl font-bold text-emerald-600 font-serif">16</div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Global Legends</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500 font-serif">10</div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Archetypes</div>
        </div>
      </div>

      {/* Daily Inspiration gallery */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Daily Inspiration</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hidden">
          {INSPO.map((c, i) => (
            <div 
              key={i}
              onClick={() => onNavigate('analysis')}
              className="flex-shrink-0 w-36 bg-white border border-[#000]/5 rounded-2xl shadow-md overflow-hidden relative cursor-pointer group"
            >
              <img 
                src={c.img} 
                alt={c.label} 
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-2 right-2 bg-yellow-500/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold rounded-lg text-black">{c.score}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">{c.arch}</span>
                <span className="text-[11px] font-semibold text-white leading-tight mt-0.5">{c.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Strip */}
      <div 
        onClick={() => onNavigate('challenge')}
        className="bg-[#111115] text-white p-5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:bg-black transition relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial-at-tr from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <span className="text-3xl">🏆</span>
          <div>
            <h3 className="font-serif text-sm font-bold text-white mb-0.5">Style Challenge — Live Now</h3>
            <p className="text-[10px] text-gray-400">"Channel Naomi Campbell in the 90s" · Enter to earn elite badges</p>
          </div>
        </div>
        <span className="text-yellow-500 font-bold text-lg pointer-events-none">→</span>
      </div>

      {/* Legends Teaser scroll */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Meet the Legends</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hidden">
          {legends.map((l) => (
            <div 
              key={l.id}
              onClick={() => onOpenLegend(l.id)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer hover:scale-[1.03] transition group"
            >
              <div className="w-16 h-16 rounded-full bg-[#1D1D1F]/5 group-hover:border-[#C87744] hover:shadow-lg border-2 border-zinc-200 flex items-center justify-center text-3xl select-none">
                {l.emoji}
              </div>
              <span className="text-[10px] font-bold text-zinc-800 text-center leading-tight truncate w-16">{l.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Looks lists */}
      {recentLooks.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">My Recent Looks</h2>
          <div className="flex flex-col gap-2">
            {recentLooks.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white border border-[#000]/5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">{r.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-zinc-950">{r.style} Evaluation</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{r.date}</div>
                  </div>
                </div>
                <div className="h-10 w-10 text-xs font-black bg-yellow-500 text-[#1D1D1F] border border-yellow-400 rounded-full flex items-center justify-center font-serif shadow-sm">
                  {r.score.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
