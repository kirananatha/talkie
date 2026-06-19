import React, { useState, useEffect } from "react";
import { 
  Home, Dice5, Calendar, Briefcase, BookOpen, BarChart3, History, Brain, 
  Award, Trophy, User, Settings, LogOut, Menu, X, CheckSquare, Sparkles, AlertCircle
} from "lucide-react";

import { ThemeWrapper } from "./components/ThemeWrapper";
import { DashboardView } from "./components/views/DashboardView";
import { TopicsView } from "./components/views/TopicsView";
import { DailyChallengeView } from "./components/views/DailyChallengeView";
import { InterviewPrepView } from "./components/views/InterviewPrepView";
import { VocabularyView } from "./components/views/VocabularyView";
import { ProgressView } from "./components/views/ProgressView";
import { HistoryView } from "./components/views/HistoryView";
import { AIAnalysisView } from "./components/views/AIAnalysisView";
import { AchievementsView } from "./components/views/AchievementsView";
import { LeaderboardView } from "./components/views/LeaderboardView";
import { ProfileView } from "./components/views/ProfileView";
import { SettingsView } from "./components/views/SettingsView";
import { OnboardingView } from "./components/OnboardingView";
import { LandingView } from "./components/LandingView";

import { 
  ThemeType, UserProfile, UserStats, SpeechHistoryItem, SpeakingTopic, SpeechAnalysis, HighlightItem 
} from "./types";

import { 
  initDatabase, getProfile, saveProfile, getStats, saveStats, appendSpeechHistory 
} from "./lib/dbService";

import { 
  getSession, saveSession, clearSession, registerUser, canChangeUsername 
} from "./lib/authService";

export default function App() {
  // DB & Auth states
  const [dbReady, setDbReady] = useState(false);
  const [authState, setAuthState] = useState<{
    currentUser: { email: string; username: string } | null;
    emailVerified: boolean;
  }>({ currentUser: null, emailVerified: false });

  // Routing states
  const [activeTab, setActiveTab] = useState<string>("topics");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active workspace profile, stats and themes
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [theme, setTheme] = useState<ThemeType>("clover");
  const [hasApprovedProfileScreen, setHasApprovedProfileScreen] = useState(false);

  // Dynamic analysis session tracker
  const [selectedAnalysisItem, setSelectedAnalysisItem] = useState<SpeechHistoryItem | null>(null);

  // Unauthenticated visual controls
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'forgot' | 'verify'>('landing');
  const [emailInput, setEmailInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [expectedCode, setExpectedCode] = useState("");

  // Static fallbacks in case IndexedDB is still loading in background
  const fallbackProfile: UserProfile = {
    email: authState.currentUser?.email || "",
    username: authState.currentUser?.username || authState.currentUser?.email.split('@')[0] || "User",
    bio: "Halo! Saya sedang melatih speaking Bahasa Inggris di MeloTalk 🍀",
    country: "ID",
    learningGoal: "Business & Casual Fluency",
    currentLevel: "A1",
    profilePic: "🍀",
    usernameChangeCount: 0,
    lastUsernameChangeDate: null,
    registrationDate: new Date().toISOString()
  };

  const fallbackStats: UserStats = {
    totalSpeakingTime: 0,
    completedTopicsCount: 0,
    completedChallengesCount: 0,
    vocabularyMasteredCount: 0,
    dailyStreak: 1,
    lastPracticeDate: new Date().toISOString(),
    overallScore: 0
  };

  // Resolve active profile and stats derived states
  const activeProfile = profile || fallbackProfile;
  const activeStats = stats || fallbackStats;

  // Initialize Local Databases and Auth Sessions
  useEffect(() => {
    // ⚡ STEP 1: Fast session restoration (<1ms)
    const session = getSession();
    if (session && session.currentUser && session.emailVerified) {
      setAuthState({
        currentUser: session.currentUser,
        emailVerified: true
      });
      loadUserData(session.currentUser.email);
    }

    // ⚡ STEP 2: Non-blocking background database initialization
    initDatabase().then(() => {
      setDbReady(true);
      if (session && session.currentUser && session.emailVerified) {
        loadUserData(session.currentUser.email);
      }
    }).catch((err) => {
      console.warn("Database init delayed or failed in background:", err);
      setDbReady(true);
    });
  }, []);

  const loadUserData = async (email: string) => {
    try {
      const userProfile = await getProfile(email);
      const userStats = await getStats(email);
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        const newProf = { ...fallbackProfile, email, onboardingCompleted: false };
        setProfile(newProf);
        saveProfile(newProf).catch(console.error);
      }

      if (userStats) {
        setStats(userStats);
      } else {
        const newSt = { ...fallbackStats };
        setStats(newSt);
        saveStats(newSt, email).catch(console.error);
      }
    } catch (e) {
      console.error("Failed to load user data from IndexedDB, using fallback states:", e);
    }

    // Load theme setting
    const savedTheme = localStorage.getItem(`melotalk_theme_${email}`) || "clover";
    setTheme(savedTheme as ThemeType);
  };

  // Convert theme styles to visual classes for buttons and sidebars
  const getThemeClassMap = () => {
    switch (theme) {
      case "clover":
        return {
          sidebarBg: "bg-white/90 border-r-2 border-r-[#BABF94]/30 text-[#4A3E3D]",
          activeTabItem: "bg-[#BABF94] text-[#333C14] font-bold shadow-sm",
          accentBtn: "bg-[#BABF94] hover:bg-[#A3A87D] text-[#333C14] font-medium shadow-[2px_2px_0px_#333C14]",
          secondaryBtn: "bg-[#F3E4C9] hover:bg-[#FAF8ED] text-[#A98B76] border-2 border-[#BFA28C]/30",
          logoColor: "text-[#A98B76]"
        };
      case "koi":
        return {
          sidebarBg: "bg-white/95 border-r border-r-coral/20 text-[#5C4033]",
          activeTabItem: "bg-[#FFE4E1] text-[#FF7F50] font-bold",
          accentBtn: "bg-[#FF7F50] hover:bg-[#FF6347] text-white font-medium",
          secondaryBtn: "bg-[#FFE4E1]/50 hover:bg-[#FFE4E1] text-[#E9967A] border border-[#FF7F50]/20",
          logoColor: "text-[#FF7F50]"
        };
      case "polka":
        return {
          sidebarBg: "bg-white border-r-4 border-r-slate-700 text-slate-800",
          activeTabItem: "bg-[#38BDF8] text-slate-900 font-bold border border-slate-700",
          accentBtn: "bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-900 border border-slate-700 shadow-[2px_2px_0px_rgba(0,0,0,1)]",
          secondaryBtn: "bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-700",
          logoColor: "text-slate-900"
        };
      case "notebook":
        return {
          sidebarBg: "bg-[#FAF9F6] border-r-2 border-r-slate-300 text-slate-700",
          activeTabItem: "bg-slate-200 text-slate-800 font-bold border-l-4 border-l-red-400",
          accentBtn: "bg-slate-800 hover:bg-slate-700 text-[#FAF9F6] font-medium border border-slate-600 rounded-sm",
          secondaryBtn: "bg-[#FAF9F6] hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm",
          logoColor: "text-red-500"
        };
      case "nature":
        return {
          sidebarBg: "bg-stone-50/95 border-r-2 border-r-[#8DA47E]/30 text-stone-800",
          activeTabItem: "bg-[#8DA47E] text-[#E8F0E6] font-bold rounded-full",
          accentBtn: "bg-[#8DA47E] hover:bg-[#728765] text-stone-50 font-bold rounded-full",
          secondaryBtn: "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-full",
          logoColor: "text-[#8DA47E]"
        };
      case "minimal":
        return {
          sidebarBg: "bg-white border-r border-r-neutral-200 text-neutral-800",
          activeTabItem: "bg-neutral-100 text-black font-semibold rounded-md",
          accentBtn: "bg-black hover:bg-neutral-800 text-white font-normal rounded-md",
          secondaryBtn: "bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-md",
          logoColor: "text-black font-black"
        };
      case "cute":
        return {
          sidebarBg: "bg-white/95 border-r-4 border-r-[#FF8DA1] text-[#5E35B1]",
          activeTabItem: "bg-[#FFE0E6] text-[#FF5D7B] font-black border-2 border-[#FF8DA1]",
          accentBtn: "bg-[#FF8DA1] hover:bg-[#FF738B] text-white font-black rounded-full shadow-[2px_2px_0px_#5E35B1]",
          secondaryBtn: "bg-[#E0C3FC] hover:bg-[#D1A3FC] text-[#5E35B1] font-bold rounded-full shadow-[2px_2px_0px_#5E35B1]",
          logoColor: "text-[#FF8DA1] font-black animate-bounce"
        };
      default:
        return {
          sidebarBg: "bg-white/90 border-r-2 border-r-[#BABF94]/30 text-slate-800",
          activeTabItem: "bg-[#BABF94] text-[#333C14] font-medium",
          accentBtn: "bg-[#BABF94] hover:bg-[#A3A87D] text-[#333C14]",
          secondaryBtn: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300",
          logoColor: "text-[#BABF94]"
        };
    }
  };

  const styleMap = getThemeClassMap();

  // 📝 Authenticate Login Trigger
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const credentials = JSON.parse(localStorage.getItem("melotalk_user_credentials") || "[]");
    const account = credentials.find(
      (c: any) => c.email.toLowerCase() === emailInput.toLowerCase() && c.password === passwordInput
    );

    if (account) {
      setAuthState({
        currentUser: { email: account.email, username: account.username },
        emailVerified: true
      });
      saveSession({
        currentUser: { email: account.email, username: account.username },
        emailVerified: true,
        registrationProgress: "completed"
      });
      loadUserData(account.email);
    } else {
      setAuthError("Email atau Password salah. Silakan coba kembali 🍀");
    }
  };

  // 📝 Register Account triggers code sending
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (passwordInput !== confirmPasswordInput) {
      setAuthError("Password konfirmasi tidak sinkron.");
      return;
    }

    try {
      // Procedurally trigger verification code email simulation
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedCode(randomCode);
      setAuthView("verify");
      setAuthSuccess(`MeloTalk telah mengirimkan kode verifikasi 6 digit ke ${emailInput}: ${randomCode} (Simulation)`);
    } catch (err: any) {
      setAuthError(err.message || "Gagal melakukan registrasi.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (verificationCode !== expectedCode) {
      setAuthError("Kode verifikasi OTP tidak cocok. Harap tinjau kembali kodenya!");
      return;
    }

    try {
      const user = await registerUser(emailInput, userInput, passwordInput);
      setAuthState({
        currentUser: { email: user.email, username: user.username },
        emailVerified: true
      });
      saveSession({
        currentUser: { email: user.email, username: user.username },
        emailVerified: true,
        registrationProgress: "completed"
      });
      await loadUserData(user.email);
    } catch (err: any) {
      setAuthError(err.message || "Registrasi gagal.");
    }
  };

  const handleLogout = () => {
    clearSession();
    setAuthState({ currentUser: null, emailVerified: false });
    setProfile(null);
    setStats(null);
    setHasApprovedProfileScreen(false);
    setAuthView("landing");
  };

  // 🍀 Recalculate speech outcomes and advance user levels
  const handleSpeechFeedbackCompleted = async (
    analysis: SpeechAnalysis,
    base64Audio: string,
    durationSec: number,
    topicText: string,
    category: string,
    transcript: string,
    highlights: HighlightItem[]
  ) => {
    if (!profile || !stats || !authState.currentUser) return;

    // Build speech history entry
    const newRecord: SpeechHistoryItem = {
      id: `record_${Date.now()}`,
      userId: authState.currentUser.email,
      topicId: null,
      topicText: topicText,
      category: category,
      duration: durationSec,
      timestamp: new Date().toISOString(),
      transcript: transcript,
      highlights: highlights,
      audioBase64: base64Audio,
      analysis: analysis
    };

    // Save record to IndexedDB
    await appendSpeechHistory(newRecord);

    // Compute updated stat aggregations
    // Add XP points (standard points + consistency increments)
    const incrementalScore = analysis.overallScore + (category === "Daily Challenge" ? 150 : 50);
    const updatedStats: UserStats = {
      ...stats,
      totalSpeakingTime: stats.totalSpeakingTime + durationSec,
      completedTopicsCount: stats.completedTopicsCount + 1,
      overallScore: stats.overallScore + incrementalScore,
      lastPracticeDate: new Date().toISOString()
    };

    // Recalculate CEFR Progression Level based on speaking count & overall score threshold
    let newCEFR = profile.currentLevel;
    if (updatedStats.completedTopicsCount >= 10 || updatedStats.overallScore >= 450) {
      newCEFR = "B2";
    } else if (updatedStats.completedTopicsCount >= 5 || updatedStats.overallScore >= 250) {
      newCEFR = "B1";
    } else if (updatedStats.completedTopicsCount >= 2) {
      newCEFR = "A2";
    }

    const updatedProfile: UserProfile = {
      ...profile,
      currentLevel: newCEFR
    };

    // Sync state and databases
    await saveStats(updatedStats, authState.currentUser.email);
    await saveProfile(updatedProfile);

    setStats(updatedStats);
    setProfile(updatedProfile);
    
    // Set active analytical item, do not switch tabs as the TopicsView now displays this inline beautifully!
    setSelectedAnalysisItem(newRecord);
    setActiveTab("topics");
  };

  // Theme changing coordinator
  const handleThemeOptionChanged = (opt: ThemeType) => {
    setTheme(opt);
    if (authState.currentUser) {
      localStorage.setItem(`melotalk_theme_${authState.currentUser.email}`, opt);
    }
  };

  // Nav items specifications
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "topics", label: "Speaking Topics", icon: Dice5 },
    { id: "challenge", label: "Daily Challenge", icon: Calendar },
    { id: "interview", label: "Interview Prep", icon: Briefcase },
    { id: "vocab", label: "Vocabulary Center", icon: BookOpen },
    { id: "progress", label: "Speaking Progress", icon: BarChart3 },
    { id: "history", label: "Speech History", icon: History },
    { id: "analysis", label: "Coach AI Analysis", icon: Brain },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "profile", label: "Personal Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <ThemeWrapper theme={theme}>
      
      {/* 🚀 Case A: Unauthenticated user, render either Startup Landing, login, or registration portals */}
      {!authState.currentUser && (
        <div className="flex flex-col min-h-screen text-slate-800">
          
          {/* Landing Header */}
          <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-40 relative">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🍀</span>
              <span className="text-xl font-bold tracking-tight text-slate-800 font-sans" style={{ fontFamily: "var(--font-sans)" }}>MeloTalk</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setAuthView("login")}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
              >
                Login
              </button>
              <button
                onClick={() => setAuthView("register")}
                className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow transition-all duration-300"
              >
                Join Free ✨
              </button>
            </div>
          </nav>

          {/* Core content switchboard */}
          {authView === "landing" && (
            <LandingView 
              onStartPractice={() => setAuthView("register")}
              onLogin={() => setAuthView("login")}
            />
          )}

          {/* Login view */}
          {authView === "login" && (
            <main className="flex-1 flex items-center justify-center p-6 z-20">
              <div className="w-full max-w-sm bg-white p-8 rounded-3xl border-2 border-[#BABF94]/40 shadow-sm space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-4xl">🕊️</span>
                  <h2 className="text-lg font-bold text-slate-800">Masuk ke MeloTalk</h2>
                  <p className="text-xs text-slate-400">Selamat datang kembali! Lanjutkan progres semanggimu.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Sekolah</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800"
                      required
                    />
                  </div>

                  {authError && <div className="text-xs text-red-700 font-bold text-left p-2.5 bg-red-50 rounded-lg">{authError}</div>}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-705 shadow"
                  >
                    Masuk Sekarang
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-xs text-slate-400">
                    Belum punya akun?{" "}
                    <button onClick={() => setAuthView("register")} className="font-bold text-amber-800 underline">
                      Daftar Gratis
                    </button>
                  </p>
                </div>
              </div>
            </main>
          )}

          {/* Register view */}
          {authView === "register" && (
            <main className="flex-1 flex items-center justify-center p-6 z-20">
              <div className="w-full max-w-sm bg-white p-8 rounded-3xl border-2 border-[#BABF94]/40 shadow-sm space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-4xl">🍀</span>
                  <h2 className="text-lg font-bold text-slate-800">Daftarkan Akun Melo</h2>
                  <p className="text-xs text-slate-400">Mulai melatih speaking Bahasa Inggris secara santai dan imut.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Username Unik</label>
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="kiranakiran"
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-850"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-405 uppercase block">Alamat Email</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="kirana@sekolah.com"
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-850"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 block">Password</label>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs border rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-1"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-405 block">Konfirmasi</label>
                      <input
                        type="password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs border rounded-xl bg-[#FAF9F6]"
                        required
                      />
                    </div>
                  </div>

                  {authError && <div className="text-xs text-red-700 text-left p-2.5 bg-red-50 rounded-lg">{authError}</div>}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700"
                  >
                    Lanjutkan Ke Verifikasi Email
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-xs text-slate-400">
                    Sudah punya akun?{" "}
                    <button onClick={() => setAuthView("login")} className="font-bold text-amber-800 underline">
                      Login disini
                    </button>
                  </p>
                </div>
              </div>
            </main>
          )}

          {/* Verification OTP view */}
          {authView === "verify" && (
            <main className="flex-1 flex items-center justify-center p-6 z-20">
              <div className="w-full max-w-sm bg-white p-8 rounded-3xl border-2 border-[#BABF94]/40 shadow-sm space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-4xl">📧</span>
                  <h2 className="text-lg font-bold text-slate-800">Verifikasikan Alamat Email</h2>
                  <p className="text-xs text-slate-400">MeloTalk telah mengirimkan simulasi kode verifikasi ke emailmu.</p>
                </div>

                {authSuccess && (
                  <div className="p-3 bg-[#F2FBF6] border-2 border-dashed border-emerald-300 rounded-xl flex items-start gap-2.5">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-[10px] text-emerald-800 leading-normal">{authSuccess}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase block tracking-wider text-center">Masukkan Kode 6-Digit</label>
                    <input
                      type="text"
                      align="center"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 text-center text-xl tracking-widest font-bold border rounded-xl bg-[#FAF9F6]"
                      required
                    />
                  </div>

                  {authError && <div className="text-xs text-red-700 text-left p-2.5 bg-red-50 rounded-lg">{authError}</div>}

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 tracking-wide"
                  >
                    Verifikasikan & Selesaikan Akun 🍀
                  </button>
                </form>
              </div>
            </main>
          )}

          {/* Landing Footer */}
          <footer className="py-6 text-center text-[10px] text-slate-450 z-30 relative">
            <p>© 2026 MeloTalk Inc • Designed and coded happily using Poppins fonts 🍀</p>
          </footer>
        </div>
      )}

      {/* 🚀 Case B: Authenticated user loading state (avoid flashes) */}
      {authState.currentUser && !profile && (
        <div className="min-h-screen bg-[#FAF8ED] flex flex-col items-center justify-center font-sans">
          <span className="text-5xl animate-bounce mb-4" style={{ animationDuration: "2.5s" }}>🍀</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse font-mono">Loading MeloTalk Space...</p>
        </div>
      )}

      {/* 🚀 Case C: Authenticated user, but has NOT completed first-time space personalization */}
      {authState.currentUser && profile && profile.onboardingCompleted !== true && (
        <OnboardingView
          email={authState.currentUser.email}
          username={profile.username || authState.currentUser.username}
          onComplete={async (updatedProfileFields, selectedTheme) => {
            const updatedProfile = {
              ...profile,
              ...updatedProfileFields,
              onboardingCompleted: true
            };
            await saveProfile(updatedProfile);
            setProfile(updatedProfile);
            handleThemeOptionChanged(selectedTheme);
          }}
        />
      )}

      {/* 🔮 Case C.5: Authenticated user is shown the simple PREVIEW PROFILE SCREEN BEFORE ENTERING THE LEARNING SPACE */}
      {authState.currentUser && profile && profile.onboardingCompleted === true && !hasApprovedProfileScreen && (
        <ProfileView
          profile={profile}
          accentBtn={styleMap.accentBtn}
          theme={theme}
          onNavigate={(panel) => {
            if (panel === "settings") {
              setHasApprovedProfileScreen(true);
              setActiveTab("settings");
            } else {
              setHasApprovedProfileScreen(true);
              setActiveTab(panel);
            }
          }}
          onContinueToApp={() => setHasApprovedProfileScreen(true)}
          isSidebarMode={false}
        />
      )}

      {/* 🚀 Case D: Authenticated user with personalization complete - enter dashboard */}
      {authState.currentUser && profile && profile.onboardingCompleted === true && hasApprovedProfileScreen && (
        <div className="flex h-screen overflow-hidden text-slate-800 font-sans">
          
          {/* Collapsible Left Side Navigation Drawer */}
          <aside className={`fixed inset-y-0 left-0 lg:static z-45 md:z-30 w-64 transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300 ${styleMap.sidebarBg} flex flex-col justify-between`}>
            
            {/* Header branding */}
            <div className="p-6 border-b border-dashed flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🍀</span>
                <span className="text-lg font-black tracking-tight font-sans">MeloTalk</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Sidebar main items list scroll */}
            <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-1.5 py-6">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 text-xs rounded-xl transition-all select-none ${
                      isSelected 
                        ? styleMap.activeTabItem 
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0`} />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User footer credentials & Logout */}
            <div className="p-4 border-t border-dashed space-y-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("profile");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center text-left space-x-3 p-2 rounded-xl border cursor-pointer select-none active:scale-98 transition ${
                  activeTab === "profile"
                    ? "bg-purple-50/60 border-purple-400 shadow-xs"
                    : "bg-slate-100/50 hover:bg-neutral-50/80 border-slate-200 hover:border-purple-200"
                }`}
                title="View Personal Profile & Themes"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-slate-250 shrink-0">
                  {activeProfile.profilePic && activeProfile.profilePic.startsWith("data:") ? (
                    <img src={activeProfile.profilePic} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl leading-none select-none">{activeProfile.profilePic || "🍀"}</span>
                  )}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="text-xs font-black text-slate-700 truncate leading-tight flex items-center justify-between">
                    <span>{activeProfile.username}</span>
                    <span className="text-[10px] text-purple-600 block">⚙️</span>
                  </div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{activeProfile.email}</div>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2.5 py-2.5 border border-red-200 text-red-650 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Keluar</span>
              </button>
            </div>

          </aside>

          {/* Main workspace panels */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            
            {/* Top mobile navigation support bar */}
            <header className="lg:hidden h-14 border-b bg-white/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                title="Buka menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-1">
                <span className="text-2xl">🍀</span>
                <span className="text-sm font-bold font-sans">MeloTalk</span>
              </div>

              <div className="w-8"></div> {/* Spacer for symmetry */}
            </header>

            {/* Primary active panel wrapper scroll view */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar scroll-smooth">
              
              {activeTab === "dashboard" && (
                <DashboardView 
                  profile={activeProfile}
                  stats={activeStats}
                  theme={theme}
                  onNavigate={(panel) => setActiveTab(panel)}
                  accentBtn={styleMap.accentBtn}
                  secondaryBtn={styleMap.secondaryBtn}
                />
              )}

              {activeTab === "topics" && (
                <TopicsView 
                  theme={theme}
                  onAnalysisSuccess={handleSpeechFeedbackCompleted}
                  accentBtn={styleMap.accentBtn}
                  secondaryBtn={styleMap.secondaryBtn}
                />
              )}

              {activeTab === "challenge" && (
                <DailyChallengeView 
                  userId={activeProfile.email}
                  onAnalysisSuccess={handleSpeechFeedbackCompleted}
                  accentBtn={styleMap.accentBtn}
                  secondaryBtn={styleMap.secondaryBtn}
                />
              )}

              {activeTab === "interview" && (
                <InterviewPrepView 
                  onAnalysisSuccess={handleSpeechFeedbackCompleted}
                  accentBtn={styleMap.accentBtn}
                  secondaryBtn={styleMap.secondaryBtn}
                />
              )}

              {activeTab === "vocab" && (
                <VocabularyView 
                  userId={activeProfile.email}
                  onLearnProgressUpdated={async () => {
                    // Update stats metrics counts
                    const updated = { ...activeStats, vocabularyMasteredCount: activeStats.vocabularyMasteredCount + 1 };
                    saveStats(updated, activeProfile.email).catch(console.error);
                    setStats(updated);
                  }}
                  accentBtn={styleMap.accentBtn}
                  secondaryBtn={styleMap.secondaryBtn}
                />
              )}

              {activeTab === "progress" && (
                <ProgressView 
                  userId={activeProfile.email}
                  stats={activeStats}
                />
              )}

              {activeTab === "history" && (
                <HistoryView 
                  userId={activeProfile.email}
                  onOpenAnalysis={(record) => {
                    setSelectedAnalysisItem(record);
                    setActiveTab("analysis");
                  }}
                  secondaryBtn={styleMap.secondaryBtn}
                />
              )}

              {activeTab === "analysis" && (
                <AIAnalysisView 
                  activeRecord={selectedAnalysisItem}
                  onNavigate={(panel) => setActiveTab(panel)}
                  accentBtn={styleMap.accentBtn}
                />
              )}

              {activeTab === "achievements" && (
                <AchievementsView 
                  stats={activeStats}
                />
              )}

              {activeTab === "leaderboard" && (
                <LeaderboardView 
                  profile={activeProfile}
                  stats={activeStats}
                />
              )}

              {activeTab === "profile" && (
                <ProfileView 
                  profile={activeProfile}
                  accentBtn={styleMap.accentBtn}
                  theme={theme}
                  onNavigate={(panel) => setActiveTab(panel)}
                  isSidebarMode={true}
                />
              )}

              {activeTab === "settings" && (
                <SettingsView 
                  currentTheme={theme}
                  onThemeChanged={handleThemeOptionChanged}
                  accentBtn={styleMap.accentBtn}
                />
              )}

            </main>

          </div>

          {/* Mobile swipe drawer background overlay */}
          {mobileMenuOpen && (
            <div 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/45 backdrop-blur-xs z-35"
            ></div>
          )}

        </div>
      )}

    </ThemeWrapper>
  );
}
