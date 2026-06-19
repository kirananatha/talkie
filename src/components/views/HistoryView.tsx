import React, { useState, useEffect, useRef } from "react";
import { SpeechHistoryItem } from "../../types";
import { getSpeechHistory } from "../../lib/dbService";
import { Calendar, Play, Volume2, ArrowRight, ShieldCheck, HelpCircle, Clock, Sparkles } from "lucide-react";

interface HistoryViewProps {
  userId: string;
  onOpenAnalysis: (item: SpeechHistoryItem) => void;
  secondaryBtn: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  userId, onOpenAnalysis, secondaryBtn
}) => {
  const [history, setHistory] = useState<SpeechHistoryItem[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioHTMLRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getSpeechHistory(userId).then(setHistory);
  }, [userId]);

  const handlePlayAudio = (id: string, base64: string) => {
    if (playingId === id) {
      if (audioHTMLRef.current) {
        audioHTMLRef.current.pause();
      }
      setPlayingId(null);
    } else {
      if (audioHTMLRef.current) {
        audioHTMLRef.current.pause();
      }
      const audio = new Audio(`data:audio/webm;base64,${base64}`);
      audioHTMLRef.current = audio;
      audio.onended = () => setPlayingId(null);
      audio.play();
      setPlayingId(id);
    }
  };

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 📝 Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-1">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
          <span>📝 Speeches & Recording History</span>
        </h2>
        <p className="text-xs text-slate-400">Jejak latihan bicaramu. Klik rekam suara lamamu untuk mendengarkan kembali suaramu, atau klik 'Lihat Diagnosis AI' untuk meninjau transkrip interaktif!</p>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <div 
            key={record.id}
            className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                  {record.category}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(record.timestamp)}</span>
                </span>
                <span className="text-[9px] font-semibold text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatSec(record.duration)}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-700 leading-relaxed font-sans">
                "{record.topicText}"
              </h3>
              
              <p className="text-xs text-slate-400 line-clamp-1 italic font-sans">
                Transcript: "{record.transcript}"
              </p>
            </div>

            {/* Speaking results badge & Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
              <div className="text-center bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-xl">
                <div className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Skor AI</div>
                <div className="text-sm font-black text-emerald-600">{record.analysis.overallScore}</div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePlayAudio(record.id, record.audioBase64)}
                  className={`p-2.5 rounded-full ${secondaryBtn} text-slate-700 flex items-center justify-center`}
                  title={playingId === record.id ? "Pause" : "Play Recording"}
                >
                  <Volume2 className={`w-4 h-4 ${playingId === record.id ? "animate-bounce text-emerald-600" : ""}`} />
                </button>

                <button
                  onClick={() => onOpenAnalysis(record)}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 hover:bg-slate-700 transition"
                >
                  <span>Diagnosis AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-16 p-8 bg-white rounded-3xl border-2 border-dashed border-[#BABF94]/30 text-slate-500 max-w-md mx-auto">
            <div className="text-5xl mb-4 animate-bounce">🍀</div>
            <h3 className="text-md font-bold text-slate-800 font-sans">Start your first speaking practice 🍀</h3>
            <p className="text-xs text-slate-450 leading-relaxed mt-2 font-sans">
              Belum ada riwayat rekaman yang terdeteksi. Jangan ragu! Putar rekomendasi topik semanggi kami, rekam suaramu selama beberapa detik, dan dapatkan analisis tulus dari MeloTalk AI Coach!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
