import React, { useState, useEffect, useRef } from "react";
import { Smile, ShieldAlert, Award, ArrowLeft } from "lucide-react";

interface FTetrisGameProps {
  archId?: string;
  archName?: string;
  archEmoji?: string;
  onExit?: () => void;
  onSaveScore?: (score: number) => void;
}

const FT_ITEMS: Record<string, { good: string[]; bad: string[]; goodLabels: string[]; badLabels: string[] }> = {
  classic: {
    good: ['👗', '🧥', '💼', '🧣', '👠'],
    bad: ['🧢', '👟', '🩳', '👕', '🎒'],
    goodLabels: ['Silk Dress', 'Tailored Coat', 'Leather Bag', 'Cashmere Scarf', 'Kitten Heels'],
    badLabels: ['Baseball Cap', 'Chunky Sneakers', 'Athletic Shorts', 'Basic Tee', 'Backpack']
  },
  streetwear: {
    good: ['🧢', '👟', '🧥', '🩳', '👜'],
    bad: ['👗', '🎩', '👠', '🧣', '💍'],
    goodLabels: ['Fitted Cap', 'Retro Sneakers', 'Windbreaker', 'Cargo Shorts', 'Crossbody Bag'],
    badLabels: ['Floral Dress', 'Top Hat', 'Stilettos', 'Ostrich Scarf', 'Diamond Ring']
  },
  oldmoney: {
    good: ['🧥', '👜', '🧣', '⌚', '👞'],
    bad: ['🎒', '👟', '🩳', '🧢', '💎'],
    goodLabels: ['Cashmere Blazer', 'Leather Satchel', 'Silk Scarf', 'Heritage Watch', 'Leather Loafers'],
    badLabels: ['Hype Backpack', 'Neon Sneakers', 'Beach Shorts', 'Logo Cap', 'Flashy Diamante']
  },
  avantgarde: {
    good: ['🎭', '🧤', '👒', '🥿', '🧶'],
    bad: ['👗', '👠', '💼', '🧣', '👔'],
    goodLabels: ['Sculptural Mask', 'Oversized Gloves', 'Fringe Bonnet', 'Deconstructed Slide', 'Raw Wool Knit'],
    badLabels: ['A-Line Dress', 'Classic Pumps', 'Office Briefcase', 'Simple Muffler', 'Corporate Tie']
  }
};

export default function FTetrisGame({ archId = 'classic', archName = 'Clean Girl', archEmoji = '🤍', onExit, onSaveScore }: FTetrisGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [slaps, setSlaps] = useState(0);
  const [playerX, setPlayerX] = useState(45);
  const [itemX, setItemX] = useState(50);
  const [itemY, setItemY] = useState(-10);
  const [currentItem, setCurrentItem] = useState({ emoji: '👗', label: 'Silk Dress' });
  const [isGood, setIsGood] = useState(true);
  const [speed, setSpeed] = useState(1.2);
  const [isSlashing, setIsSlashing] = useState(false);
  const [flashCatch, setFlashCatch] = useState(false);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'win'>('start');
  const [caughtItems, setCaughtItems] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const activeArch = FT_ITEMS[archId] || FT_ITEMS.classic;

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        setItemY(prev => {
          const next = prev + speed * 1.5;
          if (next > 88) {
            handleMiss();
            return -10;
          }
          return next;
        });
      }, 50);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [gameState, speed, isGood, currentItem]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1500);
  };

  const spawnItem = () => {
    const isGoodItem = Math.random() > 0.4;
    const pool = isGoodItem ? activeArch.good : activeArch.bad;
    const labels = isGoodItem ? activeArch.goodLabels : activeArch.badLabels;
    const idx = Math.floor(Math.random() * pool.length);
    
    setIsGood(isGoodItem);
    setCurrentItem({ emoji: pool[idx], label: labels[idx] });
    setItemX(15 + Math.random() * 70);
    setItemY(-8);
  };

  const handleMiss = () => {
    if (isGood) {
      triggerSlap("Missed an archetype icon! 💅🏻");
    } else {
      setScore(prev => prev + 5);
      showToast("✓ Avoided mismatch! +5");
      spawnItem();
    }
  };

  const triggerSlap = (msg: string) => {
    setIsSlashing(true);
    setSlaps(prev => {
      const next = prev + 1;
      if (next >= 4) {
        setGameState('gameover');
      } else {
        setTimeout(() => {
          setIsSlashing(false);
          spawnItem();
        }, 900);
      }
      return next;
    });
    showToast(msg);
  };

  const moveLeft = () => {
    setPlayerX(prev => Math.max(5, prev - 12));
  };

  const moveRight = () => {
    setPlayerX(prev => Math.min(85, prev + 12));
  };

  const catchItem = () => {
    if (gameState !== 'playing') return;
    const dist = Math.abs(playerX - itemX);
    if (dist < 18) {
      if (isGood) {
        setScore(prev => {
          const next = prev + 20;
          if (next >= 200) {
            setGameState('win');
            onSaveScore(next);
          }
          return next;
        });
        setFlashCatch(true);
        setTimeout(() => setFlashCatch(false), 300);
        setCaughtItems(prev => [...prev.slice(-4), currentItem.emoji]);
        setSpeed(prev => Math.min(3.0, prev + 0.1));
        showToast("✦ Perfect Match! +20");
        spawnItem();
      } else {
        triggerSlap("Ugh, a bad style choice! 💅🏻");
      }
    } else {
      showToast("Too far away! Move under it first.");
    }
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        catchItem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerX, itemX, isGood, currentItem]);

  const startNewGame = () => {
    setScore(0);
    setSlaps(0);
    setPlayerX(45);
    setSpeed(1.2);
    setCaughtItems([]);
    setGameState('playing');
    spawnItem();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0A1814] flex flex-col text-[#F5ECD4]">
      {/* HUD Header */}
      <div className="flex items-center justify-between p-4 bg-emerald-950/40 border-b border-emerald-900/40">
        <button onClick={onExit} className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft size={16} /> Exit Game
        </button>
        <div className="font-mono text-center">
          <div className="text-[10px] tracking-widest text-[#B8A87E]/65 uppercase">Archetype</div>
          <div className="text-sm font-bold text-emerald-400">{archEmoji} {archName}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] tracking-widest text-[#B8A87E]/65 uppercase">Score</div>
          <div className="text-xl font-bold font-mono tracking-tight text-yellow-500">{score}</div>
        </div>
      </div>

      {/* Arena Stage */}
      <div className="relative flex-1 bg-gradient-to-b from-[#0A1814] via-[#0E241F] to-[#0A1814] overflow-hidden flex flex-col">
        {/* Lives/Slaps indicators */}
        <div className="absolute top-4 left-4 z-20 flex gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-emerald-900/30">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-sm font-bold transition-all duration-300">
              {i < slaps ? '💔' : '💋'}
            </span>
          ))}
        </div>

        {gameState === 'start' && (
          <div className="absolute inset-0 bg-[#0A1814]/95 flex flex-col items-center justify-center p-6 text-center z-50">
            <span className="text-6xl mb-4 animate-bounce">💅🏻</span>
            <h2 className="font-serif text-3xl font-black text-yellow-500 mb-2 tracking-tight">F·TETRIS</h2>
            <p className="text-xs text-[#B8A87E] max-w-sm leading-relaxed mb-6">
              Catch fashion pieces matching your designated style (<strong className="text-emerald-400">{archName}</strong>). Avoid matching style disasters or you get slapped out by a beautiful hand with French nails!
            </p>
            <button onClick={startNewGame} className="px-8 py-3.5 bg-yellow-500 text-black font-bold uppercase rounded-full text-xs tracking-wider shadow-lg hover:bg-yellow-400 transition transform hover:-translate-y-0.5">
              Let's Play ✦
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
            <span className="text-6xl mb-4">😰</span>
            <h2 className="font-serif text-3xl font-black text-red-500 mb-2 tracking-tight">SLAPPED OUT!</h2>
            <p className="text-xs text-red-100 max-w-sm leading-relaxed mb-6">
              Your style discipline was too loose. The French nails found you lacking, darling.
            </p>
            <div className="text-lg font-bold font-mono text-yellow-500 mb-6">Final Score: {score}</div>
            <div className="flex gap-4">
              <button onClick={startNewGame} className="px-6 py-3 bg-white text-black font-bold uppercase rounded-full text-xs tracking-wider hover:bg-gray-100 transition">
                Try Again
              </button>
              <button onClick={onExit} className="px-6 py-3 bg-red-800 text-white font-bold uppercase rounded-full text-xs tracking-wider hover:bg-red-700 transition">
                Exit
              </button>
            </div>
          </div>
        )}

        {gameState === 'win' && (
          <div className="absolute inset-0 bg-[#0A1814]/95 flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
            <span className="text-6xl mb-4">👑</span>
            <h2 className="font-serif text-3xl font-black text-yellow-500 mb-2 tracking-tight">STYLE LEGEND!</h2>
            <p className="text-xs text-[#B8A87E] max-w-sm leading-relaxed mb-6">
              Divine intuition! You captured every correct style piece to achieve complete sartorial synchronization.
            </p>
            <div className="text-lg font-bold font-mono text-emerald-400 mb-6 font-semibold">Perfect Score: {score}</div>
            <button onClick={onExit} className="px-8 py-3.5 bg-yellow-500 text-black font-bold uppercase rounded-full text-xs tracking-wider hover:bg-yellow-400 transition">
              Claim Victory
            </button>
          </div>
        )}

        {/* Visual Flash indicators */}
        <div className={`absolute inset-0 bg-red-600/10 pointer-events-none transition-opacity duration-300 z-10 ${isSlashing ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-yellow-500/10 pointer-events-none transition-opacity duration-300 z-10 ${flashCatch ? 'opacity-100' : 'opacity-0'}`} />

        {/* Falling Item */}
        {gameState === 'playing' && (
          <div
            className="absolute flex flex-col items-center gap-1 transition-all duration-75 ease-linear pointer-events-none"
            style={{ left: `${itemX}%`, top: `${itemY}%` }}
          >
            <span className="text-5xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] animate-bounce">{currentItem.emoji}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-md ${isGood ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/30' : 'bg-red-950/80 text-red-400 border border-red-700/30'}`}>
              {currentItem.label}
            </span>
          </div>
        )}

        {/* Slapping French Nails animation block */}
        {isSlashing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-pulse">
            <span className="text-8xl transform rotate-12 drop-shadow-[0_0_40px_rgba(239,68,68,0.5)]">💅🏻💥</span>
          </div>
        )}

        {/* Player Figure */}
        {gameState === 'playing' && (
          <div
            className="absolute bottom-10 flex flex-col items-center transition-all duration-100"
            style={{ left: `${playerX}%` }}
          >
            {/* Display caught stack above player head */}
            <div className="flex gap-0.5 h-6 mb-1 items-end">
              {caughtItems.map((e, idx) => (
                <span key={idx} className="text-base animate-pulse">{e}</span>
              ))}
            </div>
            <div className="text-6xl drop-shadow-[0_12px_24px_rgba(16,185,129,0.3)]">🧍‍♀️</div>
          </div>
        )}

        {/* Runway Base line */}
        <div className="absolute bottom-6 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-600 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.7)]" />
      </div>

      {/* Game Controller Pads */}
      <div className="p-4 bg-emerald-950/30 border-t border-emerald-900/40 select-none">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
          <button
            onTouchStart={moveLeft}
            onMouseDown={moveLeft}
            className="py-5 bg-emerald-900/40 hover:bg-emerald-900/60 active:scale-95 transition border border-emerald-800/40 rounded-xl text-2xl font-bold flex items-center justify-center text-emerald-400"
          >
            ◀
          </button>
          <button
            onTouchStart={catchItem}
            onMouseDown={catchItem}
            className="py-5 bg-yellow-500 hover:bg-yellow-400 active:scale-95 transition rounded-xl text-black font-bold flex flex-col items-center justify-center"
          >
            <span className="text-sm tracking-widest font-black">CATCH</span>
            <span className="text-[9px] opacity-75">✦ ✦ ✦</span>
          </button>
          <button
            onTouchStart={moveRight}
            onMouseDown={moveRight}
            className="py-5 bg-emerald-900/40 hover:bg-emerald-900/60 active:scale-95 transition border border-emerald-800/40 rounded-xl text-2xl font-bold flex items-center justify-center text-emerald-400"
          >
            ▶
          </button>
        </div>
        <div className="text-center text-[10px] text-[#B8A87E]/60 mt-3 italic">
          Align under the correct items & tap CATCH! Or use Left/Right arrows & Space on your keyboard.
        </div>
      </div>

      {/* Floating toast notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 border border-[#B8A87E]/40 px-4 py-2.5 rounded-full shadow-2xl text-xs font-semibold text-yellow-500 tracking-wide animate-bounce">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
