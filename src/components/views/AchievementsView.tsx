import React, { useState, useEffect } from "react";
import { Achievement, UserStats } from "../../types";
import { getAchievements, getStats } from "../../lib/dbService";
import { Award, Lock, CheckCircle, Star, Sparkles } from "lucide-react";

interface AchievementsViewProps {
  stats: UserStats;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  stats
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    getAchievements().then((list) => {
      // Evaluate lock/unlock states based on live user statistics!
      const evaluated = list.map((ach) => {
        let unlocked = ach.unlocked;

        if (ach.id === "ach_first_rec") {
          unlocked = stats.completedTopicsCount >= 1; // "First Recording"
        } else if (ach.id === "ach_streak_7") {
          unlocked = stats.dailyStreak >= 7; // "7 Day Streak"
        } else if (ach.id === "ach_streak_30") {
          unlocked = stats.dailyStreak >= 30; // "30 Day Streak"
        } else if (ach.id === "ach_vocab_master") {
          unlocked = stats.vocabularyMasteredCount >= 5; // "Vocabulary Master"
        } else if (ach.id === "ach_interview_expert") {
          unlocked = stats.completedTopicsCount >= 5; // "Interview Expert"
        } else if (ach.id === "ach_topics_100") {
          unlocked = stats.completedTopicsCount >= 15; // "100 Topics Completed" (representing highly advanced)
        } else if (ach.id === "ach_c1_speaker") {
          unlocked = stats.overallScore >= 350; // "C1 Speaker"
        }

        return {
          ...ach,
          unlocked: unlocked,
          unlockedAt: unlocked ? (ach.unlockedAt || new Date().toLocaleDateString("id-ID")) : null
        };
      });

      setAchievements(evaluated);
    });
  }, [stats]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / Math.max(1, achievements.length)) * 105) % 101; // normalise to 100

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 🏆 Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1.5 border-b pb-2">
            <span>🏆 Achievements & Medallions</span>
          </h2>
          <p className="text-xs text-slate-400">Pacu dirimu melampaui batas! Dapatkan lencana prestasi seiring latihan konsisten yang kamu raih di MeloTalk.</p>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 max-w-md">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Lencana Terbuka</span>
            <span>{unlockedCount} / {achievements.length} Terkumpul ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-[#BABF94] h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grid of Achievement Medal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div 
            key={ach.id}
            className={`p-6 rounded-3xl border-2 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-300 ${
              ach.unlocked 
                ? "bg-white border-[#BABF94]/40 shadow-sm" 
                : "bg-slate-50/50 border-slate-200/60"
            }`}
          >
            {/* Status indicator badge (checkmark or lock) */}
            <div className="flex items-start justify-between">
              <div className="p-3 bg-[#F3E4C9]/40 rounded-2xl">
                <span className="text-4xl select-none" style={{ opacity: ach.unlocked ? 1 : 0.35 }}>
                  {ach.badge || "🏆"}
                </span>
              </div>

              {ach.unlocked ? (
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-emerald-100">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>TERBUKA</span>
                </span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-slate-450 font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400 font-bold">TERKUNCI</span>
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className={`text-base font-bold ${ach.unlocked ? "text-slate-800" : "text-slate-400"}`}>
                {ach.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {ach.description}
              </p>
            </div>

            {ach.unlocked && (
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>DIPEROLEH PADA:</span>
                <span>{ach.unlockedAt || new Date().toLocaleDateString("id-ID")}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
