import React, { useState, useRef, useEffect } from "react";
import { SpeakingTopic } from "../types";
import { getTopics } from "../lib/dbService";
import { generateAllTopics } from "../lib/topicsSeed";

interface SpinWheelProps {
  onTopicSelected: (topic: SpeakingTopic) => void;
  selectedCategory: string;
  selectedDifficulty: string;
  themeColor: string;
  language: string;
}

const WEG_CATEGORIES = [
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
  "Explain Like I'm 5"
];

const COLORS_CLOVER = [
  "#A98B76", "#BFA28C", "#E2E6CC", "#BABF94", 
  "#DCD6CD", "#C8B195", "#E4D9C4", "#A3A87D"
];

export const SpinWheel: React.FC<SpinWheelProps> = ({ 
  onTopicSelected, selectedCategory, selectedDifficulty, themeColor, language 
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultText, setResultText] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Synthesize Click tick SFX
  const playClick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // AudioContext could be locked before first click
    }
  };

  // Synthesize Chime on success landing
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, index * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + index * 0.1);
        osc.stop(audioCtx.currentTime + index * 0.1 + 0.30);
      });
    } catch (e) {}
  };

  const handleSpin = async () => {
    if (spinning) return;

    setSpinning(true);
    setResultText(null);

    // Get qualifying topics from IndexedDB or API
    // If user specified a category, filter by that. Otherwise randomise.
    const activeCat = selectedCategory === "Random" ? WEG_CATEGORIES[Math.floor(Math.random() * WEG_CATEGORIES.length)] : selectedCategory;
    const activeDiff = selectedDifficulty === "Random" ? "Medium" : selectedDifficulty;

    // Fast, instant client-side fallback topic from in-memory cache to guarantee < 1 second response
    const allLocalTopics = generateAllTopics();
    const matchingLocalTopics = allLocalTopics.filter(t => t.category === activeCat);
    const chosenRawLocal = matchingLocalTopics.length > 0 
      ? matchingLocalTopics[Math.floor(Math.random() * matchingLocalTopics.length)]
      : allLocalTopics[Math.floor(Math.random() * allLocalTopics.length)];

    // Translate/localize the chosen raw local topic immediately based on the selected language 
    // to provide an absolute zero-latency, language-accurate fallback!
    const getLocalTranslatedTopic = (baseTopic: SpeakingTopic, lang: string): SpeakingTopic => {
      if (!lang || lang === "English") return baseTopic;

      if (lang === "Indonesian") {
        let indonesianText = baseTopic.text;
        // Simple replacements to make it Indonesian-friendly
        if (baseTopic.text.includes("What is your absolute favorite childhood memory?")) {
          indonesianText = "Apa kenangan masa kecil yang paling berharga bagi Anda?";
        } else if (baseTopic.text.includes("artificial intelligence")) {
          indonesianText = baseTopic.text.replace(/artificial intelligence/gi, "kecerdasan buatan (AI)")
            .replace(/Should/g, "Apakah").replace(/be regulated/g, "harus diregulasi").replace(/or/g, "atau").replace(/left to free innovation/g, "dibiarkan berinovasi bebas");
        } else if (baseTopic.category === "Technology") {
          indonesianText = `Bagaimana perkembangan teknologi memengaruhi kehidupan sehari-hari Anda saat ini?`;
        } else if (baseTopic.category === "Education") {
          indonesianText = `Apakah menurut Anda sistem pendidikan saat ini benar-benar mempersiapkan siswa untuk masa depan?`;
        } else if (baseTopic.category === "Travel") {
          indonesianText = `Jika Anda bisa tinggal di tempat mana pun di dunia, di mana pilihan Anda dan mengapa?`;
        } else {
          indonesianText = `Bagikan pandangan menarik Anda secara mendalam mengenai subjek ini: "${baseTopic.text}"`;
        }
        
        return {
          ...baseTopic,
          text: indonesianText,
          angles: ["Sebagai diri sendiri", "Sebagai pengamat kritis", "Sebagai masyarakat umum"],
          framework: baseTopic.framework || "PREP",
          frameworkHelper: [
            "P (Point): Nyatakan pendapat awal Anda dengan jelas.",
            "R (Reason): Berikan alasan yang melatarbelakangi pendapat tersebut.",
            "E (Example): Berikan contoh nyata atau ilustrasi pendukung.",
            "P (Point): Simpulkan kembali argumen utama Anda."
          ]
        };
      }

      // Other languages backup prefixes (Spanish, Japanese, Chinese, French, etc.)
      const langPrompts: Record<string, string> = {
        Japanese: "考察してください：",
        Korean: "다음 주제에 대해 이야기해 보세요: ",
        Chinese: "谈谈你对以下内容的看法：",
        Spanish: "Comparte tu opinión sobre: ",
        French: "Veuillez partager votre opinion sur: ",
        German: "Teilen Sie Ihre Meinung zu: "
      };
      const prefix = langPrompts[lang] || "Discuss: ";
      return {
        ...baseTopic,
        text: `${prefix}"${baseTopic.text}"`,
        angles: ["As yourself", "As an objective observer", "As a modern citizen"],
        framework: baseTopic.framework || "PREP",
        frameworkHelper: [
          "P (Point): State your primary point clearly.",
          "R (Reason): Supply reasons that validate your position.",
          "E (Example): Offer a relatable example or use-case.",
          "P (Point): Conclude with a strong takeaway statement."
        ]
      };
    };

    const localFallbackTopic = getLocalTranslatedTopic(chosenRawLocal, language);
    let apiTopic: SpeakingTopic | null = null;

    // Start fetching from our beautiful, language-aware API in parallel to spinning
    const fetchPromise = fetch("/api/gemini/generate-topic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        category: activeCat,
        difficulty: activeDiff
      })
    })
    .then((res) => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then((data) => {
      apiTopic = {
        id: `topic_${Date.now()}`,
        text: data.text,
        category: data.category,
        difficulty: data.difficulty as any,
        angles: data.angles,
        framework: data.framework,
        frameworkHelper: data.frameworkHelper
      };
    })
    .catch((err) => {
      console.warn("API dynamic topic fetch slow or failed, using local database seed instead.");
    });

    // Find target angle based on sector
    const sectorCount = WEG_CATEGORIES.length;
    // We match the visual landing wedge to our target category
    const targetWedgeIdx = WEG_CATEGORIES.indexOf(activeCat) !== -1 ? WEG_CATEGORIES.indexOf(activeCat) : 0;
    const sectorAngle = 360 / sectorCount;
    // Calculate final rotation to land pointer on specified category
    const extraSpins = 3 + Math.floor(Math.random() * 2); // 3-4 full spins (snappy and fast!)
    const targetDegrees = (extraSpins * 360) + (360 - (targetWedgeIdx * sectorAngle) - (sectorAngle / 2));

    const totalDuration = 750; // Snappy visual spin speed of 750ms (Topic generated visually in < 1 second!)
    const startTime = performance.now();
    const initialRotation = rotation % 360;

    let lastTickAngle = 0;

    const animateWheel = async (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Decelerate cubic easing
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentEase = easeOutCubic(progress);
      const currentRotation = initialRotation + (targetDegrees - initialRotation) * currentEase;

      setRotation(currentRotation);

      // Realistic clicking sound based on crossings
      const currentTickAngle = Math.floor(currentRotation / (360 / sectorCount));
      if (currentTickAngle !== lastTickAngle) {
        playClick();
        lastTickAngle = currentTickAngle;
      }

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        // Enforce completion of background API / fallback fetch ONLY if it finishes super fast
        // We set a max race of 80ms or proceed with our ready local fallback to guarantee under 1s total latency!
        await Promise.race([
          fetchPromise,
          new Promise((resolve) => setTimeout(resolve, 80))
        ]);

        setSpinning(false);
        playChime();

        const selectedOutcomeTopic = apiTopic || localFallbackTopic;
        setResultText(selectedOutcomeTopic.text);
        onTopicSelected(selectedOutcomeTopic);
      }
    };

    requestAnimationFrame(animateWheel);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 select-none">
      
      {/* 🎡 The Physical Wheel and Node Pointer */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        
        {/* 🔻 Golden Arrow Pin Point */}
        <div className="absolute top-[-10px] w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-500 hover:scale-110 active:scale-95 transition-transform z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"></div>

        {/* 🎡 SVG Radial Pie Wheel Wrapper */}
        <div 
          ref={wheelRef} 
          style={{ transform: `rotate(${rotation}deg)` }}
          className="w-full h-full rounded-full border-8 border-amber-800 shadow-[0_12px_24px_rgba(0,0,0,0.15)] overflow-hidden bg-white z-10 select-none will-change-transform"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <g transform="translate(100,100)">
              {WEG_CATEGORIES.map((cat, idx) => {
                const count = WEG_CATEGORIES.length;
                const angle = 360 / count;
                const startRad = ((idx * angle) - 90) * Math.PI / 180;
                const endRad = (((idx + 1) * angle) - 90) * Math.PI / 180;

                const x1 = Math.cos(startRad) * 98;
                const y1 = Math.sin(startRad) * 98;
                const x2 = Math.cos(endRad) * 98;
                const y2 = Math.sin(endRad) * 98;

                const pathData = `M 0 0 L ${x1} ${y1} A 98 98 0 0 1 ${x2} ${y2} Z`;
                const wedgeColor = COLORS_CLOVER[idx % COLORS_CLOVER.length];

                return (
                  <g key={cat}>
                    {/* Wedge Segment */}
                    <path 
                      d={pathData} 
                      fill={wedgeColor} 
                      stroke="#FFFFFF" 
                      strokeWidth="0.5"
                    />
                    {/* Wedge Text (Truncated & rotated) */}
                    <text
                      transform={`rotate(${(idx * angle) + (angle / 2)}), translate(52, 0)`}
                      textAnchor="middle"
                      fill="#374151"
                      className="font-semibold"
                      style={{ fontSize: "5.5px", letterSpacing: "0.1px" }}
                    >
                      {cat.length > 13 ? `${cat.substring(0, 11)}..` : cat}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* 🔘 Tiny Center Clover Cap Button */}
        <button 
          onClick={handleSpin}
          disabled={spinning}
          className="absolute w-20 h-20 rounded-full bg-white border-4 border-amber-800 hover:border-amber-600 shadow-md flex items-center justify-center z-20 focus:outline-none transition-transform hover:scale-105 active:scale-95 disabled:opacity-90 disabled:scale-100"
        >
          <div className="flex flex-col items-center justify-center p-1">
            <span className={`text-2xl ${spinning ? "animate-spin" : "hover:animate-bounce"}`}>
              🍀
            </span>
            <span className="text-[9px] font-bold text-amber-900 tracking-wider">
              {spinning ? "SPINNING" : "SPIN"}
            </span>
          </div>
        </button>
      </div>

      {/* 🚀 Active triggers indicator */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          Target Kategori: <span className="font-semibold text-slate-700">{selectedCategory}</span> • Kesulitan: <span className="font-semibold text-slate-700">{selectedDifficulty}</span>
        </p>
      </div>
    </div>
  );
};
