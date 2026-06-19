import React, { useState, useEffect } from "react";
import { 
  Mic, Volume2, Sparkles, CheckCircle, MessageSquare, Compass, 
  FileText, Brain, Globe, LineChart, ArrowRight, Play, Check, AlertCircle
} from "lucide-react";

interface LandingViewProps {
  onStartPractice: () => void;
  onLogin: () => void;
}

// Language choices with cultural/tailored prompts
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧", promo: "Tell me about a challenge you overcame.", translation: "Ceritakan tantangan yang berhasil Anda lewati.", hint: "Best for overall fluency and corporate interview preparation." },
  { code: "jp", name: "Japanese", flag: "🇯🇵", promo: "あなたの将来の夢について日本語で話してください。", translation: "Ceritakan tentang impian masa depan Anda dalam bahasa Jepang.", hint: "Meningkatkan pelafalan nada (pitch accent) dan kosakata sopan." },
  { code: "kr", name: "Korean", flag: "🇰🇷", promo: "주말에 주로 무엇을 하는지 한국어로 소개해 보세요.", translation: "Perkenalkan aktivitas akhir pekan Anda dalam bahasa Korea.", hint: "Sempurna untuk melancarkan pembicaraan kasual sehari-hari." },
  { code: "cn", name: "Chinese", flag: "🇨🇳", promo: "用中文分享一个让你难忘的故事。", translation: "Bagikan cerita yang paling tak terlupakan dalam bahasa Mandarin.", hint: "Melatih ketepatan nada bicara (tones) secara real-time." },
  { code: "id", name: "Indonesian", flag: "🇮🇩", promo: "Ceritakan kuliner tradisional favorit dari daerah asalmu dan alasannya.", translation: "Bahasa Indonesia formal & kasual untuk audiens global.", hint: "Tingkatkan kemampunan presentasi publik secara tulus." },
  { code: "es", name: "Spanish", flag: "🇪🇸", promo: "¿Cuál es tu película favorita y por qué te gusta tanto?", translation: "Apa film favorit Anda dan mengapa Anda sangat menyukainya?", hint: "Sangat baik untuk melatih tempo bicara yang cepat." },
  { code: "fr", name: "French", flag: "🇫🇷", promo: "Décrivez votre ville natale et ce que vous aimez y faire.", translation: "Gambarkan kota kelahiran Anda dan apa yang suka Anda lakukan di sana.", hint: "Fokus pada pengucapan vokal sengau khas Prancis." },
  { code: "de", name: "German", flag: "🇩🇪", promo: "Was hast du letztes Wochenende gemacht? Erzähle uns davon.", translation: "Apa yang Anda lakukan akhir pekan lalu? Ceritakan kepada kami.", hint: "Sempurna untuk menyusun struktur tata bahasa Jerman yang presisi." }
];

export const LandingView: React.FC<LandingViewProps> = ({ onStartPractice, onLogin }) => {
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [copiedFeature, setCopiedFeature] = useState<string | null>(null);
  
  // Waveform animation simulation states
  const [waveHeights, setWaveHeights] = useState<number[]>([30, 15, 45, 20, 60, 25, 40, 15, 35, 50, 20, 45, 10, 30, 50, 15, 40, 25, 35, 15]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHeights(prev => 
        prev.map(() => Math.floor(Math.random() * 55) + 10)
      );
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#FAF9F6] text-slate-800 min-h-screen font-sans">
      
      {/* 🚀 HERO SECTION */}
      <section className="relative px-6 pt-12 pb-24 md:py-32 overflow-hidden border-b border-slate-200/50 bg-gradient-to-b from-[#F3E4C9]/40 via-white to-[#FAF9F6]">
        
        {/* Subtle Decorative Grids & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#BABF94]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[200px] h-[200px] bg-[#A98B76]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero texts */}
          <div className="lg:col-span-7 text-left space-y-7 md:pr-4">
            
            {/* Startup Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-[#BFA28C]/30 px-3 py-1.5 rounded-full shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A98B76] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A98B76]"></span>
              </span>
              <span className="text-[#A98B76] text-[11px] font-semibold uppercase tracking-wider">
                ⚡ Premium AI Speaking Practice Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-sans">
              Speak Any Language <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A98B76] via-[#BFA28C] to-[#BABF94]">
                With Absolute Confidence.
              </span>
            </h1>

            {/* Context Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-sans normal-case">
              Practice real conversations, generate contextual speaking topics, record your voice naturally, and get instant detailed feedback from our advanced AI Speech Coach. No childish games or cartoon mascots—just high-fidelity vocal analysis designed for modern communicators.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onStartPractice}
                id="btn_hero_get_started"
                className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <span>Mulai Latihan Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onLogin}
                id="btn_hero_secondary_login"
                className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200/80 font-bold text-sm transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
              >
                Masuk ke Akun Anda
              </button>
            </div>

            {/* Quick Trust Indicators */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-lg">
              <div>
                <p className="text-xl font-bold text-slate-900">8+</p>
                <p className="text-[10px] text-slate-400 font-medium">Global Languages Built-in</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">100%</p>
                <p className="text-[10px] text-slate-400 font-medium">AI-driven Voice Analytics</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">No Ads</p>
                <p className="text-[10px] text-slate-400 font-medium">Focused Learning Environment</p>
              </div>
            </div>

          </div>

          {/* Right Product Showcase: Premium Mockup Draft */}
          <div className="lg:col-span-5 flex items-center justify-center relative w-full">
            <div className="relative w-full max-w-md bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden scale-100 hover:scale-[1.01] transition-all duration-500">
              
              {/* Glassmorphism Inner Top decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF8ED] rounded-full blur-xl pointer-events-none" />

              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-[#BABF94]/20 text-[#333C14] rounded-xl font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Topic</h4>
                    <p className="text-xs font-bold text-slate-800">{selectedLang.name} Practice</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                  Topic Room
                </span>
              </div>

              {/* Speech Prompt Card inside Mockup */}
              <div className="bg-[#FAF9F6] border border-slate-100 p-4 rounded-2.5xl text-left space-y-2 mb-6">
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#A98B76]" />
                  <span className="text-[10px] text-[#A98B76] font-bold uppercase tracking-wider">AI Prompt Generator</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-snug">
                  "{selectedLang.promo}"
                </h3>
                <p className="text-[10px] text-slate-405 leading-relaxed italic">
                  Artinya: {selectedLang.translation}
                </p>
              </div>

              {/* Status Meter */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-[#FAF8ED] rounded-xl border border-[#BFA28C]/15 text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time Limit</p>
                  <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">01:00</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Audio Source</p>
                  <p className="text-[10px] font-bold text-[#A98B76] flex items-center justify-center gap-1 mt-1.5">
                    <span className="h-1.5 w-1.5 bg-[#A98B76] rounded-full animate-ping"></span>
                    Microphone Input
                  </p>
                </div>
              </div>

              {/* Simulated Moving Waveform */}
              <div className="bg-slate-900 p-4 rounded-2xl mb-6 relative">
                <div className="flex items-center justify-between text-white/40 text-[9px] font-mono mb-2">
                  <span>LIVE SPEECH TRACKER</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1 text-emerald-400 rounded-full w-4 overflow-hidden bg-slate-700 block"><span className="h-full bg-emerald-400 block animate-pulse"></span></span>
                    STREAMING
                  </span>
                </div>
                
                <div className="h-20 flex items-center justify-center gap-[3px] select-none">
                  {waveHeights.map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }}
                      className={`w-[4px] rounded-full transition-all duration-150 ${
                        i % 2 === 0 ? "bg-gradient-to-t from-[#BFA28C] to-[#FAF8ED]" : "bg-gradient-to-t from-[#BABF94] to-[#F3E4C9]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Simulated AI Analytical Stats Grid */}
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-1">
                  <Brain className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Coach Feedback Draft</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3.5 mt-1.5">
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-emerald-800/80 uppercase font-bold">Confidence</p>
                      <p className="text-sm font-black text-emerald-900">86%</p>
                    </div>
                    <span className="text-emerald-600 bg-white p-1 rounded-lg text-xs font-bold shadow-sm">B2</span>
                  </div>

                  <div className="p-3 bg-[#FAF8ED]/70 rounded-xl border border-[#BFA28C]/20 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-amber-800/80 uppercase font-bold">Fluency</p>
                      <p className="text-sm font-black text-amber-900">82%</p>
                    </div>
                    <span className="text-amber-700 bg-white p-1 rounded-lg text-xs font-bold shadow-sm">B1</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 🇵🇱 LANGUAGE SELECTION & LIVE PREVIEW */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="max-w-xl mx-auto space-y-3">
          <span className="text-[#A98B76] text-[11px] font-bold uppercase tracking-widest block">⭐ MULTI-LANGUAGE ENVIRONMENT</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight font-sans">
            Practice Any Language Of Your Choice
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            MeloTalk adalah platform multibahasa. Silakan klik kartu bahasa di bawah untuk melihat pratinjau topik bicaranya secara instan!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang)}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-30 transition-all cursor-pointer relative ${
                selectedLang.code === lang.code
                  ? "border-[#BABF94] bg-white shadow-md transform -translate-y-1"
                  : "border-slate-205/60 bg-[#FAF9F6]/40 hover:border-slate-200 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl select-none" role="img" aria-label={lang.name}>
                  {lang.flag}
                </span>
                {selectedLang.code === lang.code && (
                  <span className="p-1 bg-[#BABF94]/20 rounded-full text-[#333C14]">
                    <Check className="w-3 h-3 text-[#333C14]" />
                  </span>
                )}
              </div>
              
              <div className="mt-2 text-left">
                <h4 className="text-xs font-bold text-slate-800">{lang.name}</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">{lang.translation.slice(0, 35)}...</p>
              </div>
            </button>
          ))}
        </div>

        {/* Highlighted Selected Language Panel */}
        <div className="max-w-3xl mx-auto p-6 md:p-8 bg-[#FAF8ED]/80 rounded-[2rem] border border-[#BFA28C]/25 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{selectedLang.flag}</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans">
                Topic Showcase ({selectedLang.name})
              </span>
            </div>
            
            <p className="text-md font-bold text-slate-800 font-sans leading-relaxed">
              "{selectedLang.promo}"
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Arti: {selectedLang.translation}
            </p>
            <p className="text-[10px] text-slate-400 leading-normal flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A98B76]"></span>
              {selectedLang.hint}
            </p>
          </div>

          <button
            onClick={onStartPractice}
            className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider transition-all shadow-md flex items-center space-x-1.5 shrink-0 w-full md:w-auto justify-center cursor-pointer"
          >
            <span>Latih Bahasa Ini Now</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </section>

      {/* 🧭 HOW IT WORKS SECTION */}
      <section className="py-20 px-6 border-y border-slate-200/55 bg-white">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[#A98B76] text-[11px] font-bold uppercase tracking-widest block">⚙️ WORKFLOW STEPS</span>
            <h2 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight font-sans">
              Simple Yet Deep Practice Flow
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Proses latihan disusun secara ergonomis dalam 4 tahapan ringkas yang memaksimalkan fokus bicara harian Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative space-y-4 p-4 rounded-2xl text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E4C9]/40 border-2 border-[#BFA28C]/20 flex items-center justify-center text-[#A98B76] font-black text-sm relative z-10 font-mono">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-800">Select Language</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Tentukan bahasa target yang ingin Anda asah hari ini di antara 8+ opsi global unggulan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-4 p-4 rounded-2xl text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-[#BABF94]/20 border-2 border-[#BABF94]/30 flex items-center justify-center text-[#333C14] font-black text-sm relative z-10 font-mono">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-800">Generate Topic</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Sistem MeloTalk AI akan merumuskan topik kasual, profesional, atau wawancara secara acak demi melatih spontanitas berpikir.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-4 p-4 rounded-2xl text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-slate-205 flex items-center justify-center text-slate-700 font-black text-sm relative z-10 font-mono">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-800">Speak Naturally</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Gunakan perekam suara hifi yang bebas hambatan. Bicara santai tanpa stres batas waktu yang mencekam.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative space-y-4 p-4 rounded-2xl text-center md:text-left group">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE0E6] border-2 border-[#FF8DA1]/30 flex items-center justify-center text-[#FF5D7B] font-black text-sm relative z-10 font-mono">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-800">AI Detailed Feedback</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Review seketika mengenai tingkat kelancaran, tata bahasa yang diperbaiki, transkrip kata, dan saran kosa kata baru.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 💎 PRODUCT PREMIUM FEATURES */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        
        <div className="max-w-xl mx-auto text-center space-y-3">
          <span className="text-[#A98B76] text-[11px] font-bold uppercase tracking-widest block">🧩 FEATURE PACKS</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight font-sans">
            Tailored To Speaking Fluent
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            MeloTalk dibangun di atas konsep micro-practice, memberikan seluruh peralatan penting yang mempercepat pemahaman bercakap Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1 */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Random Speaking Topics</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Tidak perlu khawatir kehabisan ide beralasan harian. Dapatkan topik yang dirancang khusus untuk mewadahi kosa kata bervariasi.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A98B76] tracking-wider uppercase">Active Prompt Engine</span>
              <span className="text-[10px] text-slate-400">Unlimited</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">HiFi Voice Recording</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Alat perekam audio internal yang bersih, responsif, dan menyajikan visualisasi waveform bergerak yang merepresentasikan detail napas Anda.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A98B76] tracking-wider uppercase">Direct Audio Input</span>
              <span className="text-[10px] text-slate-400">Zero Lag</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Advanced Speech analysis</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Didukung oleh AI Engine khusus yang menilai lafal, kenyamanan, keselarasan konteks, hingga estimasi sertifikasi standar CEFR.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A98B76] tracking-wider uppercase">AI Analysis Dashboard</span>
              <span className="text-[10px] text-slate-400">Instant</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Live Transcript with Highlights</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Kata-kata yang Anda ucapkan dikonversi menjadi teks secara visual lengkap dengan petunjuk grammar salah berwarna merah dan kosa kata unggul berwarna emas.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A98B76] tracking-wider uppercase">Speech-To-Text</span>
              <span className="text-[10px] text-slate-405">Autocorrect</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Interactive Conversations</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Suhu latihan yang terasa tulus dan nyaman seperti bercakap-cakap santai dengan kawan dekat, bukan sekadar menjawab tes ujian tertulis yang kaku.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A98B76] tracking-wider uppercase">Social Friendly App</span>
              <span className="text-[10px] text-slate-400">Casual Mode</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#BABF94]/20 text-[#333C14] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Vocabulary Enrichment</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Pelajari ribuan glosarium penting yang langsung dikaitkan dengan contoh pengucapan audio demi keluwesan berdiskusi tiap subjek.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A98B76] tracking-wider uppercase">Spaced Repetition</span>
              <span className="text-[10px] text-slate-400">800+ Words</span>
            </div>
          </div>

        </div>

      </section>

      {/* 📊 INTERACTIVE AI ANALYSIS PREVIEW DASHBOARD */}
      <section className="py-20 px-6 border-y border-slate-200/50 bg-[#FAF8ED]/50 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F3E4C9]/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-[#BABF94]/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-[#A98B76] text-[11px] font-bold uppercase tracking-widest block font-sans">📈 COMPREHENSIVE VIEW</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-sans">
              No More Guesswork. <br />
              See Your Speaking Growth.
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              MeloTalk memantau lima dimensi esensial komunikasi vokal Anda. Dapatkan pembagian skor yang mendalam layaknya hasil ujian profesional, namun disajikan dalam visualisasi dashboard modern.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#A98B76] shrink-0 mt-0.5" />
                <span><strong className="font-bold">Confidence Score:</strong> Menilai ketegasan, kestabilan tempo, dan ketiadaan jeda ragu-ragu (filler words).</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#A98B76] shrink-0 mt-0.5" />
                <span><strong className="font-bold">Fluency Dimension:</strong> Menghitung rata-rata kecepatan berbicara Anda per menit secara berkesinambungan.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#A98B76] shrink-0 mt-0.5" />
                <span><strong className="font-bold">Grammar Helper:</strong> Membeberkan koreksi kalimat secara spesifik beserta penjelasan alasannya.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#A98B76] shrink-0 mt-0.5" />
                <span><strong className="font-bold">Pronunciation Check:</strong> Mengidentifikasi kefasihan penekanan kata berdasarkan aksen bahasa sasaran.</span>
              </li>
            </ul>
          </div>

          {/* Right Simulated Dashboard Interactive Preview */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/80 shadow-[0_15px_30px_rgba(0,0,0,0.03)] text-left">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center space-x-2">
                <LineChart className="w-5 h-5 text-[#A98B76]" />
                <span className="text-sm font-bold text-slate-800 font-sans">Vocal Analytics Dashboard</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Simulated AI Feedback
              </span>
            </div>

            <div className="space-y-6">
              {/* Stat 1 */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-700 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#A98B76]" />
                    Confidence
                  </span>
                  <span className="font-mono text-[#A98B76]">86% (B2-Level)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#A98B76] h-full rounded-full" style={{ width: "86%" }}></div>
                </div>
              </div>

              {/* Stat 2 */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-700 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#BABF94]" />
                    Fluency
                  </span>
                  <span className="font-mono text-[#BABF94]">82% (B1-Level)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#BABF94] h-full rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>

              {/* Stat 3 */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-700 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-800" />
                    Grammar Helper
                  </span>
                  <span className="font-mono text-slate-800">90% (Outstanding)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-800 h-full rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>

              {/* Stat 4 */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-700 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#BFA28C]" />
                    Vocabulary Width
                  </span>
                  <span className="font-mono text-[#BFA28C]">78% (Good)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#BFA28C] h-full rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>

              {/* Concrete Grammar Correction example block inside Dashboard */}
              <div className="p-4 bg-slate-50 border-l-4 border-amber-400 rounded-r-xl space-y-1.5">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">AI Live Autocorrect Example:</span>
                <p className="text-xs text-slate-400 leading-snug">
                  Original: <span className="text-red-500 line-through">"I am student in the university..."</span>
                </p>
                <p className="text-xs text-slate-800 font-bold leading-snug">
                  Corrected: <span className="text-emerald-600 font-extrabold font-sans">"I am a student at the university..."</span>
                </p>
                <p className="text-[9px] text-slate-400">
                  Saran: Gunakan preposisi <span className="font-mono font-bold text-slate-600">at</span> untuk lokasi institusi, dan jangan lupa artikel <span className="font-mono font-bold text-slate-600">a</span>.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 🚀 CALL TO ACTION (CTA) SECTION */}
      <section className="py-24 px-6 text-center bg-gradient-to-t from-[#F3E4C9]/40 via-white to-[#FAF9F6] border-t border-slate-200/50 relative overflow-hidden">
        
        <div className="absolute top-1/2 left-10 text-6xl opacity-5 select-none rotate-12">🗣️</div>
        <div className="absolute bottom-12 right-12 text-7xl opacity-5 select-none -rotate-12">🍀</div>

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          
          <div className="space-y-4">
            <span className="text-[#A98B76] text-[11px] font-bold uppercase tracking-widest block font-sans">🎯 BEGIN YOUR PRACTICE TODAY</span>
            <h2 className="text-3xl sm:text-4.5xl font-extrabold text-slate-900 tracking-tight font-sans">
              Unleash Your True Speaking Potential.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto font-sans">
              Bicara dengan lancar tanpa ragu atau cemas. Bergabunglah bersama ribuan profesional, mahasiswa, dan pemikir kreatif untuk mengasah kemampuan bahasa Anda sekarang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartPractice}
              className="px-8 py-4.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-101 transition-all w-full sm:w-auto cursor-pointer"
            >
              Start Free Setup Now 🍀
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4.5 rounded-2xl bg-white text-slate-800 border-2 border-slate-200/80 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 transition w-full sm:w-auto shadow-sm cursor-pointer"
            >
              Sign In To Account
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            Tidak diperlukan kartu kredit • 100% Berbasis Penyimpanan Lokal Aman & Terbuka • No Ads
          </p>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-905 border-t border-slate-200 text-slate-400 text-center text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl select-none">🍀</span>
            <span className="font-bold text-slate-800 font-sans text-md">MeloTalk Startup AI</span>
          </div>
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} MeloTalk AI-powered Speaking Coach Platform. All Rights Reserved.
          </p>
          <div className="flex space-x-4 text-[11px] text-slate-405 font-sans">
            <a href="#" className="hover:text-slate-700 transition">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-slate-700 transition">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
