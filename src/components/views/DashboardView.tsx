import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, BookOpen, Clock, Award, Star, TrendingUp } from "lucide-react";
import { UserProfile, UserStats, VocabularyWord, CEFRLevel } from "../../types";
import { getVocabulary } from "../../lib/dbService";

interface DashboardViewProps {
  profile: UserProfile;
  stats: UserStats;
  theme: string;
  onNavigate: (view: string) => void;
  accentBtn: string;
  secondaryBtn: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile, stats, theme, onNavigate, accentBtn, secondaryBtn
}) => {
  const [dailyWord, setDailyWord] = useState<VocabularyWord | null>(null);

  useEffect(() => {
    getVocabulary(profile.email).then((words) => {
      if (words.length > 0) {
        // Pick a word based on current date
        const dayIdx = new Date().getDate() % words.length;
        setDailyWord(words[dayIdx]);
      }
    });
  }, [profile.email]);

  // Compute planting size based on topics completed
  const getCloverGrowthStage = () => {
    const completed = stats.completedTopicsCount;
    if (completed === 0) return { title: "Sprout (Kecambah)", emoji: "🌱", desc: "Selesaikan 1 latihan speaking untuk menumbuhkan tunas semanggi pertamamu!" };
    if (completed < 3) return { title: "Dua Kelopak", emoji: "🌿", desc: "Semanggimu mulai rimbun! Selesaikan 3 latihan untuk kelopak ketiga." };
    if (completed < 6) return { title: "Lucky 3-Leaf Clover", emoji: "☘️", desc: "Sudah tumbuh menjadi semanggi biasa! Selesaikan 6 latihan untuk memanggil tuah Semanggi 4 Kelopak." };
    return { title: "Legendary 4-Leaf Clover!", emoji: "🍀", desc: "Luar biasa! Kamu menumbuhkan Semanggi Keberuntungan berkat ketekunan melatih speaking Bahasa Inggris." };
  };

  const growth = getCloverGrowthStage();

  // Compute CEFR level display helper
  const cefrNames: Record<CEFRLevel, string> = {
    "A1": "Beginner (Sangat Dasar)",
    "A2": "Elementary (Dasar)",
    "B1": "Intermediate (Menengah)",
    "B2": "Upper Intermediate (Menengah Atas)",
    "C1": "Advanced (Kefasihan Tinggi)",
    "C2": "Mastery (Kemampuan Mirip Native)"
  };

  const formatStatsDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec}s`;
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 👋 Welcome Banner with Star Glow */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#BABF94]/30 rounded-2xl shadow-sm relative">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-800">
              Halo, {profile.username}! {profile.currentLevel === "C1" || profile.currentLevel === "B2" ? "🌟" : "🍀"}
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            {profile.bio || "Mari mulai bicara Bahasa Inggris perlahan tanpa perlu merasa takut bersalah."}
          </p>
        </div>

        {/* CEFR Flag Badge */}
        <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-full border shadow-sm">
          <Award className="w-5 h-5 text-amber-500 animate-pulse" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peringkat CEFR</div>
            <div className="text-xs font-bold text-slate-700">{profile.currentLevel} - {cefrNames[profile.currentLevel]}</div>
          </div>
        </div>
      </div>

      {/* 📊 High-Contrast Bento Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Streak Grid */}
        <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center space-x-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <span className="text-2xl animate-bounce">🔥</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Daily Streak</div>
            <div className="text-xl font-bold text-slate-800">{stats.dailyStreak} Hari</div>
          </div>
          <div className="absolute top-1 right-2 text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">STREAKING</div>
        </div>

        {/* Speaking Practice Time */}
        <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Speaking</div>
            <div className="text-lg font-bold text-slate-800">{formatStatsDuration(stats.totalSpeakingTime)}</div>
          </div>
        </div>

        {/* Completed Targets */}
        <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Topik Selesai</div>
            <div className="text-xl font-bold text-slate-800">{stats.completedTopicsCount} Sesi</div>
          </div>
        </div>

        {/* Mastery XP Score */}
        <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Star className="w-6 h-6 fill-amber-300 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">Melo Score</div>
            <div className="text-xl font-bold text-slate-800">{stats.overallScore || 70} XP</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 🌱 LEFT: Clover Garden Growth Dashboard (6 cols) */}
        <div className="md:col-span-7 bg-white/80 p-6 rounded-3xl border border-[#BABF94]/30 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <span>🍀 Personal Clover Garden</span>
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">GAMIFIED GROWTH</span>
            </h2>
            <p className="text-xs text-slate-400">Menanam kebiasaan berbicara Bahasa Inggris. Makin giat berlatih, semanggimu makin berkembang!</p>
          </div>

          {/* Graphical Growth Stage Container */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50/20 to-emerald-50/20 border-2 border-dashed border-emerald-100 rounded-2xl text-center space-y-4">
            <div className="text-7xl select-none animate-bounce" style={{ animationDuration: "3s" }}>
              {growth.emoji}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-emerald-800">{growth.title}</h3>
              <p className="text-xs text-slate-500 max-w-sm">{growth.desc}</p>
            </div>

            {/* Growth progress Bar */}
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Progress Kelopak</span>
                <span>{stats.completedTopicsCount} / 6 Latihan</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((stats.completedTopicsCount / 6) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("topics")}
            className={`w-full py-3 rounded-xl font-bold tracking-wide text-xs ${accentBtn}`}
          >
            🎲 SPIN DAN MULAI BICARA SEKARANG
          </button>
        </div>

        {/* 📚 RIGHT: study companion block (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Daily Word of the day */}
          {dailyWord && (
            <div className="bg-gradient-to-br from-[#FAF9F6] to-[#F1F3E9] p-5 rounded-2xl border border-[#BFA28C]/30 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#A98B76] uppercase tracking-widest">
                  <BookOpen className="w-4 h-4" />
                  <span>Kosa Kata Hari Ini</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#BABF94] text-[#333C14]">{dailyWord.difficulty}</span>
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 hover:text-amber-700 transition" style={{ fontFamily: "var(--font-sans)" }}>{dailyWord.word}</h3>
                  <code className="text-xs font-mono text-slate-400 bg-white/70 px-1.5 py-0.5 rounded-md">{dailyWord.pronunciation}</code>
                </div>
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{dailyWord.meaning}</p>
                </div>
                <div className="p-3 bg-white/80 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Contoh Kalimat</p>
                  <p className="text-xs text-[#5C4033] italic mt-0.5 font-sans">"{dailyWord.example}"</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate("vocab")}
                className={`py-2 rounded-xl text-xs font-semibold ${secondaryBtn}`}
              >
                Kunjungi Vocabulary Center
              </button>
            </div>
          )}

          {/* 🌸 Small nature quotes */}
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex flex-col justify-center space-y-1">
            <h4 className="text-xs font-semibold text-amber-800 flex items-center space-x-1">
              <span>✨ Refleksi Hari Ini</span>
            </h4>
            <p className="text-xs text-slate-500 italic">
              "Kesalahan bicara adalah tanda bahwa kamu sedang aktif mendorong otakmu untuk menyesuaikan diri dengan pola bahasa baru. Teruskan perjuanganmu, speak happily!"
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
