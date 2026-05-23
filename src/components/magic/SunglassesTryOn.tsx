import React, { useState, useEffect, useRef } from "react";
import { Camera, RefreshCw, Sliders, ShieldAlert, ArrowLeft } from "lucide-react";

interface SunglassesTryOnProps {
  onExit: () => void;
  showToast: (msg: string) => void;
}

interface Frame {
  id: string;
  name: string;
  brand: string;
  color: string;
  path: string;
}

const FRAMES: Frame[] = [
  { id: 'aviator', name: 'Aviator Gold', brand: 'Classic Milan Style', color: '#B8922A', path: 'M30 18 Q32 8 57 10 Q80 12 82 27 Q84 42 60 46 Q36 48 30 35 Z M170 18 Q168 8 143 10 Q120 12 118 27 Q116 42 140 46 Q164 48 170 35 Z' },
  { id: 'wayfarer', name: 'Retro Block', brand: 'YSL Rocker Vibe', color: '#111111', path: 'M 20 10 L 80 10 L 76 38 L 24 38 Z M 120 10 L 180 10 L 176 38 L 124 38 Z' },
  { id: 'cateye', name: 'Cat-Eye Bold', brand: '60s Hollywood Glam', color: '#C87744', path: 'M26 33 Q28 10 58 8 Q82 6 84 27 Q86 44 60 47 Q34 48 26 33 Z M174 33 Q172 10 142 8 Q118 6 116 27 Q114 44 140 47 Q166 48 174 33 Z' },
  { id: 'oversized', name: 'Mob Wife Black', brand: 'Peak Italian Drama', color: '#1B130E', path: 'M 15 5 L 85 5 L 80 48 L 20 48 Z M 115 5 L 185 5 L 180 48 L 120 48 Z' }
];

export default function SunglassesTryOn({ onExit, showToast }: SunglassesTryOnProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(120);
  const [size, setSize] = useState(120);
  const [tilt, setTilt] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const glassesPos = useRef({ x: 80, y: 100 });

  const activeFrame = FRAMES[selectedFrame];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setImageSrc(ev.target.result as string);
        showToast("✓ Photo loaded! Drag and adjust glasses.");
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const aspect = img.height / img.width;
      const displayW = containerRef.current?.clientWidth || 340;
      const displayH = displayW * aspect;

      canvas.width = displayW;
      canvas.height = displayH;
      ctx.drawImage(img, 0, 0, displayW, displayH);

      // Default positioning
      setPosX(displayW / 2 - size / 2);
      setPosY(displayH * 0.35);
      glassesPos.current = { x: displayW / 2 - size / 2, y: displayH * 0.35 };
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Touch and mouse dragging logic
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    const newX = glassesPos.current.x + dx;
    const newY = glassesPos.current.y + dy;

    setPosX(newX);
    setPosY(newY);
  };

  const handleEnd = () => {
    if (isDragging.current) {
      isDragging.current = false;
      glassesPos.current = { x: posX, y: posY };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="p-2 hover:bg-[#1D1D1F]/5 rounded-full transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-serif text-xl font-bold">Sunglasses Try-On 🕶️</h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">Test custom frames directly on your virtual face</p>
        </div>
      </div>

      {!imageSrc ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl p-10 bg-white shadow-sm hover:border-emerald-500 transition-colors">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 mb-4 text-3xl">🤳</div>
          <h3 className="font-bold text-sm mb-1 text-center">Add Face Selfie</h3>
          <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed mb-6">
            For best results, upload or snap a photo of you looking directly at the camera with clear lighting.
          </p>
          <label className="px-6 py-3 bg-[#1D1D1F] text-white rounded-full font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-md hover:bg-black transition transform hover:-translate-y-0.5">
            Choose Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Active Canvas wrap */}
          <div 
            ref={containerRef}
            className="relative bg-black rounded-3xl shadow-lg border border-gray-200 overflow-hidden select-none"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onMouseUp={handleEnd}
            onTouchEnd={handleEnd}
            onMouseLeave={handleEnd}
          >
            <canvas ref={canvasRef} className="block mx-auto" />
            
            {/* Draggable Glasses overlay */}
            <div
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: `${posX}px`,
                top: `${posY}px`,
                width: `${size}px`,
                height: `${size * 0.3}px`,
                transform: `rotate(${tilt}deg)`,
                WebkitUserSelect: "none"
              }}
            >
              <svg viewBox="0 0 200 60" className="w-full h-full drop-shadow-xl overflow-visible">
                {/* Bridge */}
                <line x1="88" y1="28" x2="112" y2="28" stroke={activeFrame.color} strokeWidth="3" strokeLinecap="round" />
                {/* Temples (behind) */}
                <line x1="12" y1="25" x2="30" y2="25" stroke={activeFrame.color} strokeWidth="3" strokeLinecap="round" />
                <line x1="170" y1="25" x2="188" y2="25" stroke={activeFrame.color} strokeWidth="3" strokeLinecap="round" />
                
                {/* Lenses and main frames */}
                <path d={activeFrame.path} fill="rgba(8, 4, 1, 0.76)" stroke={activeFrame.color} strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Size and Tilt Tuning Sliders */}
          <div className="p-4 bg-white border border-[#000]/10 rounded-2xl shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]">
              <Sliders size={16} /> Tuning controls
            </div>
            
            {/* Size Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Glasses Size</span>
                <span>{size}px</span>
              </div>
              <input 
                type="range" 
                min="60" 
                max="260" 
                value={size} 
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Tilt Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Angle Tilt</span>
                <span>{tilt}°</span>
              </div>
              <input 
                type="range" 
                min="-45" 
                max="45" 
                value={tilt} 
                onChange={(e) => setTilt(parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Frame Carousel selection */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Swipe to Select Frames</span>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hidden">
              {FRAMES.map((f, idx) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFrame(idx)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center p-4 border-[1.5px] rounded-2xl w-28 bg-white shadow-sm transition-all ${selectedFrame === idx ? 'border-emerald-600 scale-[1.03] ring-1 ring-emerald-600/20' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <span className="text-2xl mb-1">🕶️</span>
                  <div className="text-[10px] font-black tracking-tight text-center leading-tight truncate w-full text-zinc-800">{f.name}</div>
                  <div className="text-[8px] text-gray-400 mt-1 truncate w-full text-center">{f.brand}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex gap-4">
            <label className="flex-1 text-center py-3.5 border border-gray-300 rounded-full text-xs font-bold text-zinc-700 bg-white cursor-pointer hover:bg-gray-50 select-none">
              Change Selfie Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            <button
              onClick={() => {
                setImageSrc(null);
                showToast("Cleared try-on photo");
              }}
              className="px-5 py-3.5 bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider rounded-full hover:bg-red-100 transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
