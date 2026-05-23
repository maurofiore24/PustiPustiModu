import React, { useState } from "react";
import { Award, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";

interface StylistQuizProps {
  onExit: () => void;
  showToast: (msg: string) => void;
}

interface Question {
  q: string;
  opts: string[];
}

const QUESTIONS: Question[] = [
  { q: "It's spirit week. What are you wearing?", opts: ["All black. Obviously.", "A perfectly curated 'casual' look that took 2 hours.", "My team jersey, proudly.", "Something I made or thrifted. Art is everywhere.", "Whatever's clean and acceptable."] },
  { q: "Someone compliments your outfit. You say:", opts: ["I made it.", "Thanks, it's vintage.", "Oh this? I just threw it on.", "Can I analyze why you're complimenting me?", "I need to write this down for later."] },
  { q: "Your go-to shoe is:", opts: ["Combat boots, always.", "Loafers. Polished.", "Performance sneakers. Function first.", "Platform Mary Janes.", "Whatever matches everything."] },
  { q: "Your color palette is best described as:", opts: ["Black, black, more black.", "Oatmeal, cream, and the suggestion of grey.", "Team colors and logo pieces.", "Whatever clashes beautifully.", "Navy, white, and safe."] },
  { q: "Fashion icon of your high school self:", opts: ["Siouxsie Sioux / Robert Smith", "Carolyn Bessette-Kennedy", "Michael Jordan circa '91", "Björk at any point in time", "No one in particular. I just... existed."] }
];

interface Persona {
  title: string;
  emoji: string;
  sub: string;
  desc: string;
}

const PERSONAS: Persona[] = [
  { title: "The Rebel", emoji: "🖤", sub: "Also known as: The Lone Wolf", desc: "You wore all black and said 'I'm not like other girls' — and honestly? You weren't. You were the one reading Camus in the back row, absolutely giving main character with zero effort. Fashion was your armor and your manifesto." },
  { title: "The Observer", emoji: "🎭", sub: "Also known as: The Quiet Power", desc: "You sat in the middle of the cafeteria and watched everything. Quietly dressed, quietly devastating. People noticed you without knowing why. Your wardrobe was a perfectly curated secret." },
  { title: "The Jock", emoji: "🏆", sub: "Also known as: The Effortless Icon", desc: "Jersey on a Friday. Trainers that cost more than the textbooks. You made athletic wear look like a lifestyle choice — because it was. Unbothered, comfortable, undefeated." },
  { title: "The Artist", emoji: "🎨", sub: "Also known as: The Chaos Visionary", desc: "You wore things that confused people, and you considered that the highest compliment. Your outfits were installations. Your style was ahead of — and possibly beyond — its time." },
  { title: "The Overachiever", emoji: "📚", sub: "Also known as: The Polished One", desc: "You were never in dress code violation. Not once. But somehow your perfectly pressed blazer hit different. Classic, composed, and quietly terrifying. Fashion as résumé." }
];

export default function StylistQuiz({ onExit, showToast }: StylistQuizProps) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<Persona | null>(null);

  const activeQuestion = QUESTIONS[currentIdx];

  const handleAnswer = (optIndex: number) => {
    const nextAnswers = [...answers, optIndex];
    setAnswers(nextAnswers);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Evaluate result
      const tallies = [0, 0, 0, 0, 0];
      nextAnswers.forEach(ans => {
        tallies[ans]++;
      });
      const maxVal = Math.max(...tallies);
      const topIdx = tallies.indexOf(maxVal);
      setResult(PERSONAS[topIdx] || PERSONAS[0]);
      setFinished(true);
      showToast("✦ Archetype computed successfully!");
    }
  };

  const restart = () => {
    setAnswers([]);
    setCurrentIdx(0);
    setFinished(false);
    setResult(null);
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-24 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="p-2 hover:bg-[#1D1D1F]/5 rounded-full transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-serif text-xl font-bold">HS Style Persona 🏫</h2>
          <p className="text-xs text-[#6E6E73] mt-0.5">Which high school role did your style play?</p>
        </div>
      </div>

      {!finished ? (
        <div className="flex flex-col gap-5">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${((currentIdx) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="bg-white border border-[#000]/8 rounded-3xl p-6 shadow-sm">
            <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 mb-2">
              Question {currentIdx + 1} of {QUESTIONS.length}
            </div>
            <h3 className="font-serif text-lg font-black text-gray-900 leading-snug mb-6">
              {activeQuestion.q}
            </h3>

            <div className="flex flex-col gap-3">
              {activeQuestion.opts.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswer(oIdx)}
                  className="w-full p-4 border border-zinc-200 hover:border-emerald-600 hover:bg-emerald-50/20 text-left font-medium text-xs rounded-2xl text-zinc-700 hover:text-emerald-950 transition transform hover:translate-x-1"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        result && (
          <div className="flex flex-col gap-5 bg-white border border-[#000]/8 p-8 rounded-3xl items-center text-center shadow-md animate-fade-in">
            <span className="text-6xl mb-4 animate-bounce p-3 bg-[#1D1D1F]/5 rounded-full">{result.emoji}</span>
            <div className="text-[10px] uppercase font-black text-emerald-600 tracking-widest mb-1">
              Your HS Style Soul
            </div>
            <h3 className="font-serif text-3xl font-black text-gray-900 mb-1 leading-tight">{result.title}</h3>
            <div className="text-xs text-[#B8A87E] font-semibold tracking-wide mb-4 uppercase">{result.sub}</div>
            
            <p className="text-xs text-[#6E6E73] max-w-sm leading-relaxed mb-6">
              {result.desc}
            </p>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={() => {
                  const shareText = `My high school style archetype is ${result.emoji} ${result.title}! What's yours?`;
                  if (navigator.share) {
                    navigator.share({ title: "HS Style Archetype", text: shareText, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(shareText).catch(() => {});
                    showToast("✓ Copied result to clipboard!");
                  }
                }}
                className="w-full py-4 text-center bg-[#1D1D1F] hover:bg-black font-bold uppercase text-xs tracking-wider text-white rounded-full shadow-md transition"
              >
                Share My Result
              </button>
              <button 
                onClick={restart}
                className="w-full py-3.5 text-center border border-gray-300 font-bold uppercase text-xs tracking-wider text-zinc-700 rounded-full hover:bg-gray-50 transition"
              >
                Take It Again
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
