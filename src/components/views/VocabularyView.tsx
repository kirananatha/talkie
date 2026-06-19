import React, { useState, useEffect } from "react";
import { VocabularyWord } from "../../types";
import { getVocabulary, saveVocabularyWord } from "../../lib/dbService";
import { BookOpen, Star, Sparkles, Check, CheckCircle2, Bookmark, BookmarkCheck, ArrowRight, RefreshCw, Volume2 } from "lucide-react";

interface VocabularyViewProps {
  userId: string;
  onLearnProgressUpdated: () => void;
  accentBtn: string;
  secondaryBtn: string;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  userId, onLearnProgressUpdated, accentBtn, secondaryBtn
}) => {
  const [vocabList, setVocabList] = useState<VocabularyWord[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'learned'>('all');
  const [quizState, setQuizState] = useState<'idle' | 'question' | 'correct' | 'incorrect'>('idle');
  const [quizWord, setQuizWord] = useState<VocabularyWord | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);

  useEffect(() => {
    loadVocabs();
  }, [userId]);

  const loadVocabs = () => {
    getVocabulary(userId).then(setVocabList);
  };

  const toggleSaveWord = (word: VocabularyWord) => {
    const updated = { ...word, saved: !word.saved, savedDate: new Date().toISOString() };
    saveVocabularyWord(updated, userId).then(() => {
      loadVocabs();
    });
  };

  const toggleLearnWord = (word: VocabularyWord) => {
    const updated = { ...word, learned: !word.learned, learnedDate: new Date().toISOString() };
    saveVocabularyWord(updated, userId).then(() => {
      loadVocabs();
      onLearnProgressUpdated(); // update achievements & CEFR stats
    });
  };

  // 🗣️ Text-To-Speech Pronunciation engine
  const runTTS = (text: string) => {
    try {
      const synth = window.speechSynthesis;
      if (synth) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        utter.rate = 0.85; // slightly slower for speech learning
        synth.speak(utter);
      }
    } catch (e) {}
  };

  // Launch vocabulary Quiz
  const startQuiz = () => {
    if (vocabList.length < 3) return;
    
    // Pick random target word
    const targetIdx = Math.floor(Math.random() * vocabList.length);
    const target = vocabList[targetIdx];
    setQuizWord(target);

    // Create 3 decoy options
    const decoys = vocabList
      .filter((w) => w.id !== target.id)
      .map((w) => w.meaning);
    
    // Shuffle Target + Decoys
    const options = [target.meaning];
    while (options.length < 4 && decoys.length > 0) {
      const randomDecoy = decoys.splice(Math.floor(Math.random() * decoys.length), 1)[0];
      options.push(randomDecoy);
    }
    options.sort(() => Math.random() - 0.5);

    setQuizOptions(options);
    setQuizSelected(null);
    setQuizState("question");
  };

  const handleQuizSubmit = (opt: string) => {
    if (!quizWord) return;
    setQuizSelected(opt);
    if (opt === quizWord.meaning) {
      setQuizState("correct");
      // Autocomplete word as learned
      if (!quizWord.learned) {
        toggleLearnWord(quizWord);
      }
    } else {
      setQuizState("incorrect");
    }
  };

  const filteredWords = vocabList.filter((word) => {
    if (activeTab === "saved") return word.saved;
    if (activeTab === "learned") return word.learned;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 📚 Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
          <span>📚 Vocabulary Master Center</span>
          <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full">STUDY COMPANION</span>
        </h2>
        <p className="text-xs text-slate-400">Tingkatkan perbendaharaan katamu! Tandai kosa kata penting yang telah dikuasai, dengarkan cara pengucapan (native audio), atau buktikan kemampuanmu di Kuis Tantangan!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 📚 LEFT: Word Deck Section (7 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold select-none ${
                  activeTab === 'all' ? "bg-[#BABF94] text-[#333C14] font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Semua Kosakata ({vocabList.length})
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold select-none ${
                  activeTab === 'saved' ? "bg-[#BABF94] text-[#333C14] font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Tersimpan ({vocabList.filter((w) => w.saved).length})
              </button>
              <button
                onClick={() => setActiveTab('learned')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold select-none ${
                  activeTab === 'learned' ? "bg-[#BABF94] text-[#333C14] font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Dikuasai ({vocabList.filter((w) => w.learned).length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredWords.map((word) => (
              <div 
                key={word.id}
                className={`bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4 relative ${
                  word.learned ? "bg-emerald-50/25 border-emerald-100" : "hover:shadow-md transition-shadow"
                }`}
              >
                {/* Save and speak actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => runTTS(word.word)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                      title="Pelafalan Audio USA"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full font-bold uppercase">{word.difficulty}</span>
                  </div>

                  <button
                    onClick={() => toggleSaveWord(word)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition"
                  >
                    {word.saved ? <BookmarkCheck className="w-5 h-5 text-amber-500" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800" style={{ fontFamily: "var(--font-sans)" }}>{word.word}</h3>
                  <code className="text-xs font-mono text-slate-400 block pb-1 border-b border-dashed">{word.pronunciation}</code>
                  <p className="text-xs text-slate-600 font-sans pt-1 font-medium">{word.meaning}</p>
                  <p className="text-[10px] text-slate-400 font-sans italic leading-relaxed pt-1">e.g. "{word.example}"</p>
                </div>

                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  {word.learned ? (
                    <div className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sudah Dikuasai</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tandai Sudah Paham:</span>
                  )}

                  <button
                    onClick={() => toggleLearnWord(word)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border transition ${
                      word.learned 
                        ? "bg-slate-100 border-slate-200 text-slate-500" 
                        : "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {word.learned ? "Reset status" : "Kuasai"}
                  </button>
                </div>
              </div>
            ))}

            {filteredWords.length === 0 && (
              <div className="col-span-2 text-center py-12 p-6 bg-slate-50 rounded-2xl text-slate-400 text-xs">
                Belum ada kosakata di filter tab ini. Tandai kosakata favoritemu untuk memantau kemajuan!
              </div>
            )}
          </div>
        </div>

        {/* 🧠 RIGHT: Gamified Quiz panel (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-tr from-indigo-50/30 to-purple-50/20 p-5 rounded-3xl border border-dashed border-indigo-200 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest flex items-center space-x-1.5 select-none">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Vocabulary Quiz Challenge</span>
            </h3>
            <p className="text-[11px] text-indigo-600/70 leading-relaxed mt-1">Uji pemahaman kosakatamu untuk melipatgandakan kosa kata yang dikuasai!</p>
          </div>

          {quizState === "idle" && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🧩</div>
              <button
                onClick={startQuiz}
                className={`w-full py-2.5 font-bold text-xs rounded-xl ${accentBtn}`}
              >
                MULAI KUIS KATA
              </button>
            </div>
          )}

          {quizState === "question" && quizWord && (
            <div className="space-y-4">
              <div className="text-center p-3.5 bg-white rounded-2xl border">
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Arti dari kosakata:</span>
                <h4 className="text-lg font-black text-slate-800 mt-1">{quizWord.word}</h4>
              </div>

              <div className="space-y-2">
                {quizOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizSubmit(opt)}
                    className="w-full text-left p-3 text-xs bg-white hover:bg-indigo-50 border border-slate-100 rounded-xl transition text-slate-700 font-medium leading-relaxed"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizState === "correct" && quizWord && (
            <div className="text-center py-4 space-y-4">
              <div className="text-4xl">🎉</div>
              <p className="text-xs font-bold text-emerald-700">Luar biasa! Jawabanmu 100% Benar.</p>
              <p className="text-[11px] text-slate-500">"{quizWord.word}" berarti "{quizWord.meaning}". Kosakata ini sekarang ditandai sebagai dikuasai.</p>
              <button
                onClick={startQuiz}
                className={`w-full py-2.5 font-bold text-xs rounded-xl ${accentBtn} flex items-center justify-center space-x-1`}
              >
                <span>Pertanyaan Berikutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {quizState === "incorrect" && quizWord && (
            <div className="text-center py-4 space-y-4">
              <div className="text-4xl">🥲</div>
              <p className="text-xs font-bold text-red-700">Waduh! Jawabanmu masih kurang tepat.</p>
              <p className="text-[11px] text-slate-500">Silakan ulangi kembali untuk belajar.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setQuizState("question")}
                  className="w-1/2 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={startQuiz}
                  className={`w-1/2 py-2 font-bold text-xs rounded-xl ${accentBtn}`}
                >
                  Skip kata
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
