import React, { useState } from "react";
import { SpeechAnalysis, HighlightItem, SpeakingTopic } from "../../types";
import { Sparkles, Calendar, Heart, ShieldAlert, CheckCircle2, TrendingUp, Info } from "lucide-react";

interface AIAnalysisViewProps {
  activeRecord: {
    topicText: string;
    category: string;
    duration: number;
    timestamp: string;
    transcript: string;
    highlights: HighlightItem[];
    analysis: SpeechAnalysis;
  } | null;
  onNavigate: (view: string) => void;
  accentBtn: string;
  onStartPracticeFollowUp?: (questionText: string) => void;
}

export const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({
  activeRecord, onNavigate, accentBtn, onStartPracticeFollowUp
}) => {
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightItem | null>(null);

  if (!activeRecord) {
    return (
      <div className="text-center py-20 p-6 bg-white rounded-3xl border shadow-sm animate-fade-in">
        <div className="text-6xl mb-4">🧠</div>
        <h3 className="text-lg font-bold text-slate-705">Belum Ada Sesi untuk Dianalisis</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">Selesaikan latihan bicaramu di tab 'Speaking Topics' atau klik salah satu 'Speech History' lamamu untuk menampilkan diagnosis AI di sini!</p>
        <button
          onClick={() => onNavigate("topics")}
          className={`mt-4 px-6 py-2.5 rounded-xl font-bold text-xs ${accentBtn}`}
        >
          🎲 SPIN DAN MULAI SEKARANG
        </button>
      </div>
    );
  }

  const { topicText, category, duration, timestamp, transcript, highlights, analysis } = activeRecord;

  // Visual Gauge helper
  const renderGauge = (label: string, score: number, colorClass: string) => {
    return (
      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-1 hover:border-slate-300 transition">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>{label}</span>
          <span>{score}/100</span>
        </div>
        <div className="w-full bg-slate-105 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass} rounded-full`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const getHighlightStyle = (type: string, isSelected: boolean) => {
    const base = "px-1.5 py-0.5 rounded-md font-bold cursor-pointer transition border border-dashed select-none inline-block ";
    if (type === "grammar") {
      return base + (isSelected ? "bg-red-200 border-red-500 text-red-800 scale-105" : "bg-red-50 hover:bg-red-100 border-red-300 text-red-700");
    }
    if (type === "filler") {
      return base + (isSelected ? "bg-amber-200 border-amber-500 text-amber-800 scale-105" : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700");
    }
    if (type === "repeated") {
      return base + (isSelected ? "bg-indigo-200 border-indigo-500 text-indigo-800 scale-105" : "bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-700");
    }
    return base + (isSelected ? "bg-[#BABF94]/55 border-emerald-500 text-emerald-800 scale-105" : "bg-[#F3E4C9]/40 hover:bg-[#FAF8ED] border-[#BFA28C] text-amber-900");
  };

  // Clickable inline highlights builder
  // We scan the transcript text and wrap any highlights carefully
  const renderHighlightsText = () => {
    if (!highlights || highlights.length === 0) {
      return <p className="text-xs text-slate-600 leading-relaxed font-sans">{transcript}</p>;
    }

    let resultElements: React.ReactNode[] = [];
    let textPivot = transcript;
    let matchCounter = 0;

    // To prevent infinite replacement loops, let's sort highlight substrings by length (longer first)
    // so we don't matches smaller nested words first
    const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);

    // Simple robust word-split lookup to wrap words
    // We can parse sentence segments easily
    let keyIdx = 0;
    
    // Fallback: list of highlights that are clickable next to the box, and highlights inside the paragraph
    // Let's render the transcript nicely, and highlight the phrases
    let parts: { text: string; highlight: HighlightItem | null }[] = [{ text: transcript, highlight: null }];

    sortedHighlights.forEach((hl) => {
      const newParts: { text: string; highlight: HighlightItem | null }[] = [];
      parts.forEach((p) => {
        if (p.highlight) {
          newParts.push(p);
          return;
        }
        
        const idx = p.text.toLowerCase().indexOf(hl.text.toLowerCase());
        if (idx !== -1) {
          const beforeStr = p.text.substring(0, idx);
          const exactStr = p.text.substring(idx, idx + hl.text.length);
          const afterStr = p.text.substring(idx + hl.text.length);

          if (beforeStr) newParts.push({ text: beforeStr, highlight: null });
          newParts.push({ text: exactStr, highlight: hl });
          if (afterStr) newParts.push({ text: afterStr, highlight: null });
        } else {
          newParts.push(p);
        }
      });
      parts = newParts;
    });

    return (
      <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
        {parts.map((p, idx) => {
          if (p.highlight) {
            const isSelected = selectedHighlight?.text === p.highlight.text;
            return (
              <span
                key={idx}
                onClick={() => setSelectedHighlight(p.highlight)}
                className={getHighlightStyle(p.highlight.type, isSelected)}
              >
                {p.text}
              </span>
            );
          }
          return <span key={idx}>{p.text}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 🧩 Header Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Melo Diagnostic AI Coach
          </span>
          <h2 className="text-lg font-bold text-slate-800 font-sans mt-1.5">
            "{topicText}"
          </h2>
          <p className="text-xs text-slate-400">Diagosis Sesi Latihan speaking kategori "{category}"</p>
        </div>

        <div className="text-center bg-indigo-50 border border-indigo-150 px-4 py-2 rounded-2xl shrink-0">
          <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest leading-none">Skor Kelompok</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{analysis.overallScore}</div>
        </div>
      </div>

      {/* 🚀 Main Bento Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Core score components / metrics (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Detailed metrics slider gauges */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parameter Evaluasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderGauge("Clarity (Kejelasan Suara)", analysis.clarity, "bg-emerald-500")}
              {renderGauge("Confidence (Percaya Diri)", analysis.confidence, "bg-indigo-500")}
              {renderGauge("Grammar Accuracy", analysis.grammar, "bg-red-500")}
              {renderGauge("Vocabulary Mastery", analysis.vocabulary, "bg-[#A98B76]")}
              {renderGauge("Pronunciation Quality", analysis.pronunciation, "bg-amber-500")}
              {renderGauge("Fluency (Kelancaran Aliran)", analysis.fluency, "bg-teal-500")}
              {renderGauge("Structure Logic", analysis.structure, "bg-blue-500")}
              {renderGauge("Vocal Engagement", analysis.engagement, "bg-pink-500")}
            </div>
          </div>

          {/* Core transcribing interactive highlight box */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#BABF94]/30 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-sans">Interactive Speech Transcript</h3>
                <p className="text-[10px] text-slate-400">Klik kosa kata berwarna untuk melihat bimbingan perbaikan grammar & tips kosa kata dari Melo Coach!</p>
              </div>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold">
                Speed: {analysis.speakingPace} WPM
              </span>
            </div>

            <div className="p-4 bg-[#FAF9F6] border rounded-2xl min-h-[140px] shadow-inner relative">
              {renderHighlightsText()}
            </div>

            {/* Quick highlight color map Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-bold">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-red-100 border border-red-350 rounded-md"></span>
                <span>Grammar Slips</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-amber-100 border border-amber-350 rounded-md"></span>
                <span>Filler Words</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-100 border border-indigo-350 rounded-md"></span>
                <span>Repeated words</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#F3E4C9]/70 border border-amber-300 rounded-md"></span>
                <span>Weak Vocabulary Upgrade</span>
              </span>
            </div>
          </div>

          {/* 🎯 AI IMPROVED VERSION (Right Below Transcript) */}
          {analysis.aiImprovedVersion && (
            <div className="bg-emerald-50/40 p-6 rounded-3xl border-2 border-emerald-250/30 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="text-sm font-bold text-slate-800 font-sans">
                  Coach AI's Best Version 🌟
                </h4>
              </div>
              <p className="text-xs text-slate-755 leading-relaxed font-sans italic bg-white p-4 rounded-xl border border-emerald-200/50 shadow-inner">
                "{analysis.aiImprovedVersion}"
              </p>
              <p className="text-[10px] text-slate-400">
                Pahami versi perbaikan di atas untuk mempelajari bagaimana penutur asli merangkai kosa kata dan tata bahasa secara lebih natural dan indah!
              </p>
            </div>
          )}

          {/* 💬 INTERACTIVE FOLLOW-UP QUESTIONS (To Simulate Live Conversation) */}
          {analysis.followUpQuestions && analysis.followUpQuestions.length > 0 && (
            <div className="bg-gradient-to-tr from-indigo-50/50 to-[#FAF8ED] p-6 rounded-3xl border border-indigo-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">💬</span>
                <h4 className="text-sm font-bold text-slate-800 font-sans">
                  Pertanyaan Lanjutan (Lanjutkan Percakapan)
                </h4>
              </div>
              <p className="text-xs text-slate-500 font-sans leading-normal">
                Bagus sekali! Untuk menumbuhkan kelancaran alami seperti mengobrol sungguhan, pilih salah satu tindak lanjut di bawah ini untuk berlatih spontan saat ini juga:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {analysis.followUpQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onStartPracticeFollowUp) {
                        onStartPracticeFollowUp(q);
                      }
                    }}
                    className="text-left w-full p-3.5 bg-white hover:bg-indigo-50 border border-slate-205 hover:border-indigo-300 rounded-2xl text-xs font-semibold text-slate-700 transition flex items-center justify-between hover:scale-[1.005] hover:shadow-sm"
                  >
                    <span>{q}</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full shrink-0 font-bold ml-2">Latih Sekarang 🎤</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: Supportive Coach guidance and advice (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Interactive Tooltip Card showing correction details */}
          {selectedHighlight ? (
            <div className="bg-[#FAF8ED] p-5 rounded-3xl border-2 border-dashed border-[#BFA28C] space-y-4 shadow-sm animate-scale-up">
              <div className="flex justify-between items-center border-b pb-2 border-dashed border-[#BFA28C]/30">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#BABF94] text-[#333C14]">
                  {selectedHighlight.type} correction
                </span>
                <button 
                  onClick={() => setSelectedHighlight(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  X
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Spoken Phrase (Sebab):</p>
                <div className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl text-red-700 text-xs font-bold font-mono">
                  "{selectedHighlight.text}"
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Correction Suggestion (Solusi):</p>
                <div className="bg-emerald-55 border border-emerald-100 px-3 py-1.5 rounded-xl text-emerald-800 text-xs font-bold font-mono bg-emerald-50">
                  "{selectedHighlight.suggestion || '[pause / skip label]'}"
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Coach Explanation:</p>
                <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">"{selectedHighlight.explanation}"</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-3xl border border-dashed text-center space-y-2 py-8 text-slate-400 text-xs">
              <div className="text-3xl">💡</div>
              <p className="font-bold text-slate-705">Melo Coach Assistant</p>
              <p className="text-[10px] leading-relaxed">Klik panel kata yang bergaris putus-putus pada transkrip sebelah kiri untuk menampilkan rincian bimbingan perbaikan secara instan!</p>
            </div>
          )}

          {/* Coach's cozy summary advice letter */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <span>☘️ Coach's Cozy Summary</span>
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed font-sans italic">
              "{analysis.feedback}"
            </p>

            <div className="border-t pt-3 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">👍 Kelebihanmu:</p>
                <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-1 mt-1 leading-relaxed">
                  {analysis.positives.map((pos, i) => (
                    <li key={i}>{pos}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">🎯 Perlu Ditingkatkan:</p>
                <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-1 mt-1 leading-relaxed">
                  {analysis.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
