import React, { useState } from "react";
import { SpeakingTopic, SpeechAnalysis, HighlightItem } from "../../types";
import { Briefcase, CreditCard, HelpCircle, Star, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { VoiceRecorder } from "../VoiceRecorder";

interface InterviewPrepProps {
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

interface QuestionDef {
  text: string;
  category: string;
  framework: 'STAR' | 'PREP' | 'PAR' | 'CAR';
}

const INTERVIEW_QUESTIONS: QuestionDef[] = [
  { text: "Ceritakan pencapaian profesional terbesar dalam kariermu sejauh ini.", category: "HR", framework: "STAR" },
  { text: "Bagaimana cara kamu menghadapi konflik di dalam tim kerja?", category: "Behavioral", framework: "STAR" },
  { text: "Jelaskan situasi ketika kamu harus menangani pelanggan yang sangat marah.", category: "Customer Service", framework: "CAR" },
  { text: "Bagaimana kamu memprioritaskan tugas saat menghadapi tenggat waktu yang ketat?", category: "Leadership", framework: "PREP" },
  { text: "Deskripsikan kesalahan teknis terbesar saat rilis software dan cara kamu membereskannya.", category: "Software Engineering", framework: "PAR" },
  { text: "Mengapa kamu mengajukan aplikasi untuk magang (internship) di perusahaan teknologi kami?", category: "Internship", framework: "PREP" },
  { text: "Mengapa komite beasiswa harus memilih kamu di antara ratusan pendaftar lainnya?", category: "Scholarship", framework: "PREP" },
  { text: "Jelaskan proyek tersulit yang pernah kamu kerjakan selama masa kuliah.", category: "Fresh Graduate", framework: "STAR" },
  { text: "Bagaimana pandangan kamu tentang bekerja di bawah tekanan tinggi secara tim?", category: "HR", framework: "PREP" }
];

const FRAMEWORK_GUIDES = {
  STAR: {
    name: "STAR Framework (Paling Populer untuk Behavioral)",
    steps: [
      { key: "S", label: "Situation", desc: "Deskripsikan latar belakang situasi atau proyek secara ringkas." },
      { key: "T", label: "Task", desc: "Jelaskan tantangan, tugas, atau tanggung jawab yang harus kamu selesaikan." },
      { key: "A", label: "Action", desc: "Jabarkan aksi nyata yang kamu ambil secara personal (bukan tim)." },
      { key: "R", label: "Result", desc: "Tunjukkan hasil konkret yang dicapai, idealnya gunakan angka/metrik." }
    ]
  },
  PREP: {
    name: "PREP Framework (Sangat Baik untuk Opini & Tanya Jawab HR)",
    steps: [
      { key: "P", label: "Point", desc: "Nyatakan langsung poin atau posisi jawaban utamamu." },
      { key: "R", label: "Reason", desc: "Berikan alasan logis mengapa kamu memiliki pandangan tersebut." },
      { key: "E", label: "Example", desc: "Sajikan contoh nyata, ilustrasi, atau studi kasus pendukung." },
      { key: "P", label: "Point", desc: "Tegaskan kembali kesimpulan atau poin utamamu di akhir." }
    ]
  },
  PAR: {
    name: "PAR Method (Sangat Baik untuk Cerita Problem-Solving)",
    steps: [
      { key: "P", label: "Problem", desc: "Paparkan masalah krusial yang mendadak dihadapi." },
      { key: "A", label: "Action", desc: "Jelaskan tindakan taktis dan teknis yang diambil." },
      { key: "R", label: "Result", desc: "Sebutkan hasil pemulihan situasi pascalindasan aksi." }
    ]
  },
  CAR: {
    name: "CAR Framework (Cocok untuk Menjelaskan Context)",
    steps: [
      { key: "C", label: "Context", desc: "Gambarkan kondisi dan konteks pekerjaan umum saat itu." },
      { key: "A", label: "Action", desc: "Artikulasikan perananmu dan eksekusi yang kamu lakukan." },
      { key: "R", label: "Result", desc: "Evaluasi hasil akhir yang memuaskan." }
    ]
  }
};

export const InterviewPrepView: React.FC<InterviewPrepProps> = ({
  onAnalysisSuccess, accentBtn, secondaryBtn
}) => {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [activeQuestion, setActiveQuestion] = useState<QuestionDef | null>(null);

  const categories = ["All", ...Array.from(new Set(INTERVIEW_QUESTIONS.map((q) => q.category)))];

  const filteredQuestions = selectedCat === "All"
    ? INTERVIEW_QUESTIONS
    : INTERVIEW_QUESTIONS.filter((q) => q.category === selectedCat);

  const handleInterviewComplete = (
    analysis: SpeechAnalysis,
    base64Audio: string,
    durationSec: number,
    transcript: string,
    highlights: HighlightItem[]
  ) => {
    if (!activeQuestion) return;

    onAnalysisSuccess(
      analysis,
      base64Audio,
      durationSec,
      activeQuestion.text,
      `Interview Prep (${activeQuestion.category})`,
      transcript,
      highlights
    );
    setActiveQuestion(null);
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* 💼 Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
          <span>💼 Interview Preparation Suite</span>
          <span className="text-[10px] bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold">STAR & PREP GUIDES</span>
        </h2>
        <p className="text-xs text-slate-400">Atur taktik wawancaramu! Pilih kategori wawancara, pelajari kerangka penataan STAR/PREP, lalu rekam jawaban hebatmu.</p>
      </div>

      {!activeQuestion ? (
        <div className="space-y-6">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedCat === cat 
                    ? "bg-slate-800 border-slate-900 text-white shadow-sm" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q, idx) => (
              <div 
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">{q.category}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">{q.framework} Guide</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 font-sans leading-relaxed group-hover:text-slate-900 transition">
                    "{q.text}"
                  </h3>
                </div>

                <button
                  onClick={() => setActiveQuestion(q)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-dashed text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition`}
                >
                  <span>Latih Dengan {q.framework}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Question with Framework Side-by-Side */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: STAR / PREP instructions (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-[#FAF9F6] to-[#F3E4C9]/20 p-5 rounded-3xl border-2 border-slate-100 space-y-4">
            <div>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">Guide Framework</span>
              <h4 className="text-sm font-bold text-slate-800 mt-2">
                {FRAMEWORK_GUIDES[activeQuestion.framework].name}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Strukturkan jawabanmu mengikuti tahapan di bawah ini agar terlihat sangat teratur dan profesional bagi panel pewawancara.</p>
            </div>

            <div className="space-y-3">
              {FRAMEWORK_GUIDES[activeQuestion.framework].steps.map((step) => (
                <div key={step.key} className="flex items-start space-x-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {step.key}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">{step.label}</span>
                    <span className="text-[10px] text-slate-500 leading-relaxed">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Recorder workspace (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center space-y-6">
            
            <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative">
              <span className="text-[8px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest block w-fit">SIMULASI INTERVIEW</span>
              
              <h3 className="text-base font-bold text-slate-700 leading-relaxed mt-3 font-sans">
                "{activeQuestion.text}"
              </h3>
              
              <button
                onClick={() => setActiveQuestion(null)}
                className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition"
              >
                Kembali
              </button>
            </div>

            <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <VoiceRecorder 
                topicText={activeQuestion.text}
                category={`Interview (${activeQuestion.category})`}
                onAnalysisSuccess={handleInterviewComplete}
                accentBtn={accentBtn}
                secondaryBtn={secondaryBtn}
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
