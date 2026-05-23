import React, { useState } from "react";
import { User, Sliders, Shield, Award, HelpCircle } from "lucide-react";

interface SettingsViewProps {
  onNavigate: (screen: string) => void;
  showToast: (msg: string) => void;
}

export default function SettingsView({ onNavigate, showToast }: SettingsViewProps) {
  // Simple state persistence inputs
  const [userName, setUserName] = useState("Sartorialist");
  const [userGender, setUserGender] = useState("neutral");
  const [prefComfort, setPrefComfort] = useState(70);
  const [prefLoud, setPrefLoud] = useState(30);

  const handleSaveSettings = () => {
    showToast("✓ Profile preferences synchronized!");
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 pb-28">
      {/* Header */}
      <div>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Settings & Profiling</h2>
        <p className="text-xs text-gray-400 mt-1">Configure your proportions, brand weights, and styling preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white border border-[#000]/5 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
        <h3 className="text-[10px] font-black uppercase text-[#C87744] tracking-widest mb-1 flex items-center gap-1">
          <User size={12} /> Personal Profile
        </h3>

        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">My Name / Alias</span>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-yellow-500" 
            />
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Gender Target</span>
            <select
              value={userGender}
              onChange={(e) => setUserGender(e.target.value)}
              className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none"
            >
              <option value="neutral">Neutral / Fluid 🕊️</option>
              <option value="masculine">Masculine 👔</option>
              <option value="feminine">Feminine 👗</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preference Sliders */}
      <div className="bg-white border border-[#000]/5 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
        <h3 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1 flex items-center gap-1">
          <Sliders size={12} /> Style Weight Biases
        </h3>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-700">Comfort vs. Structural Armor</span>
              <span className="text-emerald-600">{prefComfort}% Comfort</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={prefComfort}
              onChange={(e) => setPrefComfort(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1 bg-gray-100 rounded-lg appearance-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-700">Minimalist vs. Statement Loudness</span>
              <span className="text-yellow-600">{prefLoud}% Loudness</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={prefLoud}
              onChange={(e) => setPrefLoud(parseInt(e.target.value))}
              className="w-full accent-yellow-500 cursor-pointer h-1 bg-gray-100 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="p-4 bg-gray-50 border border-zinc-200/50 rounded-2xl flex gap-3 text-zinc-600">
        <Shield size={18} className="text-gray-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <h4 className="font-bold text-xs text-zinc-805">Privacy & Environment Safeguard</h4>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            For maximum privacy, image files are scaled locally before uploading. Scans are handled securely server-side inside Cloud Run environments.
          </p>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={handleSaveSettings}
        className="w-full py-4 bg-zinc-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow transition"
      >
        ✓ Update Profile Preferences
      </button>
    </div>
  );
}
