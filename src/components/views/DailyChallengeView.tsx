import React, { useState, useEffect } from "react";
import { DailyChallenge, SpeakingTopic, SpeechAnalysis, HighlightItem } from "../../types";
import { getChallenges, saveChallenge } from "../../lib/dbService";
import { Calendar, Award, Star, ToggleLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { VoiceRecorder } from "../VoiceRecorder";

interface DailyChallengeViewProps {
  userId: string;
  onAnalysisSuccess: (
    analysis: SpeechAnalysis,
    base64Audio: string,
    durationSec: number,
    topicText: string,
    category: string,
    transcript: string,
    highlights: HighlightItem[]
  ) => void;
  accentBtn: string;
  secondaryBtn: string;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  userId, onAnalysisSuccess, accentBtn, secondaryBtn
}) => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    getChallenges(userId).then(setChallenges);
  }, [userId]);

  const handleChallengeComplete = (
    analysis: SpeechAnalysis,
    base64Audio: string,
    durationSec: number,
    transcript: string,
    highlights: HighlightItem[]
  ) => {
    if (!activeChallenge) return;

    // Mark challenge as completed in IndexedDB
    const updated = { ...activeChallenge, isCompleted: true };
    saveChallenge(updated, userId).then(() => {
      setChallenges((prev) => prev.map((c) => c.id === activeChallenge.id ? updated : c));
      
      onAnalysisSuccess(
        analysis,
        base64Audio,
        durationSec,
        activeChallenge.prompt.replace("🎤 ", ""),
        "Daily Challenge",
        transcript,
        highlights
      );
      setActiveChallenge(null);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 🎯 Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
          <span>🎯 Daily Speaking Challenges</span>
          <span className="text-[10px] bg-red-500 text-white px-2.5 py-0.5 rounded-full font-bold">DOUBLE XP</span>
        </h2>
        <p className="text-xs text-slate-400">Kerjakan tantangan harian spesial di bawah ini untuk menguji keberanianmu, asah kelancaran, dan dapatkan bonus 150 XP ekstra!</p>
      </div>

      {!activeChallenge ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((chal) => (
            <div 
              key={chal.id}
              className={`p-6 rounded-3xl border-2 flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
                chal.isCompleted 
                  ? "bg-slate-50 border-slate-200" 
                  : "bg-white border-[#BABF94]/30 hover:-translate-y-1 hover:shadow-md"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">TANTANGAN SEKARANG</span>
                  <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-500" />
                    <span>+{chal.rewardXP} XP</span>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-700 leading-relaxed font-sans mt-2">
                  {chal.prompt}
                </p>
              </div>

              {chal.isCompleted ? (
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Selesai Dikerjakan! (+{chal.rewardXP} XP)</span>
                </div>
              ) : (
                <button
                  onClick={() => setActiveChallenge(chal)}
                  className={`w-full py-2.5 font-bold text-xs tracking-wide rounded-xl flex items-center justify-center space-x-2 ${accentBtn}`}
                >
                  <span>Mulai Tantangan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Active Challenge Recorder */
        <div className="flex flex-col items-center space-y-6 animate-scale-up">
          
          <div className="w-full max-w-2xl bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-3xl border-2 border-red-200/40 text-center relative">
            <span className="text-[10px] bg-red-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">Tantangan Aktif</span>
            <h3 className="text-lg font-bold text-slate-800 leading-relaxed max-w-xl mx-auto mt-3 font-sans">
              "{activeChallenge.prompt.replace("🎤 ", "")}"
            </h3>
            <p className="text-xs text-slate-400 mt-2">Selesaikan rekaman speaking ini untuk mengklaim {activeChallenge.rewardXP} XP harian!</p>
            <button
              onClick={() => setActiveChallenge(null)}
              className={`absolute top-3 right-3 text-xs text-slate-400 hover:text-slate-600 font-bold`}
            >
              Batal
            </button>
          </div>

          <div className="w-full max-w-2xl bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <VoiceRecorder 
              topicText={activeChallenge.prompt.replace("🎤 ", "")}
              category="Daily Challenge"
              onAnalysisSuccess={handleChallengeComplete}
              accentBtn={accentBtn}
              secondaryBtn={secondaryBtn}
            />
          </div>

        </div>
      )}

    </div>
  );
};
