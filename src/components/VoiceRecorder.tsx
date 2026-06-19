import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, ArrowRight, RotateCcw, AlertCircle } from "lucide-react";
import { SpeechAnalysis, HighlightItem } from "../types";

interface VoiceRecorderProps {
  topicText: string;
  category: string;
  onAnalysisSuccess: (analysis: SpeechAnalysis, base64Audio: string, durationSec: number, transcript: string, highlights: HighlightItem[]) => void;
  accentBtn: string;
  secondaryBtn: string;
  language: string;
}

const TIMER_OPTIONS = [
  { label: "30s", value: 30 },
  { label: "1 Min", value: 60 },
  { label: "2 Min", value: 120 },
  { label: "3 Min", value: 180 },
  { label: "5 Min", value: 300 }
];

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  topicText, category, onAnalysisSuccess, accentBtn, secondaryBtn, language
}) => {
  const [selectedTimer, setSelectedTimer] = useState<number>(60); // Default 1 minute
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused" | "finished">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisTimeoutReached, setAnalysisTimeoutReached] = useState(false);
  const [analystError, setAnalystError] = useState<string | null>(null);
  const [speakingMetrics, setSpeakingMetrics] = useState({ vol: 0 }); // Wave visualizer simulation

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioHTMLRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync Timer Initial value
  useEffect(() => {
    if (recordingState === "idle") {
      setTimeLeft(selectedTimer);
    }
  }, [selectedTimer, recordingState]);

  // Handle Cleanups
  useEffect(() => {
    return () => {
      stopInterval();
      stopAudioVisualizer();
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, []);

  const startInterval = () => {
    stopInterval();
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // 🎙️ Request Permission and Start Media Grab
  const startRecording = async () => {
    setAnalystError(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        setRecordingState("finished");
        stopAudioVisualizer();
      };

      mediaRecorder.start(250); // Get chunks every 250ms
      setRecordingState("recording");
      startInterval();
      startAudioVisualizer(stream);

    } catch (err: any) {
      console.error("Mic access failure:", err);
      setAnalystError("Cannot access your microphone. Please grant mic permission in your browser to speak.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
      stopInterval();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
      startInterval();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (recordingState === "recording" || recordingState === "paused")) {
      mediaRecorderRef.current.stop();
      // Stop all open tracks in stream to release hardware
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      stopInterval();
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingState("idle");
    setTimeLeft(selectedTimer);
    setAnalystError(null);
    setIsPlayingAudio(false);
  };

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const resultString = reader.result as string;
        if (resultString) {
          const splitData = resultString.split(",")[1]; // strip headers
          resolve(splitData);
        } else {
          reject(new Error("FileReader failed."));
        }
      };
      reader.onerror = reject;
    });
  };

  // 🧠 Run Server-Side Gemini analysis on our Audio Base64
  const handleAnalyze = async () => {
    if (!audioBlob) return;
    setAnalyzing(true);
    setAnalysisTimeoutReached(false);
    setAnalystError(null);

    // Schedule 12-second timeout to show try again flow for slow/infinite loadings
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    analysisTimeoutRef.current = setTimeout(() => {
      setAnalysisTimeoutReached(true);
    }, 12000);

    try {
      const base64 = await blobToBase64(audioBlob);
      const secondsPracticed = selectedTimer - timeLeft;

      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType: "audio/webm",
          topicText: topicText,
          duration: secondsPracticed || 5, // fallback minimal
          category: category,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error("Failed to secure AI coaching diagnostics. Try speaking clearly and hit send again.");
      }

      const result = await response.json();
      
      // Clear timeout upon successful execution
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
        analysisTimeoutRef.current = null;
      }
      setAnalysisTimeoutReached(false);

      onAnalysisSuccess(
        result, 
        base64, 
        secondsPracticed || 15, 
        result.transcript, 
        result.highlights
      );

    } catch (err: any) {
      console.error(err);
      setAnalystError(err.message || "Cannot contact the MeloTalk analysis engine. Let's try sending again.");
    } finally {
      setAnalyzing(false);
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
        analysisTimeoutRef.current = null;
      }
    }
  };

  // Audio Visualizer Simulation for realistic recording feel
  const startAudioVisualizer = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      analyserRef.current = analyser;
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const updateVol = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const average = sum / dataArrayRef.current.length;
        setSpeakingMetrics({ vol: Math.min(Math.round(average), 100) });
        animFrameRef.current = requestAnimationFrame(updateVol);
      };
      
      animFrameRef.current = requestAnimationFrame(updateVol);
    } catch {
      // AudioContext could fail gracefully
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Local Replay Manager
  const togglePlayAudio = () => {
    if (!audioUrl) return;
    if (!audioHTMLRef.current) {
      const audio = new Audio(audioUrl);
      audioHTMLRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
    }
    
    if (isPlayingAudio) {
      audioHTMLRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioHTMLRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG Circular progress ring calculations
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (timeLeft / selectedTimer) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center p-8 bg-[#FAF8ED]/60 rounded-[2.5rem] border border-[#BABF94]/25 shadow-xs font-sans select-none relative gap-8 text-center">

      {/* ⏱️ Practice duration selections (only visible when idle) */}
      {recordingState === "idle" && (
        <div className="w-full flex flex-col items-center space-y-2.5 animate-fade-in">
          <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest font-sans">
            SELECT PRACTICE DURATION
          </label>
          <div className="flex items-center justify-center gap-1.5 bg-neutral-100/50 p-1 rounded-full border border-neutral-200/50">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedTimer(opt.value)}
                className={`px-3.5 py-1.5 font-bold text-[10.5px] rounded-full transition-all ${
                  selectedTimer === opt.value 
                    ? "bg-purple-600 text-white shadow-xs" 
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================
          1. VOICE WAVEFORM ANIMATION (Centered Top)
          ============================================== */}
      <div className="w-full flex flex-col items-center justify-center h-12">
        <div className="flex items-end justify-center space-x-1.5 h-10 w-64">
          {[...Array(20)].map((_, i) => {
            // Calculated or decorative wave height
            let h = 6;
            if (recordingState === "recording") {
              h = Math.max(10, Math.round(speakingMetrics.vol * (0.15 + (i % 5) * 0.15 + Math.random() * 0.4)));
            } else if (recordingState === "paused") {
              h = 8;
            } else if (recordingState === "finished") {
              h = isPlayingAudio ? Math.max(8, Math.round(15 + Math.sin(0.4 * i) * 15 + Math.random() * 10)) : 6;
            }
            return (
              <div 
                key={i} 
                style={{ height: `${h}%` }}
                className={`w-1 rounded-full transition-all duration-100 ${
                  recordingState === "recording"
                    ? "bg-purple-500/80 shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                    : isPlayingAudio 
                    ? "bg-purple-400/80"
                    : "bg-purple-200"
                }`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* ==============================================
          2. LARGE CIRCULAR TIMER (Centered Center)
          ============================================== */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 scale-95">
          {/* Inner smooth glow background track ring */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-purple-100/40 fill-none"
            strokeWidth="5"
          />
          {/* Active progress ring (Purple dynamic bar) */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-purple-600 fill-none transition-all duration-300"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Central visual text container */}
        <div className="z-10 flex flex-col items-center justify-center space-y-1">
          <span className="text-[10px] font-bold text-purple-600/70 tracking-widest uppercase font-sans">
            {recordingState === "idle" ? "READY" : recordingState === "finished" ? "COMPLETED" : "TIME LEFT"}
          </span>
          <span className="text-4xl font-extrabold tracking-tight text-neutral-800 font-sans">
            {formatTimer(timeLeft)}
          </span>
          {recordingState === "idle" && (
            <span className="text-[9.5px] font-bold text-neutral-400 tracking-wide">
              {TIMER_OPTIONS.find(o => o.value === selectedTimer)?.label || "1 M"} session
            </span>
          )}
        </div>
      </div>

      {/* ==============================================
          3. RECORDING STATUS text underneath
          ============================================== */}
      <div className="h-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-full border border-purple-100/20 text-xs font-medium text-neutral-600">
          {recordingState === "idle" && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              <span>Ready to start speaking</span>
            </>
          )}
          {recordingState === "recording" && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span>Recording your voice...</span>
            </>
          )}
          {recordingState === "paused" && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
              <span>Recording is paused</span>
            </>
          )}
          {recordingState === "finished" && (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Audio recorded successfully!</span>
            </>
          )}
        </div>
      </div>

      {/* ==============================================
          4. CONTROL BUTTONS (Centered layout)
          ============================================== */}
      <div className="w-full flex flex-col items-center justify-center">
        
        {/* State A: Idle - just one gorgeous big Mic button */}
        {recordingState === "idle" && (
          <button
            onClick={startRecording}
            className="w-18 h-18 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(139,92,246,0.35)]"
          >
            <Mic className="w-8 h-8" />
          </button>
        )}

        {/* State B & C: Recording or Paused - three elegant circular triggers */}
        {(recordingState === "recording" || recordingState === "paused") && (
          <div className="flex items-center justify-center gap-6 animate-fade-in">
            {/* RESET BUTTON on left */}
            <button
              onClick={deleteRecording}
              className="w-14 h-14 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-purple-600 flex items-center justify-center focus:outline-none transition-all duration-200 hover:scale-[1.03]"
              title="Reset recording"
            >
              <RotateCcw className="w-5 h-5 text-neutral-500" />
            </button>

            {/* MAIN STOP TRIGER in center */}
            <button
              onClick={stopRecording}
              className="w-18 h-18 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center focus:outline-none shadow-[0_4px_16px_rgba(239,68,68,0.25)] transition-all duration-300 hover:scale-105"
              title="Stop Recording"
            >
              <Square className="w-6 h-6 fill-white" />
            </button>

            {/* PLAY / PAUSE RESUME toggle on right */}
            {recordingState === "recording" ? (
              <button
                onClick={pauseRecording}
                className="w-14 h-14 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 text-purple-600 flex items-center justify-center focus:outline-none transition-all duration-200 hover:scale-[1.03]"
                title="Pause recording"
              >
                <Pause className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="w-14 h-14 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 flex items-center justify-center focus:outline-none transition-all duration-200 hover:scale-[1.03]"
                title="Resume recording"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* State D: Finished - Beautiful action list */}
        {recordingState === "finished" && (
          <div className="flex flex-col gap-3.5 w-full max-w-sm animate-scale-up">
            
            {/* Inner Replay / Listen panel */}
            <div className="flex items-center justify-between gap-2.5">
              <button
                onClick={togglePlayAudio}
                className="flex-1 py-3 px-5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 font-bold text-xs text-neutral-700 flex items-center justify-center space-x-2 transition-all"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                    <span>Stop Playback</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-purple-600" />
                    <span>Listen Recording</span>
                  </>
                )}
              </button>

              <button
                onClick={deleteRecording}
                className="py-3 px-4.5 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-100 font-bold text-xs text-red-600 flex items-center justify-center space-x-1.5 transition-all"
                title="Discard audio"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>

            {/* SEND/ANALYZE BUTTON (Accent design) */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 tracking-widest shadow-[0_4px_14px_rgba(139,92,246,0.25)] transition-all uppercase"
            >
              <span>{analyzing ? "AI Coach is Analyzing..." : "Send to AI Coach 🍀"}</span>
              {!analyzing && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>

          </div>
        )}

      </div>

      {/* ⚠️ Alerts, Custom Skeleton, and Slow loading Try Again block */}
      {analyzing && (
        <div className="w-full flex flex-col items-center mt-3 scale-95">
          {analysisTimeoutReached ? (
            <div className="w-full text-center space-y-4 p-5 bg-[#FAF8ED] border border-purple-200/50 rounded-2xl max-w-sm animate-scale-up shadow-sm">
              <span className="text-4xl animate-bounce inline-block">🍀</span>
              <h4 className="text-sm font-bold text-neutral-800">MeloTalk is preparing your feedback...</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">The AI coach is experiencing high demand right now, but we are continuing to process your grammar and transcript safely!</p>
              <div className="flex justify-center space-x-2 pt-1">
                <button
                  onClick={() => {
                    setAnalysisTimeoutReached(false);
                    handleAnalyze();
                  }}
                  className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-[11px] font-bold hover:bg-purple-700 transition shadow-xs"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setAnalysisTimeoutReached(false);
                    setAnalyzing(false);
                  }}
                  className="px-4 py-1.5 bg-white border border-neutral-300 text-neutral-600 rounded-xl text-[11px] font-semibold hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full text-center space-y-4 p-5 bg-white border border-purple-100 rounded-2xl max-w-sm animate-pulse shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                <span>AI COACH ANALYSIS</span>
                <span className="text-emerald-600 font-bold flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>PROCESSING 🍀</span>
                </span>
              </div>
              
              {/* Speaking Score Skeleton */}
              <div className="bg-neutral-50 p-4 rounded-xl text-left space-y-2 border border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-neutral-400">SPEAKING SCORE</span>
                  <span className="text-xs font-bold font-mono text-neutral-400">Calculating...</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full w-2/3"></div>
                </div>
              </div>

              {/* Transcript Preview Skeleton */}
              <div className="bg-[#FAF8ED]/50 p-4 rounded-xl text-left space-y-2 border border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">TRANSCRIPT PREVIEW</span>
                <div className="h-2 bg-neutral-200 rounded w-11/12"></div>
                <div className="h-2 bg-neutral-200 rounded w-4/5"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {analystError && (
        <div className="w-full flex items-start space-x-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs leading-relaxed text-left animate-fade-in font-sans">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{analystError}</span>
        </div>
      )}

    </div>
  );
};
