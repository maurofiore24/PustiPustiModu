import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Sparkles, 
  Home, 
  Camera, 
  BookOpen, 
  Users, 
  FolderHeart, 
  Palette, 
  Settings as SettingsIcon, 
  Smartphone, 
  RefreshCw,
  Gamepad2,
  Bell
} from "lucide-react";

// Views imports
import HomeView from "./components/HomeView";
import AnalysisView from "./components/AnalysisView";
import LibraryView from "./components/LibraryView";
import FeedView from "./components/FeedView";
import LegendsView from "./components/LegendsView";
import MagicLabView from "./components/MagicLabView";
import WardrobeView from "./components/WardrobeView";
import ColorMeView from "./components/ColorMeView";
import SettingsView from "./components/SettingsView";
import FTetrisGame from "./components/FTetrisGame";

// Types
import { FeedItem, WardrobeItem, DEFAULT_FEED, DEFAULT_WARDROBE, LEGENDS } from "./types";

export default function App() {
  const [screen, setScreen] = useState<string>("home");
  const [selectedStyle, setSelectedStyle] = useState<string | null>("classic");
  
  // Storage states with initial values
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [recentLooks, setRecentLooks] = useState<any[]>([]);
  
  // Game states
  const [showArcade, setShowArcade] = useState(false);
  const [activeLegendId, setActiveLegendId] = useState<string | null>(null);

  // Custom persistent toasts helper
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<any>(null);

  const showToast = (message: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(message);
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    setToastTimer(t);
  };

  useEffect(() => {
    // Load local storage if available
    try {
      const storedWardrobe = localStorage.getItem("f_wardrobe");
      if (storedWardrobe) {
        setWardrobeItems(JSON.parse(storedWardrobe));
      } else {
        setWardrobeItems(DEFAULT_WARDROBE);
      }
      
      const storedLooks = localStorage.getItem("f_looks");
      if (storedLooks) {
        setRecentLooks(JSON.parse(storedLooks));
      } else {
        setRecentLooks([
          { style: "Old Money", emoji: "💼", score: 9.1, date: "Yesterday" },
          { style: "Classic Elegance", emoji: "🧥", score: 8.6, date: "3 days ago" }
        ]);
      }
    } catch {
      setWardrobeItems(DEFAULT_WARDROBE);
    }

    setFeedItems(DEFAULT_FEED);
  }, []);

  // Update localStorage when lists modify
  useEffect(() => {
    if (wardrobeItems.length > 0) {
      localStorage.setItem("f_wardrobe", JSON.stringify(wardrobeItems));
    }
  }, [wardrobeItems]);

  useEffect(() => {
    if (recentLooks.length > 0) {
      localStorage.setItem("f_looks", JSON.stringify(recentLooks));
    }
  }, [recentLooks]);

  const addFeedItem = (newItem: FeedItem) => {
    setFeedItems(prev => [newItem, ...prev]);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-zinc-900 font-sans flex flex-col antialiased">
      {/* Universal Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-50 bg-[#F5F5F7]/85 backdrop-blur-md border-b border-zinc-200/50 px-4 py-3 pb-3.5 flex items-center justify-between">
        <div 
          onClick={() => { setScreen("home"); }}
          className="flex items-center gap-1.5 cursor-pointer select-none group"
        >
          <span className="text-xl p-1.5 bg-[#1D1D1F] text-[#F5ECD4] rounded-xl font-black font-serif leading-none tracking-tighter group-hover:rotate-6 transition select-none">F</span>
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-wider text-zinc-950 font-serif leading-none mt-0.5">FashionGrid</h1>
            <span className="text-[8px] font-bold text-gray-400 mt-0.5 tracking-widest uppercase">AI Stylist Suite</span>
          </div>
        </div>

        {/* Header quick buttons */}
        <div className="flex gap-2.5 items-center">
          <button
            onClick={() => setShowArcade(true)}
            className="p-2 hover:bg-zinc-200 select-none cursor-pointer rounded-full text-zinc-800 transition relative group"
            title="Sartorial Arcade Mode"
          >
            <Gamepad2 size={16} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
          </button>
          
          <button
            onClick={() => { setScreen("settings"); }}
            className={`p-2 hover:bg-zinc-200 cursor-pointer rounded-full text-zinc-800 transition ${screen === "settings" ? 'bg-zinc-200' : ''}`}
            title="Proportions and Preferences Settings"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </header>

      {/* Main viewport Container with dynamic content injection */}
      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col">
        {screen === "home" && (
          <HomeView 
            onNavigate={(scr) => {
              if (scr === 'colorme') {
                setScreen('colors');
              } else {
                setScreen(scr);
              }
            }}
            onSelectStyle={setSelectedStyle}
            onLaunchGame={() => setShowArcade(true)}
            recentLooks={recentLooks}
            legends={LEGENDS}
            onOpenLegend={(id) => {
              setActiveLegendId(id);
              setScreen('legends');
            }}
          />
        )}
        
        {screen === "analysis" && (
          <AnalysisView 
            onNavigate={setScreen}
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            recentLooks={recentLooks}
            setRecentLooks={setRecentLooks}
            addFeedItem={addFeedItem}
            showToast={showToast}
          />
        )}

        {screen === "library" && (
          <LibraryView 
            onNavigate={setScreen}
            onSelectStyle={(id) => { setSelectedStyle(id); }}
          />
        )}

        {screen === "feed" && (
          <FeedView 
            onNavigate={setScreen}
            feedItems={feedItems}
            setFeedItems={setFeedItems}
            showToast={showToast}
          />
        )}

        {screen === "legends" && (
          <LegendsView 
            onNavigate={setScreen}
            showToast={showToast}
            activeLegendId={activeLegendId}
            setActiveLegendId={setActiveLegendId}
          />
        )}

        {screen === "magic" && (
          <MagicLabView 
            onNavigate={setScreen}
            showToast={showToast}
          />
        )}

        {screen === "wardrobe" && (
          <WardrobeView 
            onNavigate={setScreen}
            wardrobeItems={wardrobeItems}
            setWardrobeItems={setWardrobeItems}
            showToast={showToast}
          />
        )}

        {screen === "colors" && (
          <ColorMeView 
            onNavigate={setScreen}
            addFeedItem={addFeedItem}
            showToast={showToast}
          />
        )}

        {screen === "settings" && (
          <SettingsView 
            onNavigate={setScreen}
            showToast={showToast}
          />
        )}
      </main>

      {/* Bottom Sticky Tab Navigation Row (5 core items) */}
      <nav className="fixed bottom-0 inset-x-0 z-[1000] bg-[#F5F5F7]/85 backdrop-blur-md border-t border-zinc-200/50 pb-safe-bottom">
        <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between text-zinc-500">
          <button
            onClick={() => { setScreen("home"); }}
            className={`flex flex-col items-center gap-1 group flex-1 cursor-pointer transition ${screen === "home" ? "text-zinc-950 scale-105" : "hover:text-zinc-800"}`}
          >
            <Home size={18} className="group-hover:translate-y-[-1px] transition" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Index</span>
          </button>

          <button
            onClick={() => { setScreen("analysis"); }}
            className={`flex flex-col items-center gap-1 group flex-1 cursor-pointer transition ${screen === "analysis" ? "text-zinc-950 scale-105" : "hover:text-zinc-800"}`}
          >
            <Camera size={18} className="group-hover:translate-y-[-1px] transition" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono font-black">Scan</span>
          </button>

          {/* Quick core drawer button inside bar */}
          <button
            onClick={() => { setScreen("wardrobe"); }}
            className={`flex flex-col items-center gap-1 group flex-1 cursor-pointer transition ${screen === "wardrobe" ? "text-zinc-950 scale-105" : "hover:text-zinc-800"}`}
          >
            <FolderHeart size={18} className="group-hover:translate-y-[-1px] transition" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Closet</span>
          </button>

          <button
            onClick={() => { setScreen("magic"); }}
            className={`flex flex-col items-center gap-1 group flex-1 cursor-pointer transition ${screen === "magic" ? "text-zinc-950 scale-105" : "hover:text-zinc-800"}`}
          >
            <Sparkles size={18} className="group-hover:translate-y-[-1px] transition animate-pulse" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Magic</span>
          </button>

          <button
            onClick={() => { setScreen("feed"); }}
            className={`flex flex-col items-center gap-1 group flex-1 cursor-pointer transition ${screen === "feed" ? "text-zinc-950 scale-105" : "hover:text-zinc-800"}`}
          >
            <Users size={18} className="group-hover:translate-y-[-1px] transition" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono">Stream</span>
          </button>
        </div>
      </nav>

      {/* Floating Global Custom Alerts Container */}
      {toastMessage && (
        <div id="toastBox" className="fixed bottom-24 inset-x-4 z-[2000] flex justify-center pointer-events-none select-none animate-fade-in">
          <div className="bg-[#1D1D1F]/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-4 py-3 rounded-2xl shadow-xl border border-white/5 max-w-xs text-center flex items-center justify-center">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Retro Arcade overlay modal */}
      {showArcade && (
        <div id="arcadeModal" className="fixed inset-0 z-[1200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-white/10 text-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <span className="text-[8px] font-extrabold tracking-widest text-[#B8A87E] uppercase block">Sartorial Arcade</span>
                <h4 className="font-serif text-lg font-black text-white leading-none mt-1">F-Tetris Arcade 👾</h4>
              </div>
              <button 
                onClick={() => setShowArcade(false)}
                className="p-1 px-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Retro Game Block */}
            <div className="bg-black/80 rounded-2xl p-0 shadow-inner">
              <FTetrisGame />
            </div>

            <div className="text-[9px] text-gray-400 text-center uppercase tracking-wider leading-relaxed">
              Drop styled pieces correctly. Score points to unlock elite avatar labels.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
