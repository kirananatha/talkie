import React, { useState, useRef } from "react";
import { UserProfile, ThemeType } from "../types";
import { 
  Sparkles, Check, Camera, Upload, Image as ImageIcon, 
  Award, Palette, Edit3, Heart, Star, Compass, RefreshCw 
} from "lucide-react";

interface OnboardingViewProps {
  email: string;
  username: string;
  onComplete: (updatedProfile: Partial<UserProfile>, selectedTheme: ThemeType) => void;
}

// 8 Themes mapped to our ThemeType keys with highly expressive aesthetic details
const PRESET_THEMES = [
  { 
    id: "clover" as ThemeType, 
    name: "Lucky Clover", 
    icon: "🍀", 
    desc: "Aroma herbal sage green dengan taburan daun semanggi putih ikonik.",
    cardStyle: "bg-[#E2ECC8] text-[#333C14] border-2 border-[#333C14]/30 shadow-[3px_3px_0px_#333C14/15]",
    badgeStyle: "text-[#E91E63] font-['Dancing_Script'] text-3xl font-bold -rotate-6 filter drop-shadow-[1px_1px_0px_#fff]",
    bgPreview: "bg-[#E2ECC8] bg-[radial-gradient(#b2c28a_1px,transparent_1px)] [background-size:16px_16px]"
  },
  { 
    id: "koi" as ThemeType, 
    name: "Koi Garden", 
    icon: "🐟", 
    desc: "Jingga pastel kolam ikan jepang yang anggun, melambangkan keberuntungan mengalir harian.",
    cardStyle: "bg-gradient-to-tr from-[#FFF5EE] via-[#FFE4E1] to-[#FFF0F5] border-2 border-[#FF7F50]/20 text-[#5C4033]",
    badgeStyle: "text-[#FF5722] font-[#Dancing_Script] text-3xl font-extrabold rotate-3 filter drop-shadow-[0.5px_0.5px_0px_#fff]",
    bgPreview: "bg-[#FFF0EB] bg-[radial-gradient(#ffcdc0_1.5px,transparent_1.5px)] [background-size:20px_20px]"
  },
  { 
    id: "polka" as ThemeType, 
    name: "Soft Bloom", 
    icon: "🌸", 
    desc: "Mimpi warna merah muda pudar dihiasi kelopak sakura berguguran layaknya musim semi Tokyo.",
    cardStyle: "bg-gradient-to-br from-[#FFF0F5] to-[#FFE4E1] border-2 border-[#FCE4EC] text-[#880E4F]",
    badgeStyle: "text-[#EC407A] font-['Dancing_Script'] text-3.5xl font-black -rotate-3",
    bgPreview: "bg-[#FFF2F6] bg-[radial-gradient(#f8bbd0_1px,transparent_1px)] [background-size:18px_18px]"
  },
  { 
    id: "cute" as ThemeType, 
    name: "Pink Aesthetic", 
    icon: "🎀", 
    desc: "Aura ceria manis penuh rona permen kapas dengan pola bintang berkerlip retro.",
    cardStyle: "bg-gradient-to-tr from-[#FFF5F7] via-[#FFEBEF] to-[#FFF9FA] border-2 border-[#FF8DA1]/40 text-[#5E35B1] shadow-[2.5px_2.5px_0px_rgba(94,53,177,0.1)]",
    badgeStyle: "text-[#E91B80] font-['Dancing_Script'] text-3xl font-black rotate-2 filter drop-shadow-[1.5px_1.5px_0px_#FFF]",
    bgPreview: "bg-[#FFF4F7] bg-[radial-gradient(#ffcdd2_1px,transparent_1px)] [background-size:14px_14px]"
  },
  { 
    id: "nature" as ThemeType, 
    name: "Nature Calm", 
    icon: "🌿", 
    desc: "Warna asri dedaunan liar nan autentik, menenangkan hati saat berlatih vokal intensif.",
    cardStyle: "bg-[#ECEFE6] border border-[#8DA47E]/40 text-stone-800",
    badgeStyle: "text-[#3E4E36] font-['Dancing_Script'] text-3.5xl font-extrabold -rotate-3",
    bgPreview: "bg-[#ECEFE6]"
  },
  { 
    id: "notebook" as ThemeType, 
    name: "Cloud Dream", 
    icon: "☁️", 
    desc: "Gradasi gradien langit senja redup berpadu pola gumpalan awan halus.",
    cardStyle: "bg-gradient-to-b from-[#E0F2FE] via-[#F3E8FF] to-[#EFF6FF] border-2 border-dashed border-[#93C5FD] text-slate-800",
    badgeStyle: "text-[#2563EB] font-['Dancing_Script'] text-3xl font-extrabold rotate-6",
    bgPreview: "bg-gradient-to-tr from-[#F0F7FF] to-[#E0F2FE]"
  },
  { 
    id: "minimal" as ThemeType, 
    name: "Minimal Clean", 
    icon: "⚪", 
    desc: "Monokromatik modern premium AI startup dengan tekstur dot halus super minimalis.",
    cardStyle: "bg-white border border-neutral-200 text-neutral-900 shadow-sm",
    badgeStyle: "text-neutral-900 font-serif italic text-2xl font-black leading-none",
    bgPreview: "bg-white bg-[radial-gradient(#e5e5e5_1.5px,transparent_1.5px)] [background-size:16px_16px]"
  },
  {
    id: "minimal" as ThemeType, // Maps to minimal theme wrapper backend but renders hologram
    name: "Gen Z Mood", 
    icon: "✨", 
    desc: "Gradasi kepingan hologram berwarna-warni pudar dilengkapi bintang perak gemerlap.",
    cardStyle: "bg-gradient-to-br from-[#FEE2E2] via-[#E0E7FF] to-[#F1F5F9] border-2 border-slate-300 text-purple-950",
    badgeStyle: "text-[#d100d1] font-['Dancing_Script'] text-3.5xl font-bold -rotate-12 filter drop-shadow-[1px_1px_0px_#fff]",
    bgPreview: "bg-gradient-to-r from-[#FFE4E6] via-[#E0E7FF] to-[#ECFDF5]"
  }
];

// Presets for profile pictures / avatar symbols (emojis)
const PRESET_AVATARS = [
  { id: "clover", char: "🍀" },
  { id: "koi", char: "🐟" },
  { id: "smile", char: "✨" },
  { id: "cute", char: "🎀" },
  { id: "cat", char: "🐱" },
  { id: "peach", char: "🍑" },
  { id: "game", char: "🎮" },
  { id: "headphone", char: "🎧" },
  { id: "star", char: "🪐" },
  { id: "artist", char: "🎨" },
  { id: "scooter", char: "🛹" },
  { id: "boba", char: "🧋" }
];

// 6 requested beautiful personality badges
const BADGES = [
  { id: "Book Worm", text: "Book Worm", icon: "📚", color: "#EC407A" },
  { id: "Creative Soul", text: "Creative Soul", icon: "🎨", color: "#5E35B1" },
  { id: "Daily Speaker", text: "Daily Speaker", icon: "🗣️", color: "#4CAF50" },
  { id: "Language Explorer", text: "Language Explorer", icon: "🌍", color: "#2563EB" },
  { id: "Coffee Talker", text: "Coffee Talker", icon: "☕", color: "#FF7F50" },
  { id: "Confident Speaker", text: "Confident Speaker", icon: "⚡", color: "#A98B76" }
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  email, username, onComplete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Customization state variables matching screenshot parameters
  const [selectedAvatar, setSelectedAvatar] = useState<string>("🍀");
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState<string>(username || "seanfailed");
  const [customBio, setCustomBio] = useState<string>(`Hello, this is ${username || "seanfailed"}'s space.`);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);
  const [selectedBadge, setSelectedBadge] = useState<string>("Book Worm");
  const [activeTab, setActiveTab2] = useState<"avatar" | "background" | "badge" | "bio">("background");

  const currentTheme = PRESET_THEMES[selectedThemeIndex] || PRESET_THEMES[0];
  const activeBadgeObj = BADGES.find(b => b.id === selectedBadge) || BADGES[0];

  // Handle local image file upload converting to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal adalah 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setCustomAvatarUrl(base64Data);
        setSelectedAvatar(""); // empty emoji selection to indicate custom
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSaveWorkspace = () => {
    if (!inputUsername.trim()) {
      alert("Harap masukkan username Anda terlebih dahulu!");
      return;
    }

    const finalProfilePic = customAvatarUrl || selectedAvatar || "🍀";
    
    onComplete({
      username: inputUsername.trim().toLowerCase(),
      bio: customBio.trim(),
      profilePic: finalProfilePic,
      onboardingCompleted: true,
      speakingGoal: "Customize Speaking Identity",
      theme: currentTheme.id,
      badge: selectedBadge
    }, currentTheme.id);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-neutral-800 flex flex-col justify-between overflow-x-hidden font-sans select-none relative">
      
      {/* Dynamic theme style overrides or decorations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>

      {/* Header bar */}
      <header className="px-6 py-4 bg-white border-b border-gray-200/80 flex items-center justify-between z-30">
        <div className="flex items-center space-x-2.5">
          <span className="text-2xl animate-spin" style={{ animationDuration: "12s" }}>✨</span>
          <div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight leading-none">MeloTalk Workspace</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">First-Time Creative Setup</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-gray-500 font-mono">ID: {email.split("@")[0]}</span>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 flex flex-col justify-center py-6 gap-6 relative z-10">
        
        {/* Title area */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 font-sans">
            Customize Your Speaking Identity
          </h2>
          <p className="text-[11px] text-gray-600 font-medium">
            Desain "Digital Space Card" pribadi Anda sebelum berlatih bersama MeloTalk AI.
          </p>
        </div>

        {/* ====================================================
            1. PERSISTENT LIVE PREVIEW PROFILE CARD (Match Attachment)
            ==================================================== */}
        <div className="w-full flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1">
            👀 PREVIEW SPACE CARD
          </span>
          
          <div className={`w-full h-[180px] rounded-[1.75rem] p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm border border-neutral-200/80 ${currentTheme.bgPreview} ${currentTheme.cardStyle}`}>
            
            {/* Background specific decorations */}
            {currentTheme.id === "clover" && (
              <div className="absolute top-2 right-12 text-3xl opacity-20 clover-sway pointer-events-none">🍀</div>
            )}
            {currentTheme.id === "clover" && (
              <div className="absolute bottom-3 right-6 text-2xl opacity-15 clover-sway pointer-events-none">🍀</div>
            )}
            {currentTheme.id === "koi" && (
              <div className="absolute bottom-2 right-24 text-4xl opacity-20 koi-swim pointer-events-none text-coral">🐟</div>
            )}
            
            {/* Top row: Avatar & Badge */}
            <div className="flex items-start justify-between w-full relative z-10">
              {/* Profile Avatar (Left top) */}
              <div className="h-16 w-16 rounded-full border-2 border-white/90 bg-white/40 backdrop-blur-md shadow-sm overflow-hidden flex items-center justify-center relative group">
                {customAvatarUrl ? (
                  <img 
                    src={customAvatarUrl} 
                    alt="Space Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-4xl select-none">{selectedAvatar || "🍀"}</span>
                )}
              </div>

              {/* Personality Badge (Right top) in Custom Slanted Cursive style matching screenshot */}
              <div className="text-right flex flex-col items-end pt-1">
                <span className={`${currentTheme.badgeStyle}`} style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}>
                  {activeBadgeObj.text.toLowerCase()}
                </span>
                <span className="text-[8px] bg-white/60 tracking-wider backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">
                  {activeBadgeObj.icon} {activeBadgeObj.text}
                </span>
              </div>
            </div>

            {/* Bottom row: Username & Short Bio */}
            <div className="relative z-10 space-y-1 mt-auto">
              {/* Username (lowercase bold matching screenshot) */}
              <h3 className="text-lg font-black tracking-tight text-neutral-900 leading-none lowercase">
                {inputUsername.trim() || "seanfailed"}
              </h3>
              
              {/* Dynamic Bio */}
              <p className="text-xs text-neutral-805/90 font-medium font-sans leading-snug truncate max-w-sm">
                {customBio || `Hello, this is ${inputUsername.trim() || "seanfailed"}'s space.`}
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================
            2. INTERACTIVE DESIGN EDITING PANEL (Matching Mockup Drawer)
            ==================================================== */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm space-y-5">
          
          {/* Internal Panel Header with Save Action */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 tracking-wider">Design Palette</span>
            
            <button 
              onClick={handleSaveWorkspace}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 hover:scale-103 transition-transform text-xs font-bold text-white rounded-xl shadow-xs"
            >
              Save my space
            </button>
          </div>

          {/* Segmented controls / Navigation Tabs inside editor */}
          <div className="flex items-center justify-between bg-slate-100 p-1 rounded-xl">
            {[
              { id: "avatar" as const, label: "Avatar Preset", icon: <Camera className="w-3.5 h-3.5" /> },
              { id: "background" as const, label: "Background", icon: <Palette className="w-3.5 h-3.5" /> },
              { id: "badge" as const, label: "Logo Badge", icon: <Award className="w-3.5 h-3.5" /> },
              { id: "bio" as const, label: "Bio Text", icon: <Edit3 className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab2(tab.id)}
                className={`flex-1 py-2 text-[10.5px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ---------------------------------
              Tab Content 1: AVATAR CUSTOMIZER
              --------------------------------- */}
          {activeTab === "avatar" && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pilih Preset / Unggah Foto</p>
                
                {/* Custom Base64 File Uploader */}
                <button
                  onClick={triggerFileUpload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-[10.5px] font-black rounded-lg border border-indigo-200/55 transition-all text-left"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Foto Custom</span>
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Status Indicator */}
              {customAvatarUrl && (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Foto Kustom Berhasil Diterapkan!</span>
                  </div>
                  <button 
                    onClick={() => {
                      setCustomAvatarUrl(null);
                      setSelectedAvatar("🍀");
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              )}

              {/* Quick Preset Emoji Choices */}
              <div className="grid grid-cols-6 gap-2.5">
                {PRESET_AVATARS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCustomAvatarUrl(null); // clear file avatar
                      setSelectedAvatar(p.char);
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center text-2xl transition-all border-2 ${
                      !customAvatarUrl && selectedAvatar === p.char
                        ? "border-amber-500 bg-amber-50 scale-105"
                        : "border-gray-100 hover:border-gray-200 bg-slate-50/50"
                    }`}
                  >
                    {p.char}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------
              Tab Content 2: BACKGROUND / DESIGN THEMES
              --------------------------------- */}
          {activeTab === "background" && (
            <div className="space-y-3.5 animate-fade-in text-left">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pilihan Latar Belakang & Seni Tema</p>
                <p className="text-[9.5px] text-gray-400 mt-0.5 leading-snug">Setiap tema mengadaptasi keindahan visual, warna utama, serta nuansa estetis space card Anda secara penuh.</p>
              </div>

              {/* Real high quality grid resembling the screenshot layout exactly */}
              <div className="grid grid-cols-2 gap-3 max-h-[175px] overflow-y-auto pr-1 no-scrollbar">
                {PRESET_THEMES.map((th, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedThemeIndex(index)}
                    className={`p-3 rounded-2xl text-left border-2 flex items-start gap-2.5 transition-all ${
                      selectedThemeIndex === index
                        ? "border-slate-800 bg-slate-50 scale-[1.02] shadow-xs"
                        : "border-gray-100 hover:border-gray-200 hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Visual representative block for each background item */}
                    <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border border-gray-200/50 text-base ${th.bgPreview}`}>
                      {th.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-950 truncate block leading-none">{th.name}</span>
                        {selectedThemeIndex === index && (
                          <span className="h-3 w-3 rounded-full bg-slate-900 text-white flex items-center justify-center text-[7px] leading-none shrink-0 font-bold">✓</span>
                        )}
                      </div>
                      <p className="text-[8.5px] text-gray-400 line-clamp-2 leading-tight mt-1">{th.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------
              Tab Content 3: BADGES SELECTOR
              --------------------------------- */}
          {activeTab === "badge" && (
            <div className="space-y-3 animate-fade-in text-left">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Profile Badges & Personality Logo</p>
                <p className="text-[9.5px] text-gray-400 mt-0.5">Badge ini menampilkan jati diri Anda di canva atas secara retro puitis.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {BADGES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBadge(b.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 bg-slate-50/30 hover:bg-slate-50 transition-all ${
                      selectedBadge === b.id
                        ? "border-slate-900 font-extrabold bg-[#FAF8ED]"
                        : "border-gray-100"
                    }`}
                  >
                    <span className="text-sm shrink-0">{b.icon}</span>
                    <span className="text-[10.5px] font-bold text-gray-800 truncate">{b.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------
              Tab Content 4: NAMES & SHORT BIO
              --------------------------------- */}
          {activeTab === "bio" && (
            <div className="space-y-4 animate-fade-in text-left">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Personal Username (@)</label>
                <input 
                  type="text"
                  maxLength={14}
                  value={inputUsername}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 14);
                    setInputUsername(cleaned);
                    // update bio template if they haven't written anything complex
                    if (customBio === `Hello, this is ${inputUsername}'s space.` || customBio === `Hello, this is ${username}'s space.`) {
                      setCustomBio(`Hello, this is ${cleaned}'s space.`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-xs font-bold font-mono text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-950 outline-none"
                  placeholder="masukkan_username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Personal Space Custom Bio</label>
                <textarea 
                  rows={2}
                  maxLength={60}
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value.slice(0, 60))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-950 outline-none resize-none leading-relaxed"
                  placeholder="Ketikkan pesan bio unik yang mencerminkan kamarmu..."
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-bold px-1">
                  <span>Maksimal 60 karakter</span>
                  <span>{customBio.length}/60</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FOOTER BAR WITH PROPER LAUNCH ACTION */}
      <footer className="py-4.5 bg-white border-t border-gray-200/80 px-4 text-center flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        <p className="text-[10px] text-gray-400 font-bold tracking-tight">
          🎨 MeloTalk Space Platform • Designed for Premium Speaking Identity
        </p>

        {/* Big CTA Save button */}
        <button
          onClick={handleSaveWorkspace}
          className="w-full sm:w-auto px-10 py-3 bg-slate-900 hover:bg-slate-800 hover:scale-102 transition duration-300 text-white font-extrabold text-[11px] tracking-widest rounded-xl shadow-md uppercase"
        >
          Save My Space & Enter dashboard 🍀
        </button>
      </footer>

    </div>
  );
};
