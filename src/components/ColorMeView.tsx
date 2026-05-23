import React, { useState } from "react";
import { Camera, Image, RefreshCw, Sparkles, Check, Share2 } from "lucide-react";

interface ColorMeViewProps {
  onNavigate: (screen: string) => void;
  addFeedItem: (item: any) => void;
  showToast: (msg: string) => void;
}

export default function ColorMeView({ onNavigate, addFeedItem, showToast }: ColorMeViewProps) {
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        const MAX = 600;
        if (w > MAX || h > MAX) {
          const r = Math.min(MAX/w, MAX/h);
          w = Math.round(w*r); h = Math.round(h*r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setImagePreview(dataUrl);
          setImageB64(dataUrl.split(',')[1]);
          showToast("✓ Face snapshot loaded!");
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const executeColorSeasonAnalysis = async () => {
    if (!imageB64) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/color-season", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageB64, imageMime })
      });
      const data = await res.json();
      setResult(data);
      showToast("🎉 Color Season analyzed!");
    } catch {
      // Fallback representing Soft Autumn
      setResult({
        season: "Soft Autumn",
        summary: "Warm, muted, and earthy values. Your features are highlighted beautifully by sage, olives, roasted rusts, and soft creams.",
        jewelry: "Warm brushed brass & matte gold are your signature metal coordinates. Avoid polished silver.",
        bestColors: [
          { name: "Roasted Rust", hex: "#B76E4B" },
          { name: "Olive branch", hex: "#6F7C56" },
          { name: "Sage sage", hex: "#8DA393" },
          { name: "Rich Sand", hex: "#E3C29E" },
          { name: "Mocha knit", hex: "#7E5C4E" }
        ],
        avoidColors: [
          { name: "Fluorescent Green", hex: "#39FF14" },
          { name: "Cobalt Blue", hex: "#0047AB" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const shareToFeed = () => {
    if (!result) return;
    addFeedItem({
      user: "you",
      av: "🎨",
      time: "Just now",
      arch: result.season,
      score: 9.2,
      emoji: "🎨",
      imgSrc: imagePreview,
      caption: `Just ran my seasonal skin analysis and mapped directly as a ${result.season}! Best jewelry: ${result.jewelry} ✨🎨`,
      likes: 0,
      comments: [],
      reactions: { '😍': 1, '✦': 1 }
    });
    showToast("🌐 Shared Color Season analysis to feed!");
    onNavigate("feed");
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 pb-28">
      {/* Header */}
      <div>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Seasonal Color Analysis</h2>
        <p className="text-xs text-gray-400 mt-1">Discover which palettes match your skin tone undertones</p>
      </div>

      {!result && !loading && (
        <div className="flex flex-col gap-5">
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 bg-white text-center hover:border-[#C87744] transition">
            {imagePreview ? (
              <img src={imagePreview} className="max-h-48 mx-auto rounded-2xl object-cover mb-4" />
            ) : (
              <span className="text-4xl mb-2 inline-block animate-pulse">🧒</span>
            )}
            <h3 className="font-bold text-sm mb-1">Upload Portrait Snapshot</h3>
            <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed mb-6">
              For accuracy, take a well-lit photo of your face, looking straight, under natural daylight (zero filters).
            </p>
            <label className="inline-block px-5 py-3.5 bg-zinc-950 hover:bg-black text-white rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer shadow">
              📸 Take Selfie
              <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          <button
            onClick={executeColorSeasonAnalysis}
            disabled={!imageB64}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 font-black text-black uppercase text-xs tracking-widest rounded-2xl disabled:opacity-40 transition shadow-lg"
          >
            ✦ Analyze Color undertones
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-20 gap-3">
          <RefreshCw className="animate-spin text-yellow-500" size={32} />
          <div className="font-serif italic font-bold text-sm text-[#B8A87E] animate-pulse">Mapping skin undertone values...</div>
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Main Season presentation */}
          <div className="bg-white border border-[#000]/5 p-6 rounded-3xl text-center shadow-md flex flex-col items-center">
            <span className="text-4xl mb-3 animate-pulse">🍂✨</span>
            <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Calculated Archetype Palette</div>
            <h3 className="font-serif text-3xl font-black text-zinc-950 mt-1">{result.season}</h3>
            <p className="text-xs text-zinc-600 leading-relaxed mt-3 max-w-sm">"{result.summary}"</p>
          </div>

          {/* Swatches Grid */}
          <div className="bg-white border border-[#000]/5 p-5 rounded-2xl shadow-sm flex flex-col gap-3">
            <h4 className="text-[10px] font-black uppercase text-[#C87744] tracking-widest mb-1">Your Power Palette Swatches</h4>
            <div className="grid grid-cols-5 gap-3">
              {(result.bestColors || []).map((color: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center text-center gap-1.5 cursor-pointer hover:scale-105 transition">
                  <div 
                    className="w-10 h-10 rounded-full shadow border border-black/10" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-[8px] font-extrabold text-zinc-500 leading-none truncate max-w-full">{color.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Advices and Metallics */}
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
              <h5 className="text-[10px] font-black uppercase text-[#C87744] tracking-widest mb-1.5">💍 Metal Coordinates</h5>
              <p className="text-xs text-zinc-600 leading-relaxed italic">{result.jewelry}</p>
            </div>

            {/* Avoid list */}
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-1.5">
              <h5 className="text-[10px] font-black uppercase text-red-700 tracking-widest mb-1">⚠️ Colors to Sidestep</h5>
              <div className="flex gap-4 items-center mt-1">
                {(result.avoidColors || []).map((color: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                    <span className="text-xs font-bold text-zinc-700">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shares / Reset buttons */}
          <div className="flex flex-col gap-3.5 mt-2">
            <button
              onClick={shareToFeed}
              className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-full shadow hover:bg-emerald-700 transition"
            >
              Post Color Season to Community ➤
            </button>
            <button
              onClick={() => { setResult(null); setImagePreview(null); setImageB64(null); }}
              className="w-full py-3 text-center text-xs font-bold text-zinc-500 hover:text-zinc-800"
            >
              ↺ Reset and Scan Another Face
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
