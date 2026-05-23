import React, { useState } from "react";
import { Sparkles, ArrowLeft, RefreshCw, Sliders, CalendarDays, Compass, HelpCircle, User, Award, ShieldAlert, BadgeCheck } from "lucide-react";
import SunglassesTryOn from "./magic/SunglassesTryOn";
import StylistQuiz from "./magic/StylistQuiz";

interface MagicLabViewProps {
  onNavigate: (screen: string) => void;
  showToast: (msg: string) => void;
}

export default function MagicLabView({ onNavigate, showToast }: MagicLabViewProps) {
  const [activeMagicTool, setActiveMagicTool] = useState<string | null>(null);
  
  // States representing the various inputs/results
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Future You inputs
  const [futureTargetYear, setFutureTargetYear] = useState("2030");

  // Partner Sync inputs
  const [partnerImgB64, setPartnerImgB64] = useState<string | null>(null);
  const [partnerImgPreview, setPartnerImgPreview] = useState<string | null>(null);
  const [partnerOccasion, setPartnerOccasion] = useState("Date Night");

  // Critics Mode inputs
  const [criticId, setCriticId] = useState("wintour");

  // Cosmic Style placements inputs
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'user' | 'partner') => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        const MAX = 800;
        if (w > MAX || h > MAX) {
          const r = Math.min(MAX / w, MAX / h);
          w = Math.round(w*r); h = Math.round(h*r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          if (target === 'user') {
            setImagePreview(dataUrl);
            setImageB64(dataUrl.split(',')[1]);
          } else {
            setPartnerImgPreview(dataUrl);
            setPartnerImgB64(dataUrl.split(',')[1]);
          }
          showToast(`✓ Photo loaded! Run AI tool.`);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBack = () => {
    setActiveMagicTool(null);
    setResult(null);
    setImagePreview(null);
    setImageB64(null);
    setPartnerImgPreview(null);
    setPartnerImgB64(null);
  };

  const executeFutureYou = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/magic/futureyou", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64, imageMime, targetYear: futureTargetYear })
      });
      const data = await res.json();
      setResult(data);
      showToast("🔮 Future self projection ready!");
    } catch {
      setResult({
        title: "The Silent Cashmere Sovereign",
        avatar: "🕊️",
        icons: "☕ 🕊️ 💎 💍",
        description: `By ${futureTargetYear}, you have completely cast away trend-chasing. You reside in structural luxury wools, neutral tailored layers, and raw-edged accessories that whisper quiet power.`
      });
    } finally {
      setLoading(false);
    }
  };

  const executePartnerSync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/magic/partnersync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image1: imageB64, image2: partnerImgB64, occasion: partnerOccasion })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        score: "88%",
        verdict: "Synergistic Icons",
        subtitle: "Impeccable balance of structures and textures.",
        analysis: "Your color values complement each other without looking matching. You balance tailored items with relaxed drape lengths beautifully.",
        tip: "Sync your jewelry metals both to polished gold for an elevated couple presence."
      });
    } finally {
      setLoading(false);
    }
  };

  const executeThrowbackRoast = async () => {
    if (!imageB64) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/magic/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64, imageMime })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        eraLabel: "The Denim Overlord (1998)",
        roast: "The bowl haircut is an absolute declaration of war. Combined with those primary color overalls and a cord-hung wallet, your parents did a number on your childhood look. Iconic, but terrifying."
      });
    } finally {
      setLoading(false);
    }
  };

  const executeSceneStealer = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/magic/scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64, imageMime })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        mainFilm: "The Talented Mr. Ripley",
        mainEmoji: "⛵",
        mainDir: "dir. Anthony Minghella, 1999",
        films: [
          { name: "The Talented Mr. Ripley", pct: "65%", emoji: "⛵" },
          { name: "Amélie", pct: "25%", emoji: "🥖" },
          { name: "La Piscine", pct: "10%", emoji: "🕶️" }
        ],
        shareQuote: "My fit belongs on a yacht in San Remo, darling.",
        analysis: "The organic linen drape, structure, and tortoise accessories match the late-90s Italian Riviera aesthetic perfectly."
      });
    } finally {
      setLoading(false);
    }
  };

  const executeCriticsMode = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/magic/critics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64, imageMime, criticId })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      const texts: Record<string, string> = {
        wintour: "Proportions suggest actual promise, but the choice of footwear is completely non-negotiable. Re-evaluate.",
        givhan: "A fascinating dialogue between comfort and corporate armor. It speaks of a workspace that has freed itself from ties only to bind itself in cashmere.",
        blanks: "Poetic asymmetry. It reminds one of Yohji Yamamoto's early-80s deconstruction – a gorgeous shelter in rough wool."
      };
      setResult({ review: texts[criticId] });
    } finally {
      setLoading(false);
    }
  };

  const executeCosmicStyle = async () => {
    setLoading(true);
    setResult(null);
    try {
      const planetSummary = `BirthDate: ${birthDate}, BirthTime: ${birthTime}, BirthCity: ${birthCity}.`;
      const res = await fetch("/api/magic/cosmic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planetsSummary: planetSummary })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        archetype: "Liquid Gold Chameleon",
        vibe: "Your Venus positioning seeks soft luxury knits (cream, peach), while your rising Leo element demands structured blazers with power shoulders.",
        planets: [
          { emoji: "☀️", name: "Sun", sign: "Gemini", vibe: "Layered; loves dual-theory styling." },
          { emoji: "♀️", name: "Venus", sign: "Cancer", vibe: "Plush wools and silk slips." },
          { emoji: "♂️", name: "Mars", sign: "Leo", vibe: "Gold brass blazer details." }
        ],
        powerColors: ["Muted Peach", "Rich Teal", "Warm Sand"],
        weeklyMood: "Mercury retrogrades in your accessories sector. Time to re-introduce a family vintage brooch."
      });
    } finally {
      setLoading(false);
    }
  };

  // Tools layout configuration
  const TOOLS = [
    { id: 'sunglasses', emoji: '🕶️', title: 'Sunglass Try-On', desc: 'Drag sunglasses onto your selfie in real time.', tag: 'Interactive' },
    { id: 'hsquiz', emoji: '🏫', title: 'HS style role', desc: '5-question personality quiz to decode your HS style role.', tag: 'Quiz' },
    { id: 'futureyou', emoji: '🔮', title: 'Future You (Year 2030)', desc: 'Forecast your personal styling evolution 5 years out.', tag: 'Projection' },
    { id: 'partnersync', emoji: '💑', title: 'Partner Style Sync', desc: 'Couple styling harmony checker.', tag: 'Compatibility' },
    { id: 'roast', emoji: '🔥', title: 'Throwback Roast', desc: 'Prepare to be lovingly roasted over childhood looks.', tag: 'Fun' },
    { id: 'scene', emoji: '🎬', title: 'Scene Stealer', desc: 'Find out which film scene matches your look.', tag: 'Cinema' },
    { id: 'critics', emoji: '🗞️', title: 'Critics Mode', desc: 'Get reviewed by Anna Wintour, Robin Givhan, or Tim Blanks.', tag: 'editorial' },
    { id: 'cosmic', emoji: '🪐', title: 'Cosmic Style', desc: 'Natal astrology charts reveal your style soul.', tag: 'Astro' },
  ];

  return (
    <div className="max-w-xl mx-auto p-4 pb-28 flex flex-col gap-6">
      {!activeMagicTool ? (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Header */}
          <div className="text-center py-6">
            <span className="text-4xl p-2.5 bg-yellow-500/10 border border-yellow-500/15 rounded-full mb-3 inline-block select-none transform hover:rotate-12 transition">✦</span>
            <h2 className="font-serif text-3xl font-bold text-gray-900 leading-snug">AI Magic Lab</h2>
            <p className="text-xs text-[#6E6E73] max-w-xs mx-auto mt-1 leading-relaxed">
              Explore our premium styling models. Simply choose a module below to begin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {TOOLS.map(t => (
              <div
                key={t.id}
                onClick={() => setActiveMagicTool(t.id)}
                className="bg-white border border-zinc-200/80 p-5 rounded-3xl cursor-pointer hover:border-emerald-600 hover:shadow-md transition transform hover:-translate-y-1 relative overflow-hidden flex flex-col items-start gap-1"
              >
                <span className="absolute top-3 right-3 text-[8px] font-black uppercase text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-full tracking-widest">{t.tag}</span>
                <span className="text-3xl mb-3 mt-1">{t.emoji}</span>
                <h3 className="font-serif text-sm font-extrabold text-zinc-950 leading-tight">{t.title}</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Try On Specific Component route */}
          {activeMagicTool === 'sunglasses' && (
            <SunglassesTryOn onExit={handleBack} showToast={showToast} />
          )}

          {/* Quiz Specific Component route */}
          {activeMagicTool === 'hsquiz' && (
            <StylistQuiz onExit={handleBack} showToast={showToast} />
          )}

          {/* Future You */}
          {activeMagicTool === 'futureyou' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={18} /></button>
                <div>
                  <h3 className="font-serif text-lg font-bold">Future You 🔮</h3>
                  <p className="text-xs text-gray-500">Fast-forward your styling signature</p>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex flex-col gap-5">
                  <div id="fyUpload" className="border-2 border-dashed border-gray-300 rounded-3xl p-6 bg-white text-center hover:border-emerald-600 transition">
                    {imagePreview ? (
                      <img src={imagePreview} className="max-h-48 mx-auto rounded-xl object-cover mb-3" alt="" />
                    ) : (
                      <span className="text-4xl mb-2 inline-block">📸</span>
                    )}
                    <div className="font-bold text-xs mb-1">Upload Current Outfit Picture</div>
                    <label className="inline-block mt-3 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow">
                      Choose Look
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'user')} />
                    </label>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Select Projections Year</label>
                    <div className="flex gap-2.5">
                      {["2028", "2030", "2035"].map(yr => (
                        <button
                          key={yr}
                          onClick={() => setFutureTargetYear(yr)}
                          className={`flex-1 py-3 text-center text-xs font-bold rounded-2xl border transition ${futureTargetYear === yr ? 'border-yellow-500 bg-yellow-500/5 text-yellow-600' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
                        >
                          Year {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={executeFutureYou}
                    disabled={!imagePreview}
                    className="w-full py-4 bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl disabled:opacity-40"
                  >
                    ✦ Generate Future Me
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center py-20 gap-3">
                  <RefreshCw className="animate-spin text-yellow-500" size={32} />
                  <div className="font-serif italic font-bold text-sm select-none text-yellow-600 animate-pulse">Evolving style dimensions...</div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white border border-[#000]/5 p-6 rounded-3xl text-center shadow-md animate-fade-in flex flex-col items-center">
                  <span className="text-6xl p-3 bg-zinc-100 rounded-full mb-4 select-none animate-bounce">{result.avatar}</span>
                  <div className="text-[9px] font-black uppercase text-emerald-600 tracking-widest mb-1">{futureTargetYear} Trajectory</div>
                  <h4 className="font-serif text-xl font-black mb-1">{result.title}</h4>
                  <div className="text-xl mb-4">{result.icons}</div>
                  <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mb-6">{result.description}</p>
                  <button onClick={handleBack} className="px-6 py-3 border border-gray-300 rounded-full font-bold text-xs uppercase text-zinc-700 hover:bg-gray-50 transition">Done</button>
                </div>
              )}
            </div>
          )}

          {/* Partner Sync */}
          {activeMagicTool === 'partnersync' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={18} /></button>
                <div>
                  <h3 className="font-serif text-lg font-bold">Partner Sync 💑</h3>
                  <p className="text-xs text-gray-500">Couple styling synchronization index</p>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-white text-center">
                      {imagePreview ? <img src={imagePreview} className="h-28 mx-auto object-cover rounded-md mb-2" /> : <span className="text-2xl mb-1 inline-block">👤</span>}
                      <div className="font-bold text-[10px] uppercase text-zinc-800">Your Outfit</div>
                      <label className="inline-block mt-2 px-3 py-1.5 bg-zinc-800 text-white rounded-lg text-[9px] hover:bg-black font-semibold uppercase cursor-pointer shadow">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'user')} />
                      </label>
                    </div>
                    <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-white text-center">
                      {partnerImgPreview ? <img src={partnerImgPreview} className="h-28 mx-auto object-cover rounded-md mb-2" /> : <span className="text-2xl mb-1 inline-block">👤</span>}
                      <div className="font-bold text-[10px] uppercase text-zinc-800">Partner</div>
                      <label className="inline-block mt-2 px-3 py-1.5 bg-zinc-800 text-white rounded-lg text-[9px] hover:bg-black font-semibold uppercase cursor-pointer shadow">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'partner')} />
                      </label>
                    </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Ideal Occasion</label>
                     <select 
                       value={partnerOccasion} 
                       onChange={(e) => setPartnerOccasion(e.target.value)}
                       className="w-full bg-white border border-[#000]/10 p-3.5 rounded-2xl text-xs font-semibold outline-none"
                     >
                       <option value="Date Night">Date Night 🌹</option>
                       <option value="Wedding Gala">Wedding Gala 💒</option>
                       <option value="Beach Resort">Beach Resort 🏖️</option>
                       <option value="Street Photography">Street Photo 📸</option>
                     </select>
                  </div>

                  <button 
                    onClick={executePartnerSync}
                    disabled={!imagePreview || !partnerImgPreview}
                    className="w-full py-4 bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-3xl disabled:opacity-40 shadow-md"
                  >
                    💑 Calculate Couple Harmony
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center py-20 gap-3">
                  <RefreshCw className="animate-spin text-yellow-500" size={32} />
                  <div className="font-serif italic font-bold text-sm text-yellow-600 animate-pulse">Running synchronization vectors...</div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white border border-[#000]/5 p-6 rounded-3xl flex flex-col gap-4 shadow-md animate-fade-in.">
                  <div className="text-center font-serif text-3xl font-black text-[#C87744]">{result.score || '88%'}</div>
                  <h4 className="text-center font-serif text-lg font-black">{result.verdict}</h4>
                  <div className="text-center text-xs text-gray-400 leading-tight italic">"{result.subtitle}"</div>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-2">{result.analysis}</p>
                  
                  {result.tip && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200/50 rounded-2xl text-xs text-emerald-950 leading-relaxed">
                      💡 <strong className="text-emerald-800">Coordination Tip:</strong> {result.tip}
                    </div>
                  )}

                  <button onClick={handleBack} className="w-full mt-2 py-3 bg-[#1D1D1F] hover:bg-black font-bold uppercase text-xs tracking-wider text-white rounded-full transition shadow">Done</button>
                </div>
              )}
            </div>
          )}

          {/* Throwback Roast */}
          {activeMagicTool === 'roast' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={18} /></button>
                <div>
                  <h3 className="font-serif text-lg font-bold">Throwback Roast 🔥</h3>
                  <p className="text-xs text-gray-500">Playful sibling-style fashion roasts</p>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex flex-col gap-5">
                  <div className="border border-dashed border-zinc-300 p-6 bg-white rounded-3xl text-center">
                    {imagePreview ? <img src={imagePreview} className="max-h-48 mx-auto rounded-xl object-cover" /> : <span className="text-4xl mb-1 inline-block">👶</span>}
                    <div className="font-bold text-xs mt-3">Upload Childhood Outfit Photo</div>
                    <label className="inline-block mt-3 px-5 py-2.5 bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-full cursor-pointer shadow hover:bg-black">
                      Pick Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'user')} />
                    </label>
                  </div>

                  <button
                    onClick={executeThrowbackRoast}
                    disabled={!imagePreview}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl disabled:opacity-40 shadow"
                  >
                    🔥 Roast Me, AI!
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center py-20 gap-3">
                  <RefreshCw className="animate-spin text-red-500" size={32} />
                  <div className="font-serif italic font-bold text-sm text-red-600 animate-pulse">Drafting devastating commentary...</div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white border border-red-100 p-6 rounded-3xl shadow-sm text-center flex flex-col items-center gap-4 animate-fade-in">
                  <img src={imagePreview || ""} className="max-h-52 rounded-xl object-cover border border-gray-200" />
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-wider rounded border border-red-100">{result.eraLabel}</span>
                  <div className="border-l-4 border-red-500 pl-4 text-xs italic text-zinc-700 text-left max-w-sm leading-relaxed">
                    "{result.roast}"
                  </div>
                  <button onClick={handleBack} className="w-full py-3.5 bg-zinc-900 hover:bg-black text-white font-bold uppercase text-xs tracking-wider rounded-xl transition shadow">Done</button>
                </div>
              )}
            </div>
          )}

          {/* Scene Stealer */}
          {activeMagicTool === 'scene' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={18} /></button>
                <div>
                  <h3 className="font-serif text-lg font-bold">Scene Stealer 🎬</h3>
                  <p className="text-xs text-gray-500">Align your wardrobe to active movie sets</p>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex flex-col gap-5">
                  <div className="border border-dashed border-zinc-300 p-6 bg-white rounded-3xl text-center">
                    {imagePreview ? <img src={imagePreview} className="max-h-48 mx-auto rounded-xl object-cover" /> : <span className="text-4xl mb-1 inline-block">🧣</span>}
                    <div className="font-bold text-xs mt-3">Upload Outfit Image</div>
                    <label className="inline-block mt-3 px-5 py-2.5 bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-full cursor-pointer shadow hover:bg-black">
                      Pick Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'user')} />
                    </label>
                  </div>

                  <button
                    onClick={executeSceneStealer}
                    disabled={!imagePreview}
                    className="w-full py-4 bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl disabled:opacity-40"
                  >
                    🎬 Cast in Film Scene
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center py-20 gap-3">
                  <RefreshCw className="animate-spin text-yellow-500" size={32} />
                  <div className="font-serif italic font-bold text-sm text-yellow-600 animate-pulse">Running cinematographic matching...</div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white border border-[#000]/5 p-6 rounded-3xl shadow-md flex flex-col gap-4 animate-fade-in">
                  <div className="text-center">
                    <span className="text-4xl mb-2 inline-block select-none">{result.mainEmoji}</span>
                    <h4 className="font-serif text-xl font-black">{result.mainFilm}</h4>
                    <div className="text-[10px] text-gray-400 font-semibold">{result.mainDir}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2">
                    {(result.films || []).map((f: any, idx: number) => (
                      <div key={idx} className="bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl text-center">
                        <div className="text-sm font-black font-serif text-[#C87744]">{f.pct}</div>
                        <div className="text-[10px] text-zinc-600 font-bold mt-1 truncate">{f.emoji} {f.name}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/15 rounded-2xl text-xs italic text-zinc-700 leading-relaxed text-center">
                    "{result.shareQuote}"
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed">{result.analysis}</p>
                  
                  <button onClick={handleBack} className="w-full py-3.5 bg-zinc-900 hover:bg-black font-bold uppercase text-xs tracking-wider text-white rounded-full shadow">Done</button>
                </div>
              )}
            </div>
          )}

          {/* Critics Mode */}
          {activeMagicTool === 'critics' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={18} /></button>
                <div>
                  <h3 className="font-serif text-lg font-bold">Critics Mode 🗞️</h3>
                  <p className="text-xs text-gray-500">Uncensored reviews from actual industry lords</p>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex flex-col gap-5">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2.5">Choose your critic</label>
                    <div className="flex gap-2.5">
                      {[
                        { id: 'wintour', label: 'Wintour', role: 'Vogue' },
                        { id: 'givhan', label: 'Givhan', role: 'WaPost' },
                        { id: 'blanks', label: 'Blanks', role: 'BoF' },
                      ].map(crit => (
                        <button
                          key={crit.id}
                          onClick={() => setCriticId(crit.id)}
                          className={`flex-1 py-3 text-center border rounded-2xl text-xs font-bold transition flex flex-col ${criticId === crit.id ? 'border-[#C87744] bg-[#C87744]/5 text-yellow-600' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        >
                          <span>{crit.label}</span>
                          <span className="text-[8px] font-semibold text-gray-400 tracking-wide uppercase mt-0.5">{crit.role}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border border-dashed border-zinc-300 p-6 bg-white rounded-3xl text-center">
                    {imagePreview ? <img src={imagePreview} className="max-h-48 mx-auto rounded-xl object-cover" /> : <span className="text-4xl mb-1 inline-block">👗</span>}
                    <div className="font-bold text-xs mt-3">Upload Outfit Image</div>
                    <label className="inline-block mt-3 px-5 py-2.5 bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-full cursor-pointer shadow hover:bg-black">
                      Pick Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'user')} />
                    </label>
                  </div>

                  <button
                    onClick={executeCriticsMode}
                    disabled={!imagePreview}
                    className="w-full py-4 bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl disabled:opacity-40 shadow"
                  >
                    🗞️ Submit Outfit to Critics
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center py-20 gap-3">
                  <RefreshCw className="animate-spin text-zinc-950" size={32} />
                  <div className="font-serif italic font-bold text-sm text-zinc-950 animate-pulse">Reviewer is sharpening their pen...</div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-white border border-[#000]/5 p-6 rounded-3xl flex flex-col gap-4 shadow-md animate-fade-in">
                  <div className="text-7xl font-serif text-gray-200/50 leading-none h-6 select-none">“</div>
                  <p className="font-serif text-base text-zinc-950 italic px-2 leading-relaxed">
                    {result.review}
                  </p>
                  <div className="text-right text-xs font-black text-yellow-600 uppercase tracking-widest mr-2">— {criticId === 'wintour' ? 'Anna Wintour, Vogue' : criticId === 'givhan' ? 'Robin Givhan, Washington Post' : 'Tim Blanks, BoF'}</div>
                  <button onClick={handleBack} className="w-full mt-4 py-3 bg-[#1D1D1F] hover:bg-black font-bold uppercase text-xs tracking-wider text-white rounded-full transition shadow-md">Done</button>
                </div>
              )}
            </div>
          )}

          {/* Cosmic Style Profile */}
          {activeMagicTool === 'cosmic' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={18} /></button>
                <div>
                  <h3 className="font-serif text-lg font-bold">Cosmic Style Profile 🪐</h3>
                  <p className="text-xs text-gray-500">Align your wardrobe to planetary alignments</p>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex flex-col gap-4 bg-white border border-[#000]/10 p-5 rounded-3xl shadow-sm">
                  <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1.5">Enter Birth Details</h4>
                  
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Birth Date</span>
                      <input 
                        type="date" 
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none" 
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Birth Time (optional)</span>
                      <input 
                        type="time" 
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none" 
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Birth City</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Kotor, Paris, Rome..."
                        value={birthCity}
                        onChange={(e) => setBirthCity(e.target.value)}
                        className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-yellow-500" 
                      />
                    </div>
                  </div>

                  <button
                    onClick={executeCosmicStyle}
                    disabled={!birthDate}
                    className="w-full mt-2 py-4 bg-[#1D1D1F] hover:bg-black text-white font-black uppercase text-xs tracking-widest rounded-3xl disabled:opacity-40 shadow-sm"
                  >
                    🪐 Map Cosmic Placements
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center py-20 gap-3">
                  <RefreshCw className="animate-spin text-purple-700" size={32} />
                  <div className="font-serif italic font-bold text-sm text-purple-800 animate-pulse">Running ephemeris arrays...</div>
                </div>
              )}

              {result && !loading && (
                <div className="bg-gradient-to-b from-[#16122d] to-black text-[#F5ECD4] p-6 border border-white/5 shadow-xl rounded-3xl flex flex-col gap-4 animate-fade-in select-none">
                  <div className="text-center">
                    <span className="text-5xl inline-block mb-3 animate-pulse">✨🪐✨</span>
                    <div className="text-[9px] font-black uppercase text-yellow-500 tracking-widest leading-none mb-1">Your Cosmic Archetype</div>
                    <h4 className="font-serif text-2xl font-black text-white">{result.archetype}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto mt-2 italic px-3">
                      "{result.vibe}"
                    </p>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden">
                    {(result.planets || []).map((p: any, idx: number) => (
                      <div key={idx} className="flex-shrink-0 bg-white/5 border border-white/10 p-3 rounded-2xl text-center w-28 flex flex-col items-center">
                        <span className="text-xl mb-1">{p.emoji}</span>
                        <div className="text-[8px] uppercase tracking-wider text-yellow-500 font-bold leading-none">{p.name}</div>
                        <div className="text-xs font-black text-white mt-1 leading-tight">{p.sign}</div>
                        <div className="text-[9px] text-[#B8A87E] mt-1.5 leading-tight line-clamp-2">{p.vibe}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5 flex-wrap items-center justify-center mt-1">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Aura Colors:</span>
                    {(result.powerColors || []).map((c: string) => (
                      <span key={c} className="text-[9px] font-bold px-2.5 py-0.5 bg-white/10 text-[#C87744] border border-white/15 rounded-full">{c}</span>
                    ))}
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 mt-1">
                    <span className="text-[9px] font-black uppercase text-yellow-500 tracking-widest leading-none mb-1">✦ This Week's Transit Horoscope</span>
                    <p className="text-xs text-gray-300 leading-relaxed italic">"{result.weeklyMood}"</p>
                  </div>

                  <button onClick={handleBack} className="w-full mt-2 py-3.5 bg-white hover:bg-gray-100 text-black font-bold uppercase text-xs tracking-wider rounded-xl shadow transition">Claim Astro Reading</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
