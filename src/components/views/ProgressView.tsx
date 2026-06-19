import React, { useState, useEffect } from "react";
import { UserStats, UserProfile, SpeechHistoryItem } from "../../types";
import { getStats, getSpeechHistory } from "../../lib/dbService";
import { Award, TrendingUp, Calendar, Clock, Star, Play, Library } from "lucide-react";

interface ProgressViewProps {
  userId: string;
  stats: UserStats;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  userId, stats
}) => {
  const [history, setHistory] = useState<SpeechHistoryItem[]>([]);

  useEffect(() => {
    getSpeechHistory(userId).then(setHistory);
  }, [userId]);

  // Calculate average component scores across all attempts
  const calculateAverages = () => {
    if (history.length === 0) {
      return { clarity: 60, confidence: 65, grammar: 55, vocabulary: 58, pronunciation: 62, fluency: 60, overall: 60 };
    }
    let totalClarity = 0, totalConfidence = 0, totalGrammar = 0, totalVocabulary = 0, totalPronunciation = 0, totalFluency = 0;
    history.forEach((record) => {
      totalClarity += record.analysis.clarity;
      totalConfidence += record.analysis.confidence;
      totalGrammar += record.analysis.grammar;
      totalVocabulary += record.analysis.vocabulary;
      totalPronunciation += record.analysis.pronunciation;
      totalFluency += record.analysis.fluency;
    });

    const len = history.length;
    return {
      clarity: Math.round(totalClarity / len),
      confidence: Math.round(totalConfidence / len),
      grammar: Math.round(totalGrammar / len),
      vocabulary: Math.round(totalVocabulary / len),
      pronunciation: Math.round(totalPronunciation / len),
      fluency: Math.round(totalFluency / len),
      overall: Math.round(stats.overallScore) || 75
    };
  };

  const avgs = calculateAverages();

  // Draw customized SVG line chart depicting score progress over time
  const renderProgressChart = () => {
    if (history.length === 0) {
      return (
        <div className="text-center py-10 text-slate-400 text-xs">
          Butuh minimal 1 sesi rekaman untuk melihat pola statistik peningkatan bicaramu!
        </div>
      );
    }

    // Take last 7 items
    const chartData = [...history].reverse().slice(0, 7);
    const chartHeight = 120;
    const chartWidth = 500;
    const padding = 20;

    return (
      <div className="w-full overflow-x-auto no-scrollbar py-2">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[340px] h-32">
          {/* Horizontal Gridlines */}
          {[0, 0.5, 1].map((scale, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + scale * (chartHeight - padding * 2)}
              x2={chartWidth - padding}
              y2={padding + scale * (chartHeight - padding * 2)}
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />
          ))}

          {/* Draw connecting lines & circles */}
          {chartData.map((record, idx) => {
            const count = chartData.length;
            const x = padding + (idx / Math.max(1, count - 1)) * (chartWidth - padding * 2);
            // Flip score so low is bottom (e.g. 50 score is half way)
            const y = chartHeight - padding - (record.analysis.overallScore / 100) * (chartHeight - padding * 2);

            const next = chartData[idx + 1];
            let lineElem = null;
            if (next) {
              const nx = padding + ((idx + 1) / Math.max(1, count - 1)) * (chartWidth - padding * 2);
              const ny = chartHeight - padding - (next.analysis.overallScore / 100) * (chartHeight - padding * 2);
              lineElem = (
                <line
                  key={`line-${idx}`}
                  x1={x}
                  y1={y}
                  x2={nx}
                  y2={ny}
                  stroke="#BABF94"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            }

            return (
              <g key={record.id}>
                {lineElem}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  className="fill-amber-600 stroke-white hover:r-6 cursor-pointer"
                  style={{ transition: "all 0.15s" }}
                >
                  <title>{`Skor Sesi: ${record.analysis.overallScore} (${record.category})`}</title>
                </circle>
                <text
                  x={x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="7"
                  className="font-mono"
                >
                  {new Date(record.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 📈 Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-1">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
          <span>📈 Analytical Progress Dashboard</span>
        </h2>
        <p className="text-xs text-slate-400">Tinjau grafik kemajuan belajarmu, nilai rata-rata tiap aspek kelancaran bicaramu, dan kumpulkan skor menuju CEFR tingkat lanjut!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (8 cols) - Progress chart & Metrics Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Consistency Line Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700">Grafik Skor Speaking Sesi Terakhir</h3>
              <p className="text-xs text-slate-400">Menampilkan tren perkembangan skor bicaramu untuk 7 sesi terakhir.</p>
            </div>
            {renderProgressChart()}
          </div>

          {/* Average Component Scores */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Rataan Aspek Speaking Kamu</h3>
            
            <div className="space-y-3.5">
              {[
                { label: "Kejelasan Pengucapan (Clarity)", val: avgs.clarity, desc: "Seberapa baik caramu memproduksi bunyi fonem konsonan-vokal bahasa Inggris." },
                { label: "Tingkat Percaya Diri (Confidence)", val: avgs.confidence, desc: "Diukur berdasarkan kestabilan intonasi dan penghentian kalimat yang lugas." },
                { label: "Tatabahasa (Grammar Accuracy)", val: avgs.grammar, desc: "Ketepatan tata bahasa dan kesesuaian subjek-predikat pembicaraan." },
                { label: "Kelancaran Berbicara (Fluency Flow)", val: avgs.fluency, desc: "Ritme alur kata dan keberhasilan meminimalisasi jeda filler words berlebihan." }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <span className="font-bold text-slate-705 block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal leading-none">{item.desc}</span>
                    </div>
                    <span className="font-black font-mono text-slate-700">{item.val} / 100</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#BABF94] h-full rounded-full"
                      style={{ width: `${item.val}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column (4 cols) - Consistency and Streak updates */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Consistency Badge widgets */}
          <div className="bg-gradient-to-tr from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-[#BABF94]/40 text-center space-y-4">
            <div className="text-5xl animate-bounce" style={{ animationDuration: "4s" }}>🏆</div>
            <div>
              <span className="text-[9px] bg-amber-200/60 text-amber-900 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Level CEFR Saat Ini</span>
              <h3 className="text-xl font-bold text-slate-800 mt-2">Intermediate High (B1)</h3>
              <p className="text-xs text-slate-400 mt-1">Selesaikan 5 kuis pelajaran kosakata tambahan untuk menguji kelayakan promosi ke peringkat B2!</p>
            </div>

            <div className="bg-white/80 border p-3 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Rata-Rata Skor AI:</span>
              <span className="font-black text-amber-800">{avgs.overall} / 100</span>
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-white p-5 rounded-2xl border flex items-start space-x-2.5">
            <span className="text-xl">🌿</span>
            <div>
              <h4 className="text-xs font-bold text-slate-700">Melo Practice Tip</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Berbicara sesingkat 1 menit sehari secara ajek terbukti lebih meningkatkan memori otot mulut dibanding 30 menit sekali seminggu saja!</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
