import React, { useState, useEffect, useRef } from "react";
import { Search, Send, ArrowLeft, RefreshCw, Star } from "lucide-react";
import { Legend, LEGENDS } from "../types";

interface LegendsViewProps {
  onNavigate: (screen: string) => void;
  showToast: (msg: string) => void;
  activeLegendId: string | null;
  setActiveLegendId: (id: string | null) => void;
}

const LEGEND_PHOTOS: Record<string, string> = {
  audrey: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Audrey_Hepburn_in_Roman_Holiday_trailer.jpg/400px-Audrey_Hepburn_in_Roman_Holiday_trailer.jpg',
  virgil: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Virgil_Abloh_at_the_April_2019_Met_Gala.jpg/400px-Virgil_Abloh_at_the_April_2019_Met_Gala.jpg',
  gisele: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Gisele_B%C3%BCndchen_2010.jpg/400px-Gisele_B%C3%BCndchen_2010.jpg',
  coco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Coco_Chanel_%281920%29.jpg/400px-Coco_Chanel_%281920%29.jpg',
  naomi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Naomi_Campbell_Cannes_2023.jpg/400px-Naomi_Campbell_Cannes_2023.jpg',
  mcqueen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Alexander_McQueen_at_the_2009_Metropolitan_Museum_of_Art%27s_Costume_Institute_Gala.jpg/400px-Alexander_McQueen_at_the_2009_Metropolitan_Museum_of_Art%27s_Costume_Institute_Gala.jpg',
  gracekelly: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Grace_Kelly_MGM_photo.jpg/400px-Grace_Kelly_MGM_photo.jpg',
  ysl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Yves_Saint_Laurent_1972.jpg/400px-Yves_Saint_Laurent_1972.jpg',
  katemoss: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kate_Moss_Cannes_2023.jpg/400px-Kate_Moss_Cannes_2023.jpg',
  karllagerfeld: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Karl_Lagerfeld_-_Front_Row_Chanel_FW2015_2015_%28cropped%29.jpg/400px-Karl_Lagerfeld_-_Front_Row_Chanel_FW2015_2015_%28cropped%29.jpg',
  reikawakubo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Rei_Kawakubo_2012.jpg/400px-Rei_Kawakubo_2012.jpg',
  kendall: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kendall_Jenner_2019_cropped.jpg/400px-Kendall_Jenner_2019_cropped.jpg',
  gigi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Gigi_Hadid_2018.jpg/400px-Gigi_Hadid_2018.jpg',
  anok: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Anok_Yai_2022_%28cropped%29.jpg/400px-Anok_Yai_2022_%28cropped%29.jpg',
  kaia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Kaia_Gerber_2019_%28cropped%29.jpg/400px-Kaia_Gerber_2019_%28cropped%29.jpg',
  asaprocky: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/ASAP_Rocky_2019_%28cropped%29.jpg/400px-ASAP_Rocky_2019_%28cropped%29.jpg',
  wisdomkaye: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=90',
  sunnideparis: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=90',
  jordan: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&q=90',
  lucky: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=90'
};

const LEGEND_BG_PHOTOS: Record<string, string> = {
  audrey: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=900&q=80',
  virgil: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80',
  gisele: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80',
  coco: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=900&q=80',
  naomi: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Alexander_McQueen_SS99_Runway.jpg?w=900&q=80',
  mcqueen: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Naomi_Campbell_Versace_1994.jpg?w=900&q=80'
};

export default function LegendsView({ onNavigate, showToast, activeLegendId, setActiveLegendId }: LegendsViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'model' | 'designer'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'chat' | 'bio' | 'media'>('chat');
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const legend = LEGENDS.find(l => l.id === activeLegendId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  const selectLegend = (id: string | null) => {
    setActiveLegendId(id);
    setChatHistory([]);
    setActiveTab('chat');
  };

  const handleSendChat = async (msgOverride?: string) => {
    const textToSend = msgOverride || chatInput.trim();
    if (!textToSend || !legend) return;

    if (!msgOverride) setChatInput("");
    
    const userTurn = { role: 'user' as const, content: textToSend };
    setChatHistory(prev => [...prev, userTurn]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legendId: legend.id,
          legendName: legend.name,
          legendTitle: legend.title,
          legendEra: legend.era,
          message: textToSend,
          history: chatHistory
        })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.text || "Pardon, chérie, sometimes my line drops." }]);
    } catch {
      // Fallback response matching tone
      setChatHistory(prev => [...prev, { role: 'assistant', content: `Darling, I absolutely hear you. Style requires standard patience and persistent craft, but standard connection fails. Ask me again.` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const filteredLegends = LEGENDS.filter(l => {
    const matchesType = filterType === 'all' || l.type === filterType;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col max-w-xl mx-auto p-4 pb-28 gap-6">
      {!legend ? (
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Meet the Legends</h2>
            <p className="text-xs text-gray-400 mt-1">Explore, chat, and learn from history's most iconic fashion innovators</p>
          </div>

          {/* Search / Filter */}
          <div className="flex bg-white border border-[#000]/10 rounded-2xl p-1 shadow-sm gap-2">
            <input 
              type="text"
              placeholder="Search legends, tags, or eras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 text-xs outline-none bg-transparent"
            />
            <button className="p-3 bg-[#1D1D1F] hover:bg-black text-white rounded-xl transition flex items-center justify-center shadow">
              <Search size={14} />
            </button>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-full self-start">
            <button
              onClick={() => setFilterType('all')}
              className={`px-5 py-2 text-center text-xs font-semibold rounded-full transition ${filterType === 'all' ? 'bg-[#1D1D1F] text-white shadow-sm' : 'text-gray-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('model')}
              className={`px-5 py-2 text-center text-xs font-semibold rounded-full transition ${filterType === 'model' ? 'bg-[#1D1D1F] text-white shadow-sm' : 'text-gray-500'}`}
            >
              Models
            </button>
            <button
              onClick={() => setFilterType('designer')}
              className={`px-5 py-2 text-center text-xs font-semibold rounded-full transition ${filterType === 'designer' ? 'bg-[#1D1D1F] text-white shadow-sm' : 'text-gray-500'}`}
            >
              Designers
            </button>
          </div>

          {/* Legends Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredLegends.map((l) => {
              const photo = LEGEND_PHOTOS[l.id];
              return (
                <div 
                  key={l.id} 
                  onClick={() => selectLegend(l.id)}
                  className="bg-white border border-zinc-200 shadow-sm rounded-3xl overflow-hidden cursor-pointer hover:border-[#C87744] hover:shadow-md transition-all transform hover:-translate-y-1 group flex flex-col"
                >
                  <div className="h-40 w-full overflow-hidden relative bg-black">
                    <img src={photo || ""} className="w-full h-full object-cover object-top filter brightness-[0.8] group-hover:scale-105 transition duration-300" alt={l.name} />
                    <span className="absolute top-2 right-2 text-[8px] font-black uppercase px-2 py-0.5 bg-black/60 text-white backdrop-blur-md rounded-full tracking-widest">{l.type}</span>
                  </div>
                  <div className="p-4 flex flex-col flex-1 gap-1">
                    <h3 className="font-serif text-base font-bold text-zinc-950 leading-tight flex items-center gap-1">
                      {l.name} {l.id === 'bella' && <Star size={11} className="text-yellow-500 fill-current animate-spin" style={{ animationDuration: '3s' }} />}
                    </h3>
                    <div className="text-[10px] text-gray-400">{l.era}</div>
                    <div className="text-[10px] text-zinc-500 leading-tight mt-1 line-clamp-2">{l.title}</div>
                    <div className="flex gap-1 flex-wrap mt-2">
                      {l.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[8px] font-black px-1.5 py-0.5 bg-yellow-500/10 text-yellow-600 rounded uppercase tracking-wider">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Detailed profile viewer */}
          <div className="relative rounded-3xl overflow-hidden min-h-[160px] flex flex-col justify-end p-5 text-white shadow-lg border border-white/5 bg-zinc-950">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity filter saturate-50 scale-105"
              style={{ backgroundImage: `url('${LEGEND_BG_PHOTOS[legend.id] || LEGEND_PHOTOS[legend.id]}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1814] via-black/35 to-transparent" />
            
            <button 
              onClick={() => selectLegend(null)}
              className="absolute top-4 left-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white text-xs font-bold transition backdrop-blur-md flex items-center gap-1 border border-white/10"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
              <span className="text-5xl p-2.5 bg-yellow-500/10 border border-yellow-500/15 rounded-full mb-3 shadow select-none animate-pulse">{legend.emoji}</span>
              <h3 className="font-serif text-2xl font-black">{legend.name}</h3>
              <div className="text-xs text-yellow-500 font-semibold uppercase tracking-widest mt-1">{legend.title}</div>
              <div className="text-[10px] text-gray-400 mt-1">{legend.era} · {legend.type.toUpperCase()}</div>
            </div>
          </div>

          {/* Nav Tab rows */}
          <div className="flex bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-full transition ${activeTab === 'chat' ? 'bg-zinc-950 text-white shadow-sm' : 'text-gray-500'}`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('bio')}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-full transition ${activeTab === 'bio' ? 'bg-zinc-950 text-white shadow-sm' : 'text-gray-500'}`}
            >
              📖 Biography
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-full transition ${activeTab === 'media' ? 'bg-zinc-950 text-white shadow-sm' : 'text-gray-500'}`}
            >
              🎬 Media
            </button>
          </div>

          {activeTab === 'chat' && (
            <div className="flex flex-col gap-4">
              {/* Intro Block */}
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl text-xs italic text-zinc-700 dark:text-[#B8A87E] leading-relaxed">
                "{legend.intro}"
              </div>

              {/* Chat Terminal Box */}
              <div className="bg-white border border-[#000]/10 rounded-2xl h-80 overflow-y-auto p-4 flex flex-col gap-3 shadow-inner scrollbar-hidden">
                {chatHistory.length === 0 && (
                  <div className="text-center italic text-gray-400 text-xs my-auto">
                    Say hello! Ask me anything about my fashion journey, style legacy, or matching pieces.
                  </div>
                )}
                {chatHistory.map((turn, tIdx) => (
                  <div 
                    key={tIdx} 
                    className={`flex gap-2.5 items-start ${turn.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="text-lg p-1 bg-zinc-100 rounded-full select-none">{turn.role === 'user' ? '⭐' : legend.emoji}</span>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${turn.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-zinc-100 text-zinc-800 rounded-tl-none'}`}>
                      {turn.content}
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex gap-2.5 items-start">
                    <span className="text-lg p-1 bg-zinc-100 rounded-full select-none">{legend.emoji}</span>
                    <div className="p-3 bg-zinc-100 text-zinc-400 rounded-2xl rounded-tl-none text-xs flex gap-1 items-center animate-pulse">
                      <RefreshCw size={12} className="animate-spin" /> {legend.name} is thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              {chatHistory.length === 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden select-none">
                  {legend.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSendChat(s)}
                      className="flex-shrink-0 px-3 py-2 bg-white border border-gray-200 hover:border-[#C87744] hover:bg-[#C87744]/5 text-[10px] font-bold text-zinc-700 uppercase rounded-full transition"
                    >
                      ✦ {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input */}
              <div className="flex bg-white border border-[#000]/10 rounded-full p-1 shadow-sm gap-2">
                <input 
                  type="text"
                  placeholder={`Message ${legend.name}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                  className="flex-1 px-4 text-xs outline-none bg-transparent"
                />
                <button 
                  onClick={() => handleSendChat()}
                  className="p-3 bg-[#1D1D1F] hover:bg-black text-white rounded-full transition flex items-center justify-center shadow"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="grid grid-cols-3 gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                {Object.entries(legend.stats).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-xl font-bold font-serif text-yellow-600">{v}</div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">{k}</div>
                  </div>
                ))}
              </div>

              <div className="border-l-2 border-[#C87744] pl-4 font-serif text-lg text-emerald-950 dark:text-[#EFE7D2] italic font-medium leading-relaxed my-2">
                "{legend.quote}"
              </div>

              <div className="flex flex-col gap-4">
                {legend.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative">
                    <div className="h-10 w-10 shrink-0 font-serif text-xs font-black bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-md">
                      {item.year}
                    </div>
                    <div className="flex-1 pt-1.5 border-b border-gray-100 pb-4">
                      <h4 className="font-bold text-xs text-zinc-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Curated Resources</h3>
              
              <div className="flex flex-col gap-2.5">
                {legend.media.map((m, idx) => {
                  const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(legend.name + ' ' + m.title);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => window.open(searchUrl, '_blank')}
                      className="p-4 bg-white border border-[#000]/5 rounded-2xl flex items-center gap-3.5 shadow-sm hover:border-yellow-500 hover:shadow-md cursor-pointer transition transform hover:-translate-y-0.5"
                    >
                      <span className="text-2xl p-2 bg-yellow-500/10 rounded-xl">{m.icon}</span>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase font-bold text-yellow-600 tracking-wider mb-0.5">{m.type}</div>
                        <div className="text-xs font-bold text-zinc-950 leading-snug">{m.title}</div>
                      </div>
                      <span className="text-zinc-400 font-bold text-sm">↗</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
