import React, { useState } from "react";
import { SpinWheel } from "../SpinWheel";
import { VoiceRecorder } from "../VoiceRecorder";
import { SpeakingTopic, SpeechAnalysis, HighlightItem } from "../../types";
import { AlertCircle, HelpCircle, Sparkles, Languages, RefreshCw, Layers } from "lucide-react";
import { AIAnalysisView } from "./AIAnalysisView";

interface TopicsViewProps {
  theme: string;
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

const CATEGORIES = [
  "Random",
  "General",
  "Technology",
  "Education",
  "Lifestyle",
  "Travel",
  "Business",
  "Food",
  "Entertainment",
  "Debate",
  "Storytelling",
  "Interview",
  "One Minute Pitch",
  "Explain Like I'm 5",
  "Hot Takes",
  "Creative Thinking"
];

const DIFFICULTIES = ["Random", "Easy", "Medium", "Hard"];

const LANGUAGES = [
  { name: "English", label: "English", flag: "🇬🇧" },
  { name: "Indonesian", label: "Indo", flag: "🇮🇩" },
  { name: "Japanese", label: "Nihongo", flag: "🇯🇵" },
  { name: "Korean", label: "Hangul", flag: "🇰🇷" },
  { name: "Chinese", label: "Chinese", flag: "🇨🇳" },
  { name: "Spanish", label: "Español", flag: "🇪🇸" },
  { name: "French", label: "Français", flag: "🇫🇷" },
  { name: "German", label: "Deutsch", flag: "🇩🇪" },
  { name: "Arabic", label: "Arabic", flag: "🇸🇦" },
  { name: "Turkish", label: "Türkçe", flag: "🇹🇷" },
  { name: "Thai", label: "Thai", flag: "🇹🇭" },
  { name: "Hindi", label: "Hindi", flag: "🇮🇳" },
  { name: "Portuguese", label: "Português", flag: "🇵🇹" },
  { name: "Italian", label: "Italiano", flag: "🇮🇹" }
];

export const TopicsView: React.FC<TopicsViewProps> = ({
  theme, onAnalysisSuccess, accentBtn, secondaryBtn
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => 
    localStorage.getItem("melotalk_pref_category") || "Random"
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(() => 
    localStorage.getItem("melotalk_pref_difficulty") || "Random"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => 
    localStorage.getItem("melotalk_pref_language") || "English"
  );
  const [activeTopic, setActiveTopic] = useState<SpeakingTopic | null>(null);

  // Deep conversational practice history state
  const [inlineAnalysisResult, setInlineAnalysisResult] = useState<{
    topicText: string;
    category: string;
    duration: number;
    timestamp: string;
    transcript: string;
    highlights: HighlightItem[];
    analysis: SpeechAnalysis;
  } | null>(null);

  const getThemeColor = () => {
    if (theme === "cute") return "#FF8DA1";
    if (theme === "nature") return "#8DA47E";
    return "#BABF94"; // Clover default
  };

  const handleTopicSelected = (topic: SpeakingTopic) => {
    setActiveTopic(topic);
    setInlineAnalysisResult(null); // Clear previous inline analysis
  };

  const handleRecorderAnalysis = (
    analysis: SpeechAnalysis,
    base64Audio: string,
    durationSec: number,
    transcript: string,
    highlights: HighlightItem[]
  ) => {
    if (activeTopic) {
      // Formulate our custom analysis record
      const record = {
        topicText: activeTopic.text,
        category: activeTopic.category,
        duration: durationSec,
        timestamp: new Date().toLocaleDateString("id-ID"),
        transcript,
        highlights,
        analysis
      };

      setInlineAnalysisResult(record);

      // Report up to app tree for stats, levels and saving in DB
      onAnalysisSuccess(
        analysis,
        base64Audio,
        durationSec,
        activeTopic.text,
        activeTopic.category,
        transcript,
        highlights
      );
    }
  };

  const handleStartPracticeFollowUp = (questionText: string) => {
    // Reset our trainer of followups
    setInlineAnalysisResult(null);
    setActiveTopic({
      id: `topic_${Date.now()}`,
      text: questionText,
      category: activeTopic ? activeTopic.category : "General",
      difficulty: "Medium",
      angles: selectedLanguage === "Indonesian"
        ? ["Sebagai pengabdi isu terkait", "Sebagai pemikir logis", "Sebagai diri Anda sendiri"]
        : ["As yourself", "As a balanced critical speaker", "As a professional analyst"],
      framework: "PREP",
      frameworkHelper: selectedLanguage === "Indonesian"
        ? ["P: Nyatakan pendapat awal Anda.", "R: Berikan alasan melatarbelakangi opini.", "E: Jabarkan ilustrasi nyata.", "P: Tegaskan ringkasan simpulan."]
        : ["P: Assert your position.", "R: Provide supporting reasons.", "E: Standardize with illustrative case.", "P: Conclude summary position."]
    });
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 🇬🇧 Language Carousel - 14 Languages Supported */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Languages className="w-4 h-4 text-[#A98B76]" />
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans">
            PILIH BAHASA LATIHAN (14 BAHASA DIDUKUNG)
          </h3>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.name;
            return (
              <button
                key={lang.name}
                onClick={() => {
                  setSelectedLanguage(lang.name);
                  localStorage.setItem("melotalk_pref_language", lang.name);
                  setActiveTopic(null);
                  setInlineAnalysisResult(null);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  isSelected 
                    ? "bg-[#BABF94] text-[#333C14] border border-[#BABF94]/70 shadow-sm scale-105" 
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!inlineAnalysisResult && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
              <span>🎲 Konfigurasi Roda Topik</span>
              <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-mono">LIVE AI</span>
            </h2>
            <p className="text-xs text-slate-400">Atur kategori & tingkat kesulitan, lalu putar roda di bawah untuk memicu AI menghasilkan topik custom dalam bahasa {selectedLanguage}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori Topik</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  localStorage.setItem("melotalk_pref_category", e.target.value);
                  setActiveTopic(null); // Clear active topic when category changes
                }}
                className="w-full px-3 py-2 text-xs border border-slate-205 bg-[#FAF9F6] rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans cursor-pointer text-slate-700 font-semibold"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Kesulitan</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  localStorage.setItem("melotalk_pref_difficulty", e.target.value);
                  setActiveTopic(null);
                }}
                className="w-full px-3 py-2 text-xs border border-slate-205 bg-[#FAF9F6] rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 font-sans cursor-pointer text-slate-700 font-semibold"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {inlineAnalysisResult ? (
        /* 📈 Show Interactive Speech Assessment Feedback Inline! */
        <div className="space-y-6 animate-scale-up">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl">🌱</span>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Evaluasi Speaking Selesai!</h3>
                <p className="text-xs text-slate-400">Lanjutkan mengobrol atau putar roda lagi untuk tantangan lainnya.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveTopic(null);
                setInlineAnalysisResult(null);
              }}
              className={`px-5 py-2 rounded-full ${accentBtn} text-xs font-bold flex items-center space-x-1.5 transition`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>PUTAR RODA LAGI 🎡</span>
            </button>
          </div>

          <AIAnalysisView
            activeRecord={inlineAnalysisResult}
            onNavigate={(tab) => {
              if (tab === "topics") {
                setActiveTopic(null);
                setInlineAnalysisResult(null);
              }
            }}
            accentBtn={accentBtn}
            onStartPracticeFollowUp={handleStartPracticeFollowUp}
          />
        </div>
      ) : !activeTopic ? (
        /* 🎡 Spinner Wheel Selector Block */
        <div className="bg-white/70 p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-base font-bold text-amber-900 flex items-center space-x-1.5 font-sans">
            <span>🎡 Putar Roda Latihan ({selectedLanguage})</span>
          </h3>
          <p className="text-xs text-slate-400 text-center mb-4 max-w-sm font-sans">
            Klik 'SPIN' di tengah roda untuk merumuskan topik speaking secara acak dalam bahasa pilihanmu!
          </p>
          <SpinWheel 
            onTopicSelected={handleTopicSelected}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            themeColor={getThemeColor()}
            language={selectedLanguage}
          />
        </div>
      ) : (
        /* 🎙️ Practice Workspace Area containing instructions, angles, framework checklists and Recorder */
        <div className="w-full flex flex-col items-center space-y-6">
          
          {/* Selected Topic Presentation Card */}
          <div className="w-full max-w-2xl bg-gradient-to-tr from-amber-50 to-[#FAF8ED] p-8 rounded-3xl border-2 border-[#BABF94]/40 shadow-sm text-center relative overflow-hidden space-y-5">
            {/* Corner Ornaments */}
            <div className="absolute top-3 left-3 text-2xl opacity-25">🍀</div>
            <div className="absolute bottom-3 right-3 text-2xl opacity-25">🐟</div>
            
            <div className="flex justify-center items-center gap-2">
              <span className="text-[10px] px-3 py-1 font-bold rounded-full bg-[#BABF94] text-[#333C14] uppercase tracking-widest">
                Kategori: {activeTopic.category}
              </span>
              <span className={`text-[10px] px-3 py-1 font-bold rounded-full text-white uppercase tracking-widest ${
                activeTopic.difficulty === "Easy" ? "bg-emerald-500" :
                activeTopic.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
              }`}>
                {activeTopic.difficulty}
              </span>
              <span className="text-[10px] px-3 py-1 font-bold rounded-full bg-indigo-505 bg-indigo-501 bg-indigo-500 text-white uppercase tracking-widest">
                {selectedLanguage}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-relaxed max-w-xl mx-auto font-sans">
                "{activeTopic.text}"
              </h3>
              <p className="text-xs text-slate-400">Tekan tombol rekam di bawah, gunakan struktur bimbingan, lalu bicaralah sesantai mungkin.</p>
            </div>

            {/* 🎭 SPEAKING ANGLES SECTION */}
            {activeTopic.angles && activeTopic.angles.length > 0 && (
              <div className="space-y-2 border-t border-[#BABF94]/25 pt-3">
                <p className="text-[10px] font-bold text-slate-505 text-slate-500 uppercase tracking-widest text-left sm:text-center flex items-center justify-start sm:justify-center gap-1">
                  <span>🎭</span>
                  <span>Sudut Pandang Berbicara (Speaking Angle)</span>
                </p>
                <div className="flex flex-wrap gap-1.5 justify-start sm:justify-center">
                  {activeTopic.angles.map((angle, idx) => (
                    <span key={idx} className="bg-amber-100/70 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold shadow-inner">
                      {angle}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 📓 STRUCTURE LOGICAL FRAMEWORK CHECKLIST */}
            {activeTopic.framework && (
              <div className="text-left bg-[#FFFAF0] border border-amber-200 p-4 rounded-2xl space-y-2 max-w-xl mx-auto">
                <div className="flex items-center space-x-1.5 text-amber-900 font-sans">
                  <span>📓</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Panduan Berpikir (Struktur laras: {activeTopic.framework})
                  </span>
                </div>
                {activeTopic.frameworkHelper && activeTopic.frameworkHelper.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeTopic.frameworkHelper.map((step, idx) => (
                      <div key={idx} className="bg-white/80 p-2.5 rounded-xl border border-amber-100 flex items-start space-x-2">
                        <span className="bg-[#BABF94] text-[#333C14] text-[9px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold mt-0.5 shadow">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-700 leading-normal font-sans font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Gunakan kerangka logis di atas untuk menjabarkan pandangan Anda!</p>
                )}
              </div>
            )}

            {/* Change selection trigger buttons */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTopic(null);
                  setInlineAnalysisResult(null);
                }}
                className={`px-5 py-2 rounded-full ${secondaryBtn} text-xs font-bold transition flex items-center space-x-1.5 mx-auto`}
              >
                <span>🔄 PUTAR ULANG TOPIC LAIN</span>
              </button>
            </div>
          </div>

          {/* 🎙️ Voice Recorder Block */}
          <div className="w-full max-w-2xl bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <VoiceRecorder 
              topicText={activeTopic.text}
              category={activeTopic.category}
              onAnalysisSuccess={handleRecorderAnalysis}
              accentBtn={accentBtn}
              secondaryBtn={secondaryBtn}
              language={selectedLanguage}
            />
          </div>

          {/* Speaking Coach Tip */}
          <div className="w-full max-w-2xl p-4 bg-[#F9F7F5] rounded-xl border border-amber-100 flex items-start space-x-2.5 text-xs text-slate-500 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-700">Melo Coach Tip: </span>
              Cobalah berbicara dengan beraturan, pertahankan intonasi yang bersahabat, dan hirup napas secara rileks. MeloTalk AI Coach menyukai ritme pelafalan yang mengalir alami dan tulus!
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
