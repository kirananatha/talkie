import React from "react";
import { UserProfile, ThemeType } from "../../types";
import { Layout, Palette, ArrowRight, ShieldAlert, Sparkles, Star } from "lucide-react";

interface ProfileViewProps {
  profile: UserProfile | null;
  accentBtn: string;
  theme?: ThemeType;
  onNavigate?: (tab: string) => void;
  onContinueToApp?: () => void;
  isSidebarMode?: boolean;
}

const THEME_METADATA: Record<ThemeType, {
  name: string;
  icon: string;
  bgDesc: string;
  fontName: string;
  accentColor: string;
  accentHex: string;
  previewBg: string;
  previewCard: string;
}> = {
  clover: {
    name: "Lucky Clover",
    icon: "🍀",
    bgDesc: "Sage Green & Cream Gradient",
    fontName: "Poppins / Inter",
    accentColor: "Soft Sage",
    accentHex: "#BABF94",
    previewBg: "bg-gradient-to-tr from-[#FAF8ED] via-[#F3E4C9] to-[#E2E6CC]",
    previewCard: "bg-white/95 border border-[#BABF94]/70 shadow-xs"
  },
  koi: {
    name: "Koi Garden",
    icon: "🐟",
    bgDesc: "Coral Peach Sunset Glow",
    fontName: "Poppins / Georgia",
    accentColor: "Coral Orange",
    accentHex: "#FF7F50",
    previewBg: "bg-[#FFF5EE] bg-gradient-to-br from-[#FFF5EE] via-[#FFE4E1] to-[#FFF8DC]",
    previewCard: "bg-white/95 border border-[#BFA28C]/40"
  },
  polka: {
    name: "Polka Dot",
    icon: "⚪",
    bgDesc: "Retro High-Contrast Dots",
    fontName: "JetBrains Mono / Space Mono",
    accentColor: "Retro Cyan",
    accentHex: "#38BDF8",
    previewBg: "bg-[#F0F4F8] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]",
    previewCard: "bg-white border-2 border-slate-700 shadow-[4px_4px_0px_#334155]"
  },
  notebook: {
    name: "Ruled Notebook",
    icon: "📓",
    bgDesc: "Classic Classroom Ruled Paper",
    fontName: "Poppins / Georgia",
    accentColor: "Rose Pink",
    accentHex: "#F43F5E",
    previewBg: "bg-[#FAF9F6] bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:100%_24px]",
    previewCard: "bg-white border-l-[8px] border-l-red-400 border border-slate-200"
  },
  nature: {
    name: "Soft Nature",
    icon: "🌿",
    bgDesc: "Quiet Botanical Forest Green",
    fontName: "Poppins",
    accentColor: "Botanical Sage",
    accentHex: "#8DA47E",
    previewBg: "bg-gradient-to-b from-[#E8F0E6] to-[#CBDCC4]",
    previewCard: "bg-stone-50/95 border border-[#8DA47E]"
  },
  minimal: {
    name: "Minimalist Clear",
    icon: "✨",
    bgDesc: "Monochrome Sleek Ultra Slim",
    fontName: "System-UI Light",
    accentColor: "Onyx Black",
    accentHex: "#111111",
    previewBg: "bg-[#FBFBFB]",
    previewCard: "bg-white border border-neutral-200 shadow-xs"
  },
  cute: {
    name: "Cute Gen Z",
    icon: "🎀",
    bgDesc: "Pastel Lavender Star Dream",
    fontName: "Poppins Bold",
    accentColor: "Pastel Pink",
    accentHex: "#FF8DA1",
    previewBg: "bg-gradient-to-tr from-[#E0C3FC] via-[#FCE4EC] to-[#FFF0F5]",
    previewCard: "bg-white/95 border-2 border-[#FF8DA1] shadow-[3px_3px_0px_#FF8DA1]"
  }
};

const PERSONALITY_BADGES: Record<string, { text: string; icon: string; color: string; desc: string }> = {
  "Book Worm": { text: "Book Worm", icon: "📚", color: "bg-rose-50 text-rose-700 border-rose-200", desc: "Likes clear academic dictionary explanations." },
  "Creative Soul": { text: "Creative Soul", icon: "🎨", color: "bg-purple-50 text-purple-700 border-purple-200", desc: "Loves artistic descriptions and poetic analogies." },
  "Daily Speaker": { text: "Daily Speaker", icon: "🗣️", color: "bg-emerald-50 text-emerald-700 border-emerald-200", desc: "Thrives in talkative, warm, fluid conversations." },
  "Language Explorer": { text: "Language Explorer", icon: "🌍", color: "bg-blue-50 text-blue-700 border-blue-200", desc: "Enjoys cultural exchange and global idioms." },
  "Coffee Talker": { text: "Coffee Talker", icon: "☕", color: "bg-amber-50 text-amber-700 border-amber-200", desc: "Calm, casual conversational style over real espresso." },
  "Confident Speaker": { text: "Confident Speaker", icon: "⚡", color: "bg-yellow-50 text-yellow-800 border-yellow-200", desc: "Direct, dynamic, high-energy vocabulary feedback." }
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  accentBtn,
  theme,
  onNavigate,
  onContinueToApp,
  isSidebarMode = false
}) => {
  const activeThemeKey: ThemeType = theme || profile?.theme || ("" as any);
  const activeThemeMeta = THEME_METADATA[activeThemeKey];

  // ⚠️ EMPTY STATE HANDLING - If NO theme exists
  if (!profile || !profile.onboardingCompleted || !activeThemeMeta) {
    return (
      <div className="min-h-[85vh] w-full flex flex-col items-center justify-center p-8 bg-[#FAF8ED] text-center animate-fade-in font-sans select-none">
        <div className="max-w-md bg-white border border-[#BABF94]/30 rounded-[2.5rem] p-10 shadow-xs space-y-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#FAF8ED] flex items-center justify-center text-4xl shadow-inner animate-pulse">
            🎨
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-[#4A3E3D] tracking-tight">
              Belum ada profile yang dikustomisasi
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Silakan rancang & personalisasikan tema visual Anda terlebih dahulu melalui menu pengaturan.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate("settings");
              }
            }}
            className="w-full py-3.5 px-6 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs tracking-widest uppercase rounded-2xl shadow-[0_4px_14px_rgba(139,92,246,0.25)] transition-all active:scale-95"
            id="go-to-theme-settings"
          >
            Go to Theme Settings
          </button>
        </div>
      </div>
    );
  }

  // Extract personality settings match
  const selectedBadgeName = profile.badge || "Book Worm";
  const badgeInfo = PERSONALITY_BADGES[selectedBadgeName] || PERSONALITY_BADGES["Book Worm"];

  return (
    <div className={`w-full select-none font-sans animate-fade-in ${
      isSidebarMode 
        ? "min-h-[85vh] flex flex-col items-center justify-start py-4 px-4" 
        : "fixed inset-0 z-50 overflow-y-auto bg-[#FAF9F5] h-full"
    }`}>
      
      {/* Visual background pattern decorations */}
      {!isSidebarMode && (
        <div className="absolute inset-0 bg-[#FAF9F5] bg-[radial-gradient(#E2E6CC_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>
      )}

      {/* Center wrapper for full-screen view */}
      <div className={isSidebarMode ? "w-full flex flex-col items-center justify-start" : "min-h-full w-full flex flex-col items-center justify-start md:justify-center p-4 md:p-8 relative z-10"}>
        
        {/* Main Elegant Identity Centered Card */}
        <div 
          className="relative z-10 w-full max-w-md bg-white border border-neutral-200/60 rounded-[3rem] p-8 md:p-10 shadow-[0_16px_40px_rgba(186,191,148,0.15)] flex flex-col items-center text-center gap-7 transition-all duration-300 my-auto"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
        
        {/* Glow halo behind Avatar */}
        <div className="relative">
          <div 
            className="absolute inset-n2 rounded-full blur-xl scale-110 opacity-20 animate-pulse"
            style={{ backgroundColor: activeThemeMeta.accentHex, transitionDuration: "4s" }}
          ></div>
          {/* Avatar Ring */}
          <div 
            className="relative w-28 h-28 rounded-full border-3 bg-white flex items-center justify-center text-6xl shadow-md z-10"
            style={{ borderColor: activeThemeMeta.accentHex }}
          >
            <span>{profile.profilePic || "🍀"}</span>
          </div>
          {/* Sparkles indicator */}
          <span className="absolute -bottom-1 -right-1 text-2xl filter drop-shadow-sm select-none">✨</span>
        </div>

        {/* Identity Details */}
        <div className="space-y-1.5 w-full">
          <h2 className="text-2xl font-extrabold text-neutral-800 tracking-tight">
            {profile.username || "MeloTalker"}
          </h2>
          <div className="flex justify-center items-center gap-1.5 py-0.5">
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Speaking Level {profile.currentLevel || "A1"}
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans italic px-4 mt-2 max-w-sm mx-auto leading-relaxed">
            "{profile.bio || "Optimizing casual dialogue skills using premium artificial intelligence."}"
          </p>
        </div>

        {/* Divider line */}
        <div className="w-full border-t border-neutral-150/40"></div>

        {/* Selected Theme Details Container */}
        <div className="w-full space-y-2.5 text-left">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">
            ACTIVE VISUAL THEME
          </span>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 font-sans">
            <div className="flex items-center space-x-3">
              <span className="text-3xl filter drop-shadow-xs">{activeThemeMeta.icon}</span>
              <div>
                <h4 className="text-xs font-black text-neutral-700 uppercase tracking-wide">
                  {activeThemeMeta.name}
                </h4>
                <p className="text-[10.5px] text-neutral-400 block font-sans leading-none mt-0.5 truncate">
                  {activeThemeMeta.bgDesc}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 shrink-0 bg-white border border-neutral-100 px-2.5 py-1 rounded-full text-[9px] font-bold text-purple-600">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
              <span>LIVE</span>
            </div>
          </div>
        </div>

        {/* Personality Badge Display */}
        <div className="w-full space-y-2.5 text-left">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">
            SELECTED ENGLISH SPEAKING PERSONALITY
          </span>
          
          <div className={`p-4 rounded-2xl border flex items-start space-x-3.5 shadow-5xs ${badgeInfo.color}`}>
            <span className="text-3xl leading-none scale-105 select-none shrink-0 pt-0.5">{badgeInfo.icon}</span>
            <div className="space-y-0.5 overflow-hidden">
              <h4 className="text-xs font-black uppercase tracking-wider leading-none">
                {badgeInfo.text} Mode
              </h4>
              <p className="text-[10.5px] leading-relaxed font-sans opacity-85">
                {badgeInfo.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="w-full border-t border-neutral-150/40"></div>

        {/* Primary Screen Gateway Button */}
        <div className="w-full">
          {isSidebarMode ? (
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate("topics");
                }
              }}
              className="w-full py-4 rounded-2.5xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-extrabold text-xs tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-sm"
            >
              Back to Learning Space
            </button>
          ) : (
            <button
              onClick={onContinueToApp}
              className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs tracking-widest uppercase flex items-center justify-center space-x-1.5 transition-all duration-300 active:scale-95 shadow-[0_8px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_10px_24px_rgba(139,92,246,0.4)]"
            >
              <span>Continue to App</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {/* Mini watermark credits */}
        <p className="text-[9px] font-sans text-neutral-400 select-none font-semibold mt-1">
          *You may change themes or custom stickers inside the settings page anytime.
        </p>

      </div>
    </div>
  </div>
);
};
