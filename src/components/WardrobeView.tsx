import React, { useState, useEffect } from "react";
import { Plus, Trash2, Sliders, Briefcase, Check, ArrowLeft, X } from "lucide-react";
import { WardrobeItem, CAT_EMOJIS } from "../types";

interface WardrobeViewProps {
  onNavigate: (screen: string) => void;
  wardrobeItems: WardrobeItem[];
  setWardrobeItems: React.Dispatch<React.SetStateAction<WardrobeItem[]>>;
  showToast: (msg: string) => void;
}

export default function WardrobeView({ onNavigate, wardrobeItems, setWardrobeItems, showToast }: WardrobeViewProps) {
  const [activeTab, setActiveTab] = useState<'closet' | 'packer' | 'builder'>('closet');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item inputs
  const [wName, setWName] = useState("");
  const [wBrand, setWBrand] = useState("");
  const [wPrice, setWPrice] = useState("");
  const [wCategory, setWCategory] = useState<'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'bags' | 'accessories'>('tops');
  const [wImg, setWImg] = useState<string | null>(null);

  // Packing list inputs & state
  const [packDestination, setPackDestination] = useState("");
  const [packDays, setPackDays] = useState(4);
  const [packVibe, setPackVibe] = useState("City Break");
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});
  const [showPackResult, setShowPackResult] = useState(false);

  // Outfit builder state
  const [builderSlots, setBuilderSlots] = useState<Record<string, WardrobeItem | null>>({
    top: null,
    bottom: null,
    shoes: null,
    bag: null,
  });
  const [activeBuilderSlot, setActiveBuilderSlot] = useState<'top' | 'bottom' | 'shoes' | 'bag'>('top');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setWImg(canvas.toDataURL('image/jpeg', 0.8));
          showToast("✓ Image parsed safely!");
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddItem = () => {
    const finalName = wName.trim() || `${CAT_EMOJIS[wCategory]} Custom ${wCategory}`;
    const newItem: WardrobeItem = {
      cat: wCategory,
      name: finalName,
      brand: wBrand.trim() || undefined,
      price: parseFloat(wPrice) || undefined,
      img: wImg,
      worn: false,
      added: Date.now()
    };

    setWardrobeItems(prev => [newItem, ...prev]);
    showToast(`✓ Added ${finalName} to your digital closet!`);

    // Reset inputs
    setWName("");
    setWBrand("");
    setWPrice("");
    setWCategory("tops");
    setWImg(null);
    setShowAddModal(false);
  };

  const handleDeleteItem = (addedStamp: number) => {
    setWardrobeItems(prev => prev.filter(i => i.added !== addedStamp));
    showToast("✓ Item removed.");
  };

  const toggleWorn = (addedStamp: number) => {
    setWardrobeItems(prev => prev.map(i => i.added === addedStamp ? { ...i, worn: !i.worn } : i));
  };

  const handleAssignToBuilderSlot = (item: WardrobeItem) => {
    setBuilderSlots(prev => ({ ...prev, [activeBuilderSlot]: item }));
    showToast(`✓ Placed ${item.name} into ${activeBuilderSlot.toUpperCase()} slot!`);
  };

  const handleSaveOutfitFromBuilder = () => {
    const count = Object.values(builderSlots).filter(Boolean).length;
    if (count === 0) {
      showToast("⚠️ Select at least one item first!");
      return;
    }
    showToast(`✓ Outfit combination with ${count} items saved to archive!`);
    setBuilderSlots({ top: null, bottom: null, shoes: null, bag: null });
  };

  const filteredItems = activeFilter === 'all' 
    ? wardrobeItems 
    : wardrobeItems.filter(i => i.cat === activeFilter);

  return (
    <div className="max-w-xl mx-auto p-4 pb-28 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">My Digital Wardrobe</h2>
          <p className="text-xs text-gray-400 mt-1">Sartorial inventory, styling packer & outfit shuffler</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold bg-[#1D1D1F] hover:bg-black text-white rounded-full flex items-center gap-1 shadow-md transition"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex bg-gray-100 p-1 rounded-full text-xs font-semibold">
        <button 
          onClick={() => setActiveTab('closet')}
          className={`flex-1 py-2 text-center rounded-full transition ${activeTab === 'closet' ? 'bg-white text-zinc-950 shadow-sm' : 'text-gray-500'}`}
        >
          👚 Closet
        </button>
        <button 
          onClick={() => setActiveTab('packer')}
          className={`flex-1 py-2 text-center rounded-full transition ${activeTab === 'packer' ? 'bg-white text-zinc-950 shadow-sm' : 'text-gray-500'}`}
        >
          ✈️ Packer
        </button>
        <button 
          onClick={() => setActiveTab('builder')}
          className={`flex-1 py-2 text-center rounded-full transition ${activeTab === 'builder' ? 'bg-white text-zinc-950 shadow-sm' : 'text-gray-500'}`}
        >
          🔀 Builder
        </button>
      </div>

      {activeTab === 'closet' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 text-center bg-white border border-[#000]/5 p-3.5 rounded-2xl shadow-sm">
            <div>
              <div className="font-serif text-lg font-black text-emerald-600">{wardrobeItems.length}</div>
              <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">Total items</div>
            </div>
            <div>
              <div className="font-serif text-lg font-black text-yellow-500">
                {wardrobeItems.filter(i => i.worn).length}
              </div>
              <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">Worn items</div>
            </div>
            <div>
              <div className="font-serif text-lg font-black text-rose-500">
                {wardrobeItems.length > 0 ? Math.round((wardrobeItems.filter(i => i.worn).length / wardrobeItems.length) * 100) : 0}%
              </div>
              <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">Utilization</div>
            </div>
            <div>
              <div className="font-serif text-lg font-black text-zinc-800">
                €{Math.round(wardrobeItems.reduce((acc, current) => acc + (current.price || 0), 0))}
              </div>
              <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-1">Value</div>
            </div>
          </div>

          {/* Filtering Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`flex-shrink-0 px-3 py-1.5 border text-xs font-semibold rounded-full transition ${activeFilter === 'all' ? 'border-[#C87744] bg-[#C87744]/5 text-yellow-600' : 'border-gray-200 bg-white'}`}
            >
              ✦ All
            </button>
            {Object.keys(CAT_EMOJIS).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex-shrink-0 px-3 py-1.5 border text-xs font-semibold rounded-full transition ${activeFilter === cat ? 'border-[#C87744] bg-[#C87744]/5 text-yellow-600' : 'border-gray-200 bg-white'}`}
              >
                {CAT_EMOJIS[cat]} {cat}
              </button>
            ))}
          </div>

          {/* Grid display list */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 border rounded-3xl bg-white flex flex-col items-center">
              <span className="text-5xl mb-3">👗</span>
              <h3 className="font-bold text-sm">Closet Category Empty</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto text-center px-4 leading-relaxed">
                Add style staples using the "Add Item" button above to populate your inventory index.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredItems.map((item, idx) => (
                <div 
                  key={item.added}
                  className="aspect-[3/4] border rounded-2xl bg-white overflow-hidden relative shadow-sm cursor-pointer group flex flex-col justify-end"
                >
                  {item.img ? (
                    <img src={item.img} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-x-0 top-6 text-center text-4xl select-none">{CAT_EMOJIS[item.cat]}</div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 flex flex-col justify-end p-2.5">
                    <div className="text-[10px] font-black leading-tight text-white truncate">{item.name}</div>
                    {item.brand && <div className="text-[8px] text-gray-300 truncate mt-0.5">{item.brand}</div>}
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWorn(item.added); }}
                      className={`p-1.5 rounded-lg border text-[9px] font-bold ${item.worn ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/80 border-gray-200 text-zinc-700 backdrop-blur-md'}`}
                    >
                      {item.worn ? '✓ Worn' : 'Wear'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.added); }}
                      className="p-1.5 bg-red-600/90 hover:bg-red-700 text-white border border-red-500 rounded-lg"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TRIP PACKER SUBMODULE */}
      {activeTab === 'packer' && (
        <div className="flex flex-col gap-4 animate-fade-in bg-white border border-[#000]/5 p-5 rounded-3xl shadow-sm">
          <div className="flex gap-3">
            <span className="text-3xl p-1 bg-yellow-500/10 rounded-xl select-none">✈️</span>
            <div>
              <h3 className="font-serif text-base font-bold text-zinc-950">Pack My Trip</h3>
              <p className="text-[10px] text-gray-400">Generate style checklist sheets using your clothes</p>
            </div>
          </div>

          {!showPackResult ? (
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Destination</span>
                <input 
                  type="text" 
                  placeholder="e.g. Paris, New York, Bali..." 
                  value={packDestination}
                  onChange={(e) => setPackDestination(e.target.value)}
                  className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Trip Duration</span>
                  <input 
                    type="number" 
                    min="1" 
                    max="30"
                    value={packDays}
                    onChange={(e) => setPackDays(parseInt(e.target.value) || 4)}
                    className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Vibe/Setting</span>
                  <select 
                    value={packVibe}
                    onChange={(e) => setPackVibe(e.target.value)}
                    className="w-full mt-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold outline-none"
                  >
                    <option value="City Break">City Break 🏙️</option>
                    <option value="Beach Resort">Beach Resort 🏖️</option>
                    <option value="Business Summit">Business Setup 💼</option>
                    <option value="Party festival">Music Festival 🎊</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!packDestination) { showToast("⚠️ Destination required."); return; }
                  setShowPackResult(true);
                  showToast("✓ Custom travel list drafted!");
                }}
                className="w-full mt-2 py-4 bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-md hover:bg-yellow-400 transition"
              >
                Create Travel List
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-in text-zinc-800">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                <div>
                  <strong className="text-zinc-950 font-bold text-xs">{packDestination}</strong>
                  <div className="text-[9px] text-[#C87744] font-black tracking-wider uppercase mt-0.5">{packDays} Days · {packVibe}</div>
                </div>
                <button 
                  onClick={() => setShowPackResult(false)}
                  className="px-3.5 py-1.5 bg-[#1D1D1F] text-white text-[10px] font-black tracking-wider uppercase rounded-full hover:bg-black transition"
                >
                  Edit Trip
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-col gap-2">
                {[...Array(Math.min(5, packDays))].map((_, i) => (
                  <label key={i} className="flex gap-3 items-center p-3 border border-gray-100 rounded-2xl bg-zinc-50/50 hover:bg-[#C87744]/5 transition cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={!!packedItems[i]}
                      onChange={() => setPackedItems(prev => ({ ...prev, [i]: !prev[i] }))}
                      className="w-4 h-4 accent-[#C87744] shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-zinc-900 leading-tight">Day {i + 1} Outfit</div>
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {i === 0 ? "👕 Travel Tee + Comfort bottoms + Sneakers" : i === 1 ? "👗 Daytime exploration casual sundress" : i === 2 ? "🧥 Dinner jacket + trousers + classy footwear" : "🕶️ Accessories blend + versatile outer layer"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* OUTFIT BUILDER DRAG BLOCK */}
      {activeTab === 'builder' && (
        <div className="flex flex-col gap-4 animate-fade-in bg-white border border-[#000]/5 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold">Cabinet Mixer</h3>
            <button 
              onClick={handleSaveOutfitFromBuilder}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs uppercase tracking-wider shadow"
            >
              Save Outfit
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden select-none">
            {['top', 'bottom', 'shoes', 'bag'].map((slot) => (
              <button
                key={slot}
                onClick={() => setActiveBuilderSlot(slot as any)}
                className={`flex-1 py-3 text-center border font-bold text-xs rounded-2xl transition capitalize flex flex-col items-center. ${activeBuilderSlot === slot ? 'border-yellow-500 bg-yellow-500/5 text-yellow-600 font-semibold' : 'border-gray-200 hover:border-gray-300 text-zinc-500'}`}
              >
                <span className="text-base">{slot === 'top' ? '👕' : slot === 'bottom' ? '👖' : slot === 'shoes' ? '👠' : '👜'}</span>
                <span className="text-[9px] uppercase tracking-wider mt-0.5">{slot}</span>
                {builderSlots[slot] && <span className="text-[9px] text-[#06D6A0] font-black mt-1">✓ Packed</span>}
              </button>
            ))}
          </div>

          {/* Builder selection stage */}
          <div className="bg-zinc-50 rounded-2xl p-4 min-h-16 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Items available is slot</span>
            
            {wardrobeItems.filter(i => {
              if (activeBuilderSlot === 'top') return i.cat === 'tops' || i.cat === 'outerwear';
              if (activeBuilderSlot === 'bottom') return i.cat === 'bottoms';
              if (activeBuilderSlot === 'shoes') return i.cat === 'shoes';
              return i.cat === 'bags' || i.cat === 'accessories';
            }).length === 0 ? (
              <div className="text-center text-xs text-zinc-400 py-6">No matching items in closet. Add some inside tops or shoes!</div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {wardrobeItems.filter(i => {
                  if (activeBuilderSlot === 'top') return i.cat === 'tops' || i.cat === 'outerwear';
                  if (activeBuilderSlot === 'bottom') return i.cat === 'bottoms';
                  if (activeBuilderSlot === 'shoes') return i.cat === 'shoes';
                  return i.cat === 'bags' || i.cat === 'accessories';
                }).map(item => (
                  <div 
                    key={item.added}
                    onClick={() => handleAssignToBuilderSlot(item)}
                    className="aspect-square border border-gray-200 hover:border-yellow-500 rounded-xl bg-white overflow-hidden relative cursor-pointer flex items-center justify-center text-2xl shadow-sm transition transform active:scale-95"
                  >
                    {item.img ? <img src={item.img} className="absolute inset-0 w-full h-full object-cover" /> : CAT_EMOJIS[item.cat]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD ITEM TO STORAGE MODEL */}
      {showAddModal && (
        <div id="addModalWrap" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-end justify-center">
          <div className="bg-[#F5F5F7] text-zinc-800 w-full max-w-md rounded-t-3xl border-t border-gray-100 p-6 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold">Add Wardrobe Item</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={16} /></button>
            </div>

            {/* Custom upload slot */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-white text-center cursor-pointer hover:border-[#C87744]">
              {wImg ? (
                <img src={wImg} className="max-h-24 mx-auto rounded-lg object-cover mb-2" />
              ) : (
                <span className="text-3xl mb-1 inline-block">📷</span>
              )}
              <div className="text-[10px] font-black uppercase text-zinc-500">Item Snapshot photo</div>
              <label className="inline-block mt-2 px-4 py-2 bg-[#1d1d1f] hover:bg-black text-white font-bold text-[9px] uppercase tracking-wider rounded-lg cursor-pointer">
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category</span>
                <select
                  value={wCategory}
                  onChange={(e) => setWCategory(e.target.value as any)}
                  className="w-full mt-1 p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="tops">👕 Tops</option>
                  <option value="bottoms">👖 Bottoms</option>
                  <option value="dresses">👗 Dresses</option>
                  <option value="outerwear">🧥 Outerwear</option>
                  <option value="shoes">👠 Shoes</option>
                  <option value="bags">👜 Bags</option>
                  <option value="accessories">💍 Accessories</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Item Name</span>
                <input 
                  type="text" 
                  placeholder="e.g. Linen Blouse, Silk Dress..." 
                  value={wName}
                  onChange={(e) => setWName(e.target.value)}
                  className="w-full mt-1 p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Brand</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Massimo Dutti" 
                    value={wBrand}
                    onChange={(e) => setWBrand(e.target.value)}
                    className="w-full mt-1 p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Price (Euro)</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 110" 
                    value={wPrice}
                    onChange={(e) => setWPrice(e.target.value)}
                    className="w-full mt-1 p-3.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddItem}
              className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow"
            >
              ✦ Save to Closet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
