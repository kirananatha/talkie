import React, { useState } from "react";
import { UserProfile, UserStats } from "../../types";
import { Award, Zap, Trophy, TrendingUp, Sparkles } from "lucide-react";

interface LeaderboardProps {
  profile: UserProfile;
  stats: UserStats;
}

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  country: string;
  score: number;
  isCurrentUser?: boolean;
}

const MOCK_LEADER_WEEKLY: LeaderboardUser[] = [
  { rank: 1, username: "Grace ✨", avatar: "🕊️", country: "SG", score: 780 },
  { rank: 2, username: "Bimo ☕", avatar: "☕", country: "ID", score: 620 },
  { rank: 3, username: "Cynthia 🎀", avatar: "🌸", country: "ID", score: 450 },
  { rank: 4, username: "Anya Clover", avatar: "🍀", country: "ID", score: 320 },
  { rank: 5, username: "Kenji 🐳", avatar: "🐳", country: "JP", score: 290 }
];

const MOCK_LEADER_MONTHLY: LeaderboardUser[] = [
  { rank: 1, username: "Bimo ☕", avatar: "☕", country: "ID", score: 2400 },
  { rank: 2, username: "Grace ✨", avatar: "🕊️", country: "SG", score: 1980 },
  { rank: 3, username: "Kenji 🐳", avatar: "🐳", country: "JP", score: 1850 },
  { rank: 4, username: "Cynthia 🎀", avatar: "🌸", country: "ID", score: 1420 },
  { rank: 5, username: "Anya Clover", avatar: "🍀", country: "ID", score: 1100 }
];

export const LeaderboardView: React.FC<LeaderboardProps> = ({
  profile, stats
}) => {
  const [activeSegment, setActiveSegment] = useState<'weekly' | 'monthly'>('weekly');

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "text-xl font-bold text-amber-500";
    if (rank === 2) return "text-lg font-bold text-slate-400";
    if (rank === 3) return "text-base font-bold text-amber-700";
    return "text-xs font-semibold text-slate-500";
  };

  const getLeaderboardList = (): LeaderboardUser[] => {
    const rawList = activeSegment === "weekly" ? MOCK_LEADER_WEEKLY : MOCK_LEADER_MONTHLY;
    const userScore = stats.overallScore || 150;

    // Check if user is already in list
    const hasUser = rawList.some((u) => u.username === profile.username);
    if (hasUser) return rawList;

    const userObj: LeaderboardUser = {
      rank: 6, // default
      username: `${profile.username} (You)`,
      avatar: profile.profilePic || "🍀",
      country: profile.country || "ID",
      score: userScore,
      isCurrentUser: true
    };

    // Sort combined list with user
    const combined = [...rawList, userObj].sort((a, b) => b.score - a.score);
    // Re-assign ranks
    return combined.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  };

  const currentList = getLeaderboardList();

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 🥇 Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1.5Class">
            <span>🥇 MeloTalk Global Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-400">Pacu kebersamaan belajarmu bersama ratusan siswa MeloTalk global. Terus latihan berbicara untuk mengklaim gelar Jawara!</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-[#FAF9F6] p-1.5 rounded-xl border border-slate-150 w-full max-w-xs">
          <button
            onClick={() => setActiveSegment('weekly')}
            className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSegment === 'weekly' ? "bg-white text-slate-800 shadow" : "text-slate-400"
            }`}
          >
            Weekly Class
          </button>
          <button
            onClick={() => setActiveSegment('monthly')}
            className={`w-1/2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSegment === 'monthly' ? "bg-white text-slate-800 shadow" : "text-slate-400"
            }`}
          >
            Monthly Pro
          </button>
        </div>
      </div>

      {/* Scoreboard table presentation */}
      <div className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-400">KELAS SPEAKING GLOBAL</span>
          <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 fill-amber-300" />
            <span>XP Diperbarui Instan</span>
          </span>
        </div>

        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20">
              <th className="py-3 px-6 text-center w-20">Peringkat</th>
              <th className="py-3 px-4">Nama Siswa</th>
              <th className="py-3 px-4 text-center">Negara</th>
              <th className="py-3 px-6 text-right">Skala Prestasi XP</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((usr) => (
              <tr 
                key={usr.username}
                className={`border-b border-slate-100 font-sans transition-all ${
                  usr.isCurrentUser 
                    ? "bg-[#FAF8ED] hover:bg-[#F3E4C9]/40 border-l-4 border-l-amber-500 font-bold" 
                    : "hover:bg-slate-50/70"
                }`}
              >
                <td className="py-4 px-6 text-center">
                  <span className={getRankStyle(usr.rank)}>
                    {usr.rank === 1 ? "🥇" : usr.rank === 2 ? "🥈" : usr.rank === 3 ? "🥉" : usr.rank}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden bg-slate-100 shrink-0 select-none">
                      {usr.avatar && usr.avatar.startsWith("data:") ? (
                        <img src={usr.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-xl leading-none">{usr.avatar || "🍀"}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{usr.username}</span>
                  </div>
                </td>

                <td className="py-4 px-4 text-center">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
                    {usr.country}
                  </span>
                </td>

                <td className="py-4 px-6 text-right">
                  <span className="text-xs font-mono px-3 py-1 font-black text-amber-900 bg-[#F3E4C9] rounded-full">
                    {usr.score} XP
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
