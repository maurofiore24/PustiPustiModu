import React, { useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, Search, Sparkles, RefreshCw, Send, Plus } from "lucide-react";
import { FeedItem, Comment } from "../types";

interface FeedViewProps {
  onNavigate: (screen: string) => void;
  feedItems: FeedItem[];
  setFeedItems: React.Dispatch<React.SetStateAction<FeedItem[]>>;
  showToast: (msg: string) => void;
}

const FOR_YOU_DATA = [
  { user: 'style.ai', av: '🤖', time: 'Curated for you', arch: 'Old Money', score: 9.4, emoji: '💼', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Gisele_Bundchen_Versace_1998.jpg?w=600&q=80', caption: 'This coastal quiet luxury look matches your top profile perfectly.', likes: 312, why: 'Matches your Old Money DNA (58%)' },
  { user: 'kai.tokyo', av: '🗾', time: 'Trending in Avant-Garde', arch: 'Avant-Garde', score: 9.6, emoji: '🎭', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Naomi_Campbell_Versace_1994.jpg?w=600&q=80', caption: 'Deconstructed tailoring is my love language. 9.6 is my highest score yet.', likes: 203, why: 'Trending this week in modern art' },
  { user: 'sophia.m', av: '🌺', time: 'From someone you follow', arch: 'Old Money', score: 8.9, emoji: '🧥', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Kate_Moss_Stella_McCartney_2001.jpg?w=600&q=80', caption: 'Weekend coastal looks. The cashmere is worth every single penny 🤌', likes: 47, why: 'Sophia M. is in your circle' }
];

export default function FeedView({ onNavigate, feedItems, setFeedItems, showToast }: FeedViewProps) {
  const [feedTab, setFeedTab] = useState<'community' | 'foryou' | 'news'>('community');
  const [activeComments, setActiveComments] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  
  // News state
  const [newsQuery, setNewsQuery] = useState('viral fashion 2026');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [hasLoadedNews, setHasLoadedNews] = useState(false);

  useEffect(() => {
    if (feedTab === 'news' && !hasLoadedNews) {
      loadNews('viral fashion 2026');
    }
  }, [feedTab, hasLoadedNews]);

  const loadNews = async (queryStr: string) => {
    setNewsLoading(true);
    setNewsArticles([]);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryStr })
      });
      const data = await res.json();
      setNewsArticles(data.articles || []);
      setHasLoadedNews(true);
    } catch (e) {
      // Fallback
      setNewsArticles([
        { title: "Quiet Luxury Reshapes Runways for SS26", source: "Vogue", time: "1 hour ago", summary: "Impeccable textures, neutral cashmeres, and zero branding dominate the major fashion grids this season.", tags: ["Quiet Luxury", "SS26", "Trends"], viral: true },
        { title: "The Return of the Statement Trench", source: "Business of Fashion", time: "3 hours ago", summary: "Classic silhouettes get a deconstructed make-over with asymmetrical pocket overlays.", tags: ["Trench", "Avant-Garde", "Outerwear"], viral: true }
      ]);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleLike = (idx: number) => {
    setFeedItems(prev => prev.map((item, i) => {
      if (i === idx) {
        const hasLiked = item.reactions?.hasOwnProperty('likedByMe');
        const nextReactions = { ...item.reactions };
        let nextLikes = item.likes;
        if (hasLiked) {
          delete nextReactions['likedByMe'];
          nextLikes = Math.max(0, nextLikes - 1);
        } else {
          nextReactions['likedByMe'] = 1;
          nextLikes++;
        }
        return { ...item, likes: nextLikes, reactions: nextReactions };
      }
      return item;
    }));
  };

  const toggleComments = (idx: number) => {
    setActiveComments(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddComment = (idx: number) => {
    const text = commentInputs[idx]?.trim();
    if (!text) return;

    setFeedItems(prev => prev.map((item, i) => {
      if (i === idx) {
        const newCmt: Comment = {
          av: '⭐',
          user: 'you',
          text,
          time: 'Just now'
        };
        return { ...item, comments: [...item.comments, newCmt] };
      }
      return item;
    }));

    setCommentInputs(prev => ({ ...prev, [idx]: '' }));
    showToast("✓ Comment posted!");
  };

  const addReaction = (idx: number, emo: string) => {
    setFeedItems(prev => prev.map((item, i) => {
      if (i === idx) {
        const nextRxns = { ...item.reactions };
        nextRxns[emo] = (nextRxns[emo] || 0) + 1;
        return { ...item, reactions: nextRxns };
      }
      return item;
    }));
    showToast(`${emo} Reaction added!`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 pb-28">
      {/* Feed navigation tabs */}
      <div className="flex bg-gray-100 p-1 rounded-full">
        <button
          onClick={() => setFeedTab('community')}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-full transition ${feedTab === 'community' ? 'bg-[#1D1D1F] text-white shadow-sm' : 'text-gray-500'}`}
        >
          Community
        </button>
        <button
          onClick={() => setFeedTab('foryou')}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-full transition ${feedTab === 'foryou' ? 'bg-[#1D1D1F] text-white shadow-sm' : 'text-gray-500'}`}
        >
          For You
        </button>
        <button
          onClick={() => setFeedTab('news')}
          className={`flex-1 py-2 text-center text-xs font-semibold rounded-full transition ${feedTab === 'news' ? 'bg-[#1D1D1F] text-white shadow-sm' : 'text-gray-500'}`}
        >
          📰 Real World
        </button>
      </div>

      {feedTab === 'community' && (
        <div className="flex flex-col gap-5">
          {feedItems.map((item, idx) => {
            const isCommentsOpen = !!activeComments[idx];
            const hasLiked = item.reactions?.hasOwnProperty('likedByMe');
            return (
              <div key={idx} className="bg-white border border-[#000]/5 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <span className="text-2xl p-1 bg-yellow-500/10 rounded-full">{item.av}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-zinc-900 truncate">@{item.user}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.time}</div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-500/15">
                    {item.arch}
                  </span>
                </div>

                {/* Scanned outfit image */}
                <div className="relative aspect-[3/4] bg-zinc-950 flex items-center justify-center">
                  <img src={item.imgSrc || ""} className="w-full h-full object-cover" alt="Outfit evaluation" />
                  <div className="absolute bottom-4 right-4 bg-zinc-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-center border border-white/10 shadow-lg">
                    <div className="text-[8px] font-bold text-gray-400 tracking-wider">SCORE</div>
                    <div className="text-xl font-black text-yellow-500 font-serif leading-none mt-0.5">{item.score.toFixed(1)}</div>
                  </div>
                </div>

                {/* Interactive reactions row */}
                <div className="flex gap-2.5 px-4 pt-3 border-b border-gray-100 overflow-x-auto scrollbar-hidden pb-1 select-none">
                  {['🔥', '😍', '✦', '😐', '✂️'].map(emo => {
                    const cnt = item.reactions?.[emo] || 0;
                    return (
                      <button
                        key={emo}
                        onClick={() => addReaction(idx, emo)}
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 border border-zinc-100 hover:border-yellow-500 rounded-full bg-zinc-50 hover:bg-yellow-500/5 text-xs font-semibold text-zinc-700 hover:text-yellow-600 transition"
                      >
                        {emo} <span className="text-[10px] opacity-75">{cnt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Actions row */}
                <div className="flex gap-4 p-4 border-b border-gray-100 text-zinc-700">
                  <button 
                    onClick={() => handleLike(idx)}
                    className={`flex items-center gap-1.5 text-xs font-bold ${hasLiked ? 'text-red-600' : 'hover:text-zinc-900'}`}
                  >
                    <Heart size={16} fill={hasLiked ? "currentColor" : "none"} /> {item.likes}
                  </button>
                  <button 
                    onClick={() => toggleComments(idx)}
                    className="flex items-center gap-1.5 text-xs font-bold hover:text-zinc-900"
                  >
                    <MessageSquare size={16} /> {item.comments.length} Comments
                  </button>
                  <button 
                    onClick={() => { showToast("✓ Share link generated!"); }}
                    className="flex items-center gap-1.5 text-xs font-bold hover:text-zinc-900 ml-auto"
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>

                {/* Caption list */}
                <div className="p-4 text-xs leading-relaxed text-zinc-800">
                  <strong className="text-zinc-950 font-bold mr-1">@{item.user}</strong>
                  {item.caption}
                </div>

                {/* Comments subpanel */}
                <div className="bg-zinc-50/50 p-4 border-t border-gray-100 flex flex-col gap-3">
                  {item.comments.length > 0 && (
                    <button 
                      onClick={() => toggleComments(idx)}
                      className="text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1 self-start"
                    >
                      {isCommentsOpen ? "▲ Hide all comments" : `▼ View all ${item.comments.length} comments`}
                    </button>
                  )}

                  {isCommentsOpen && (
                    <div className="flex flex-col gap-2.5 mb-2 transition-all duration-300">
                      {item.comments.map((c, cIdx) => (
                        <div key={cIdx} className="flex gap-2.5 items-start">
                          <span className="text-base p-0.5 bg-gray-200/55 rounded-full">{c.av}</span>
                          <div className="bg-gray-100/70 p-2.5 rounded-2xl flex-1 text-xs leading-relaxed">
                            <div className="flex justify-between font-bold text-[#C87744] text-[10px] mb-0.5">
                              <span>@{c.user}</span>
                              <span className="text-gray-400 font-normal">{c.time}</span>
                            </div>
                            <p className="text-zinc-700">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Comment something sweet..."
                      value={commentInputs[idx] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(idx); }}
                      className="flex-1 bg-white border border-gray-200 px-3.5 py-2.5 rounded-full text-xs outline-none focus:border-yellow-500 transition-colors"
                    />
                    <button 
                      onClick={() => handleAddComment(idx)}
                      className="p-2.5 bg-[#1D1D1F] hover:bg-black text-white rounded-full transition flex items-center justify-center shadow"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {feedTab === 'foryou' && (
        <div className="flex flex-col gap-5">
          <div className="px-1 text-[10px] uppercase font-black text-yellow-500 tracking-widest flex items-center gap-1">
            <Sparkles size={12} /> Curated For Your DNA Vibe
          </div>

          {FOR_YOU_DATA.map((p, i) => (
            <div key={i} className="bg-white border border-zinc-200 shadow-sm rounded-3xl overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <span className="text-xl p-1 bg-gray-100 rounded-full">{p.av}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold">{p.user}</div>
                  <div className="text-[10px] text-gray-400">{p.time}</div>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-500/15">
                  {p.arch}
                </span>
              </div>

              {/* Match tag */}
              <div className="px-4 py-2 bg-emerald-50 text-[10px] font-bold text-emerald-800 flex items-center gap-1 border-b border-emerald-100/50">
                <span>✦</span> {p.why}
              </div>

              <div className="relative aspect-[3/4] bg-zinc-950 flex items-center justify-center">
                <img src={p.imgSrc} className="w-full h-full object-cover" alt="" />
                <div className="absolute bottom-4 right-4 bg-zinc-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-center border border-white/10 shadow-lg">
                  <div className="pso-label text-[8px] font-bold text-gray-400">SCORE</div>
                  <div className="pso-score text-xl font-black text-yellow-500 font-serif mt-0.5">{p.score}</div>
                </div>
              </div>

              <div className="p-4 text-xs leading-relaxed text-zinc-800">
                <strong className="text-zinc-950 font-bold mr-1">{p.user}</strong>
                {p.caption}
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-4 text-xs font-bold text-zinc-700">
                <button onClick={() => showToast("Liked target recommendation!")} className="flex items-center gap-1.5"><Heart size={16} /> {p.likes}</button>
                <button onClick={() => showToast("Opening comments...")} className="flex items-center gap-1.5"><MessageSquare size={16} /> 14 comments</button>
                <button onClick={() => onNavigate('analysis')} className="ml-auto flex items-center gap-1 px-4 py-1.5 border border-yellow-500 text-yellow-600 rounded-full uppercase text-[9px] font-black tracking-widest bg-yellow-500/5 hover:bg-yellow-500 hover:text-black transition">Scan Match</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {feedTab === 'news' && (
        <div className="flex flex-col gap-4">
          {/* Custom news search */}
          <div className="flex bg-white border border-[#000]/10 rounded-2xl p-1 shadow-sm gap-2">
            <input 
              type="text"
              placeholder="Search fashion news..."
              value={newsQuery}
              onChange={(e) => setNewsQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') loadNews(newsQuery); }}
              className="flex-1 px-3 text-xs outline-none bg-transparent"
            />
            <button 
              onClick={() => loadNews(newsQuery)}
              className="p-3 bg-[#1D1D1F] hover:bg-black text-white rounded-xl transition flex items-center justify-center shadow"
            >
              <Search size={14} />
            </button>
          </div>

          {/* Quick theme chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden select-none">
            {['viral fashion 2026', 'Runway drops 2026', 'Sustainable materials', 'Louis Vuitton Virgil', 'Met Gala trends'].map(chip => (
              <button
                key={chip}
                onClick={() => { setNewsQuery(chip); loadNews(chip); }}
                className={`flex-shrink-0 px-3 py-1.5 border text-xs font-semibold rounded-full transition ${newsQuery === chip ? 'border-yellow-500 bg-yellow-500/5 text-yellow-600' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                {chip}
              </button>
            ))}
          </div>

          {newsLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="animate-spin text-yellow-500" size={32} />
              <div className="text-serif font-black text-sm italic text-[#B8A87E] animate-pulse">Scanning the fashion world...</div>
            </div>
          )}

          {!newsLoading && newsArticles.map((n, i) => (
            <div 
              key={i} 
              onClick={() => {
                const url = 'https://www.google.com/search?q=' + encodeURIComponent(n.title + ' ' + n.source);
                window.open(url, '_blank');
              }}
              className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-5 hover:border-yellow-500 transition-all cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">{n.source}</span>
                <span className="text-[10px] text-gray-400 ml-auto">{n.time}</span>
              </div>

              {n.viral && (
                <div className="inline-flex px-2 py-0.5 bg-red-50 text-red-600 border border-red-200/50 rounded text-[9px] font-black tracking-widest uppercase mb-1.5">
                  🔥 Viral Now
                </div>
              )}

              <h3 className="font-serif text-base font-black text-zinc-950 mb-1.5 leading-snug">{n.title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">{n.summary}</p>

              <div className="flex gap-1.5 flex-wrap items-center">
                {(n.tags || []).map((t: string) => (
                  <span key={t} className="text-[9px] font-bold px-2.5 py-0.5 bg-zinc-100 text-zinc-500 rounded-full uppercase">{t}</span>
                ))}
                <span className="text-[10px] font-black text-[#C87744] hover:underline ml-auto">Read Article ↗</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
