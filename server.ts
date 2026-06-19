import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Maximum payload size for audio uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini SDK with custom Telemetry User Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in the environment. AI Analysis features will fallback to simulation.");
}

/**
 * Robust wrapper to execute Gemini calls.
 * First tries primary model 'gemini-3.5-flash'.
 * If that fails due to server load (e.g. 503 UNAVAILABLE), rates, or demand spike, 
 * automatically falls back to 'gemini-3.1-flash-lite' to guarantee continuity.
 */
async function generateContentWithFallback(params: {
  contents: any[];
  config?: any;
}) {
  if (!ai) {
    throw new Error("Gemini AI client is not initialized.");
  }

  try {
    // Try primary gemini-3.5-flash
    return await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: params.contents,
      config: params.config,
    });
  } catch (primaryErr: any) {
    console.warn("⚠️ Primary 'gemini-3.5-flash' experienced failure/high demand, trying backup 'gemini-3.1-flash-lite':", primaryErr.message || primaryErr);
    
    try {
      // Try backup 'gemini-3.1-flash-lite'
      return await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: params.contents,
        config: params.config,
      });
    } catch (backupErr: any) {
      console.error("❌ Both 'gemini-3.5-flash' and 'gemini-3.1-flash-lite' failed:", backupErr.message || backupErr);
      throw backupErr; // bubble up to trigger local offline fallbacks & structured mock diagnostics
    }
  }
}

// 🩺 Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// Mock Topic Fallbacks database for robust offline execution in 14 languages!
const FALLBACK_TOPICS_BY_LANG: Record<string, Array<{
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  angles: string[];
  framework: string;
  frameworkHelper: string[];
}>> = {
  English: [
    {
      text: "Should artificial intelligence replace human teachers in classrooms?",
      category: "Technology",
      difficulty: "Hard",
      angles: ["As a student", "As an AI software developer", "As an experienced teacher", "As a parent"],
      framework: "PREP",
      frameworkHelper: ["P (Point): State your clear stance on AI in education.", "R (Reason): Share why human touch is or isn't replaceable.", "E (Example): Give a scenario of AI vs human mentoring.", "P (Point): End with a compact summary of your view."]
    },
    {
      text: "If you could live anywhere in the world, where would it be and why?",
      category: "Travel",
      difficulty: "Easy",
      angles: ["As an absolute travel enthusiast", "As a remote digital nomad", "As a family person", "As a nature lover"],
      framework: "PREP",
      frameworkHelper: ["P (Point): Directly answer with your dream destination.", "R (Reason): Detail the culture, climate, or visual appeal.", "E (Example): Tell a story of a place you saw online or visited.", "P (Point): Reiterate why this place holds your heart."]
    },
    {
      text: "Describe your morning routine and how it shapes your productivity.",
      category: "Lifestyle",
      difficulty: "Easy",
      angles: ["As an early-rising gym trainer", "As a busy working parent", "As a night-owl developer", "As a minimalist lifestyle writer"],
      framework: "STAR",
      frameworkHelper: ["S (Situation): Outline your typical morning setting.", "T (Task): Highlight your primary objectives before noon.", "A (Action): Walk through your chronological steps (coffee, plan).", "R (Result): Express how it fuels your mental clarity and wins."]
    },
    {
      text: "What makes a good leader or role model in the modern era?",
      category: "Business",
      difficulty: "Medium",
      angles: ["As a young office employee", "As an inspirational tech CEO", "As a volunteer campaign manager", "As an athletic team coach"],
      framework: "STAR",
      frameworkHelper: ["S (Situation): Describe a challenge leaders face today.", "T (Task): Define the leader's core responsibility.", "A (Action): Explain actions like active listening and vulnerability.", "R (Result): Conclude with how this builds trust and high morale."]
    },
    {
      text: "Is public speaking an inherent talent or a skill that can be mastered?",
      category: "Education",
      difficulty: "Medium",
      angles: ["As a stage-shy student", "As a professional TED talker", "As an expert speech coach", "As a cognitive researcher"],
      framework: "PREP",
      frameworkHelper: ["P (Point): Claim if speaking is born or made.", "R (Reason): Point out how muscle memory and practice play roles.", "E (Example): Mention a famous speaker who overcame a stutter.", "P (Point): Encourage practicing on MeloTalk daily."]
    },
    {
      text: "Explain the concept of inflation to a five-year-old.",
      category: "Explain Like I'm Five",
      difficulty: "Medium",
      angles: ["As a playful toy shop owner", "As an economics professor", "As an imaginative elder sibling", "As a cartoon character"],
      framework: "PREP",
      frameworkHelper: ["P (Point): Compare money to tokens or candies.", "R (Reason): Explain why too many candies make them worth less.", "E (Example): The toy that cost 1 candy last year now costs 3 candies.", "P (Point): Wrap up with a reassuring simple summary."]
    }
  ],
  Indonesian: [
    {
      text: "Apakah kecerdasan buatan (AI) sebaiknya menggantikan guru manusia di sekolah?",
      category: "Technology",
      difficulty: "Hard",
      angles: ["Sebagai siswa sekolah", "Sebagai developer software AI", "Sebagai guru berpengalaman", "Sebagai orang tua murid"],
      framework: "PREP",
      frameworkHelper: ["P (Point): Nyatakan pendapat Anda tentang AI di sekolah secara jelas.", "R (Reason): Sampaikan mengapa sentuhan emosi manusia tidak tergantikan.", "E (Example): Berikan contoh situasi belajar seru dengan guru.", "P (Point): Tegaskan kembali pentingnya keseimbangan teknologi."]
    },
    {
      text: "Jika Anda bisa tinggal di mana saja di seluruh dunia, di mana itu dan mengapa?",
      category: "Travel",
      difficulty: "Easy",
      angles: ["Sebagai petualang sejati", "Sebagai pekerja remote digital nomad", "Sebagai pencinta kehangatan keluarga", "Sebagai pemuja keindahan alam"],
      framework: "PREP",
      frameworkHelper: ["P (Point): Jawab langsung dengan kota atau negara impian Anda.", "R (Reason): Paparkan pesona budaya, cuaca, atau kuliner khas setempat.", "E (Example): Ceritakan foto yang Anda simpan atau kunjungan sebelumnya.", "P (Point): Simpulkan mengapa tempat tersebut adalah rumah impian."]
    },
    {
      text: "Deskripsikan rutinitas pagi Anda dan pengaruhnya bagi produktivitas harian.",
      category: "Lifestyle",
      difficulty: "Easy",
      angles: ["Sebagai instruktur olahraga pagi", "Sebagai pekerja kantoran yang sibuk", "Sebagai kreator produktif", "Sebagai penganut gaya hidup minimalis"],
      framework: "STAR",
      frameworkHelper: ["S (Situation): Gambarkan suasana pagi hari Anda.", "T (Task): Jelaskan apa target utama sebelum memulai aktivitas utama.", "A (Action): Uraikan langkah praktis Anda (berdoa, air putih, planing).", "R (Result): Ceritakan rasa bahagia dan kesiapan mental yang Anda rasakan."]
    },
    {
      text: "Apa karakteristik kepemimpinan yang baik dan inspiratif di era modern?",
      category: "Business",
      difficulty: "Medium",
      angles: ["Sebagai karyawan pemula", "Sebagai CEO startup inovatif", "Sebagai pemimpin organisasi sosial", "Sebagai kapten tim olahraga"],
      framework: "STAR",
      frameworkHelper: ["S (Situation): Sebutkan tantangan yang dihadapi tim di era sekarang.", "T (Task): Jelaskan tanggung jawab moral seorang pemimpin.", "A (Action): Terangkan tindakan berani seperti mendengar dan peduli.", "R (Result): Simpulkan bagaimana kualitas ini menciptakan ruang kerja sehat."]
    },
    {
      text: "Jelaskan mengapa buah apel bisa berubah warna menjadi cokelat setelah dipotong.",
      category: "Explain Like I'm Five",
      difficulty: "Easy",
      angles: ["Sebagai koki cilik", "Sebagai ilmuwan ramah", "Sebagai kakak yang penuh dongeng", "Sebagai tokoh apel lucu"],
      framework: "PREP",
      frameworkHelper: ["P (Point): Sebutkan bahwa apel sedang 'bernafas' dengan udara sekitar.", "R (Reason): Terangkan oksigen luar merangsang cairan pelindung apel.", "E (Example): Seperti kulit kita yang berubah merah jika tergores udara.", "P (Point): Katakan jika apel tetap lezat dan aman dimakan."]
    },
    {
      text: "Apakah sarapan pagi benar-benar penting atau hanya mitos belaka?",
      category: "Hot Takes",
      difficulty: "Medium",
      angles: ["Sebagai nutrisionis", "Sebagai mahasiswa telat bangun", "Sebagai atlet lari", "Sebagai penyuka diet puasa pagi"],
      framework: "PREP",
      frameworkHelper: ["P (Point): Ambil keputusan apakah sarapan wajib atau tidak.", "R (Reason): Sebutkan energi lambung setelah tidur semalaman.", "E (Example): Bandingkan mobil tanpa bensin di pagi hari yang mogok.", "P (Point): Rekomendasikan porsi sehat yang pas untuk memulai hari."]
    }
  ],
  Japanese: [
    {
      text: "AI（人工知能）は学校の教師に取って代わるべきでしょうか？",
      category: "Technology",
      difficulty: "Hard",
      angles: ["学生の視点から", "AI開発者の視点から", "ベテラン教師の視点から", "保護者の視点から"],
      framework: "PREP",
      frameworkHelper: ["P（結論）: AIの教育への進出に関する立場を明確にします。", "R（理由）: 人と人との繋がりの重要性を語ります。", "E（具体例）: 個別学習AIと熱心な教師の対比を説明します。", "P（結論）: 未来の教室のあり方をまとめて締めくくります。"]
    },
    {
      text: "世界中のどこにでも住めるとしたら、どこを選びますか？その理由は？",
      category: "Travel",
      difficulty: "Easy",
      angles: ["旅好きのアウトドア派", "都会派のデジタルノマド", "のんびり田舎暮らし希望者", "美味しい料理を愛する美食家"],
      framework: "PREP",
      frameworkHelper: ["P（結論）: 住んでみたい最高の一国、または都市を答えます。", "R（理由）: 治安、気候、文化などお気に入りのポイントを説明します。", "E（具体例）: その場所について知ったきっかけや旅のエピソードを話します。", "P（結論）: 自信を持っておすすめします。"]
    }
  ],
  Korean: [
    {
      text: "인공지능(AI)이 교실의 인간 교사를 대체해야 할까요?",
      category: "Technology",
      difficulty: "Hard",
      angles: ["학생으로서", "AI 개발자로서", "초등학교 교사로서", "학부모로서"],
      framework: "PREP",
      frameworkHelper: ["P (Point): 교실에서의 AI 교사에 대한 명확한 의견을 제시합니다.", "R (Reason): 인간다운 따뜻함과 정서적 교감의 대체 불가함을 이야기합니다.", "E (Example): 인생에서 만난 가장 의미 깊은 선생님의 일화를 말합니다.", "P (Point): 올바른 공존의 중요성으로 정리합니다."]
    },
    {
      text: "만약 전 세계 어디서든 살 수 있다면, 어디서 살고 싶으신가요?",
      category: "Travel",
      difficulty: "Easy",
      angles: ["여행을 좋아하는 탐험가", "디지털 노마드 개발자", "가족과의 완벽한 삶을 꿈꾸는 사람", "자연 치유를 원하는 사람"],
      framework: "PREP",
      frameworkHelper: ["P (Point): 가고 싶은 꿈의 나라나 도시를 말합니다.", "R (Reason): 독특한 분위기나 풍경을 사랑하는 이유를 공유합니다.", "E (Example): 책이나 영상, 지난 여행에서의 아름다운 경험을 떠올립니다.", "P (Point): 왜 그곳에서 시작하고 싶은지 요약합니다."]
    }
  ],
  Chinese: [
    {
      text: "人工智能（AI）是否应该在课堂上完全取代人类教师？",
      category: "Technology",
      difficulty: "Hard",
      angles: ["作为中小学生", "作为科技巨头的AI工程师", "作为资深的人民教师", "作为关切孩子成长的家长"],
      framework: "PREP",
      frameworkHelper: ["P (观点): 清楚表态AI是否能取代教师。", "R (原因): 说明人类的情感陪伴与启发为什么至关重要。", "E (实例): 举一个好老师如何改变学生人生的生动例证。", "P (观点): 总结在未来的智慧教育中人机的平衡关系。"]
    }
  ],
  Spanish: [
    {
      text: "¿Debería la inteligencia artificial reemplazar a los maestros humanos en el aula?",
      category: "Technology",
      difficulty: "Hard",
      angles: ["Como estudiante", "Como programador de IA", "Como profesor de secundaria", "Como madre preocupada"],
      framework: "PREP",
      frameworkHelper: ["P (Punto): Declara tu postura clara ante la IA en la escuela.", "R (Razón): Explica por qué el calor humano no puede sustituirse.", "E (Ejemplo): Da un ejemplo de inspiración que te dio un docente real.", "P (Punto): Concluye afirmando el balance idóneo."]
    }
  ]
};

// Quick general fallback function for any unsupported languages or categories
function getFallbackTopic(language: string = "English", category: string = "General", difficulty: string = "Medium"): {
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  angles: string[];
  framework: string;
  frameworkHelper: string[];
} {
  const normLang = FALLBACK_TOPICS_BY_LANG[language] ? language : "English";
  const list = FALLBACK_TOPICS_BY_LANG[normLang];
  
  // Try exact category matches if possible
  const catMatch = list.find((t) => t.category.toLowerCase() === category.toLowerCase());
  if (catMatch) return catMatch;
  
  // Try difficulty matches
  const diffMatch = list.find((t) => t.difficulty === difficulty);
  if (diffMatch) return diffMatch;

  // Otherwise return absolute first item
  return list[0];
}

// 🩺 Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// 🎡 Topic Generator Endpoint
app.post("/api/gemini/generate-topic", async (req, res) => {
  const { language, category, difficulty } = req.body;
  const targetLang = language || "English";
  const targetCat = category || "General";
  const targetDiff = difficulty || "Medium";

  try {
    if (!ai) {
      const fallback = getFallbackTopic(targetLang, targetCat, targetDiff as any);
      return res.json({
        ...fallback,
        category: targetCat,
        difficulty: targetDiff
      });
    }

    const promptText = `
      You are the ultimate speech topic generator of 'MeloTalk', an interactive multi-language speaking app.
      Generate a speaking/prompt topic in the language: "${targetLang}" inside the category: "${targetCat}".
      Difficulty requirement: "${targetDiff}".

      The generated topic text MUST be completely in the requested language ("${targetLang}").
      The question should NOT be multiple-choice or quiz. It should be an open-ended impromptu speaking prompt.

      Tasks:
      1. Write the prompt text in "${targetLang}".
      2. Write exactly 4 distinct viewpoints or "Speaking Angles" in "${targetLang}" (e.g. As a student, As a parent, As a business owner, etc.).
      3. Recommend a logical structure framework (e.g. PREP, STAR, CAR, PAR, MECE).
      4. Provide 4 step-by-step guideline points ("frameworkHelper") in "${targetLang}" explaining what to express in each step.

      Return the result strictly as a JSON object matching this schema:
      {
        "text": "topic text in ${targetLang}",
        "category": "${targetCat}",
        "difficulty": "${targetDiff}",
        "angles": ["perspective 1 in ${targetLang}", "perspective 2 in ${targetLang}", "perspective 3 in ${targetLang}", "perspective 4 in ${targetLang}"],
        "framework": "PREP or STAR or etc",
        "frameworkHelper": ["step 1 guide in ${targetLang}", "step 2 guide in ${targetLang}", "step 3 guide in ${targetLang}", "step 4 guide in ${targetLang}"]
      }
    `;

    const response = await generateContentWithFallback({
      contents: [promptText],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            angles: { type: Type.ARRAY, items: { type: Type.STRING } },
            framework: { type: Type.STRING },
            frameworkHelper: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["text", "category", "difficulty", "angles", "framework", "frameworkHelper"]
        }
      }
    });

    const parsed = JSON.parse((response.text || "{}").trim());
    return res.json(parsed);

  } catch (err: any) {
    console.error("❌ Topic generation failure, plucking offline fallback:", err);
    const fallback = getFallbackTopic(targetLang, targetCat, targetDiff as any);
    return res.json({
      ...fallback,
      category: targetCat,
      difficulty: targetDiff
    });
  }
});

// 🎤 Speech Analysis Endpoint using server-side Gemini
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { audioBase64, mimeType, topicText, duration, category, language } = req.body;
    const spokenLang = language || "English";

    if (!audioBase64) {
      return res.status(400).json({ error: "Missing audio data." });
    }

    if (!ai) {
      // Robust realistic diagnostic simulator fallback if Gemini API key is missing
      const mockTranscriptMap: Record<string, string> = {
        English: `Regarding the prompt "${topicText || "General topics"}", I think that we should consider multiple aspects. Actually... honestly speaking, it is highly critical to balance our daily jobs. A lot of people believe work takes up too much times, you know? Uh, that leads to severe burnouts, and I totally agree that we should rest. That is why practicing with MeloTalk is, like, very cozy.`,
        Indonesian: `Menjawab topik "${topicText || "Materi Umum"}", saya ingin menyampaikan beberapa hal penting. Sebenarnya... jujur saja, keseimbangan pekerjaan harian itu sangat penting sekali untuk kesehatan mental kita. Kebanyakan orang terlalu banyak menghabiskan waktu mereka pada hal-hal yang kurang berguna, kamu tahu? Ee, hal itu sangat melelahkan, dan saya rasa kita harus istirahat yang cukup.`,
        Japanese: `お題の「${topicText || "日本語の練習"}」について私の考えを述べたいと思います。実は、ええと、日常生活の中でリラックスする時間を作ることは非常に大切だと感じています。多くの人が毎日忙しすぎる生活を送っているのではないでしょうか。それは精神的にかなり負担になりますので、私たちはもっと休息をとるべきだと思います。`,
        Korean: `제공된 대화 주제인「${topicText || "한국어 연습"}」에 대해 제 견해를 말씀드리겠습니다. 사실, 음, 매일매일 적당한 휴식을 취하는 것이 우리 삶에서 정말로 중요하다고 생각합니다. 많은 사람들이 바쁜 일상 속에서 자기 자신을 잃어버리는 경우가 많은 것 같습니다. 한 박자 쉬어가는 여유가 필요합니다.`
      };

      const mockFeedbackMap: Record<string, string> = {
        English: "Your English speech is warm and playful! You structure your points beautifully, but watch out for filler expressions like 'actually' or 'you know'. Deepen your vocabulary to reach a higher level of fluency.",
        Indonesian: "Bicara Bahasa Indonesia Anda sangat lancar dan menyenangkan didengar! Anda menyampaikan argumen secara tertata, namun perhatikan penggunaan kata pengisi (filler) seperti 'sebenarnya' atau 'ee'. Tingkatkan kosa kata formal untuk mencapai kelancaran tingkat lanjut.",
        Japanese: "日本語でのスピーチはとても自然で、親しみやすいトーンが素晴らしいです！フレーズは非常によく繋がっていますが、若干の言い淀み（ええと、等）が見られます。さらに豊かな表現力を目指しましょう。",
        Korean: "한국어 발음과 억양이 매우 부드럽고 훌륭합니다! 내용 전개가 일관성 있어 아주 잘 들리는 스피치였습니다. '사실', '음'과 같은 불필요한 추임새를 줄인다면 완벽한 달변가가 될 것입니다."
      };

      const selectedTranscript = mockTranscriptMap[spokenLang] || mockTranscriptMap["English"];
      const selectedFeedback = mockFeedbackMap[spokenLang] || mockFeedbackMap["English"];

      const simulatedAnalysis = {
        transcript: selectedTranscript,
        clarity: 82,
        confidence: 80,
        grammar: 76,
        pronunciation: 81,
        vocabulary: 73,
        fluency: 75,
        speakingPace: 122,
        fillerWordsCount: 3,
        fillerWordsList: spokenLang === "Indonesian" ? ["sebenarnya", "kamu tahu", "ee"] : ["actually", "you know", "uh"],
        structure: 78,
        engagement: 86,
        overallScore: 78,
        feedback: selectedFeedback,
        positives: spokenLang === "Indonesian" ? [
          "Koherensi antarkalimat tersusun baik.",
          "Intonasi ramah, santai, dengan kejelasan artikulasi yang asyik.",
          "Pemilihan ritme bicara yang natural."
        ] : [
          "Excellent sentence coherence.",
          "Friendly, appealing tone and emotional expression.",
          "Great rhythm and natural speaking pace."
        ],
        improvements: spokenLang === "Indonesian" ? [
          "Kurangi ketergantungan pada ungkapan pengisi / filler words.",
          "Gunakan konjungsi formal seperti 'oleh karena itu' untuk transisi kalimat.",
          "Perbanyak kosa kata akademik yang sejalan dengan topik."
        ] : [
          "Reduce reliance on filler phrases like 'you know' or 'uh'.",
          "Ensure subject-verb agreements (e.g. 'too much times' -> 'too much time').",
          "Try incorporating advanced idiomatic expressions to sound more native."
        ],
        aiImprovedVersion: spokenLang === "Indonesian"
          ? `Menanggapi topik tentang "${topicText || "Materi Umum"}", saya berpendapat bahwa keseimbangan antara pekerjaan dan kehidupan pribadi sangatlah krusial bagi kesejahteraan emosional. Sering kali, kita terlalu fokus pada aktivitas bekerja sehingga lupa meluangkan waktu bersantai. Oleh karena itu, istirahat yang berkualitas adalah kunci utama menjaga produktivitas harian kita.`
          : `In response to the question regarding "${topicText || "General Practice"}", I strongly believe that maintaining a healthy work-life balance is absolutely crucial for emotional well-being. Quite often, we spend excessive hours working, thereby neglecting our personal rest. Consequently, designated recovery time is vital to sustain our daily productivity beautifully.`,
        followUpQuestions: spokenLang === "Indonesian" ? [
          "1. Bagaimana cara Anda biasanya mengelola stres setelah seharian beraktivitas?",
          "2. Apakah lingkungan sekolah atau pekerjaan Anda saat ini mendukung gaya hidup yang seimbang?"
        ] : [
          "1. What is your go-to ritual for decompressing after a deeply exhausting day?",
          "2. Do you feel your current school or workplace structure encourages a genuinely healthy schedule?"
        ],
        highlights: spokenLang === "Indonesian" ? [
          { type: "grammar", text: "sangat penting sekali", suggestion: "sangat penting", explanation: "Penggunaan 'sangat' dan 'sekali' bersamaan adalah pleonasme atau berlebihan." },
          { type: "filler", text: "sebenarnya", suggestion: "[ambil jeda sebentar]", explanation: "Kata pengisi berlebih mengurangi ketegasan argumentasi Anda." },
          { type: "filler", text: "ee", suggestion: "", explanation: "Gumam kebingungan menurunkan tingkat kelancaran visual Anda." }
        ] : [
          { type: "grammar", text: "too much times", suggestion: "too much time", explanation: "Time is uncountable here. Therefore, 'too much time' is correct." },
          { type: "filler", text: "you know", suggestion: "[pause momentarily]", explanation: "Removing this filler word makes your speech sound much more professional." },
          { type: "filler", text: "uh", suggestion: "", explanation: "Excessive vocal hesitation can lower your fluency metric." }
        ]
      };
      return res.json(simulatedAnalysis);
    }

    // Prepare content parts for Gemini
    const audioPart = {
      inlineData: {
        mimeType: mimeType || "audio/webm",
        data: audioBase64
      }
    };

    const promptText = `
      You are the world-class interactive multilingual speech coach expert of 'MeloTalk', a clean, playful, highly supportive speaking practice platform.
      The user recorded an impromptu speech addressing the topic: "${topicText || 'General Speaking Practice'}" inside the category "${category || 'General'}".
      They recorded the speech in this exact language: "${spokenLang}".

      Tasks:
      1. Transcribe the audio exactly in the language "${spokenLang}".
      2. Grade the speech's proficiency relative to a proficient native speaker of "${spokenLang}" on standard metrics from 0 to 100: Clarity (kejelasan), Confidence (percaya diri), Grammar (tata bahasa), Pronunciation (artikulasi), Vocabulary (pilihan kosa kata), Fluency (kelancaran alur), Structure (logika penyusunan), and Engagement (penekanan nada/emosi).
      3. Identify grammar errors, repetitions, weak vocabulary expressions, or filler words with exact transcript segments. Show these as 'grammar', 'repeated', 'filler', or 'weak' in the highlights list. 
         IMPORTANT: The highlight text matches must exactly exist in the transcript written!
      4. Provide cozy, positive highlights and targeted actionable improvements in "${spokenLang}".
      5. Provide an "aiImprovedVersion" completely in "${spokenLang}". This should be a gorgeous, refined, native-sounding re-write of their draft transcript, demonstrating how they could restructure their words to be 100% natural and polished without losing their core idea.
      6. Provide 2 to 3 follow-up conversation questions ("followUpQuestions") in "${spokenLang}" to build an immersive interactive feel.

      Return the analysis STRICTLY in JSON format following this exact JSON Schema:
    `;

    const response = await generateContentWithFallback({
      contents: [audioPart, promptText],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: { type: Type.STRING, description: `Literal exact transcription representation of the spoken audio in ${spokenLang}.` },
            clarity: { type: Type.INTEGER },
            confidence: { type: Type.INTEGER },
            grammar: { type: Type.INTEGER },
            pronunciation: { type: Type.INTEGER },
            vocabulary: { type: Type.INTEGER },
            fluency: { type: Type.INTEGER },
            speakingPace: { type: Type.INTEGER, description: "Speaking speed in words per minute." },
            fillerWordsCount: { type: Type.INTEGER },
            fillerWordsList: { type: Type.ARRAY, items: { type: Type.STRING } },
            structure: { type: Type.INTEGER },
            engagement: { type: Type.INTEGER },
            overallScore: { type: Type.INTEGER },
            feedback: { type: Type.STRING, description: `The personalized supporting advice of Melo Coach in ${spokenLang} (approx 100 words).` },
            positives: { type: Type.ARRAY, items: { type: Type.STRING }, description: `Exactly 2 to 3 strengths of the speech in ${spokenLang}.` },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: `Exactly 2 to 3 points for growth in ${spokenLang}.` },
            aiImprovedVersion: { type: Type.STRING, description: `A polished rewrite of the transcript using native-level phrasing in ${spokenLang}.` },
            followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: `2 to 3 follow up speaking prompts in ${spokenLang}.` },
            highlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "One of 'grammar', 'repeated', 'filler', or 'weak'." },
                  text: { type: Type.STRING, description: `Target substring exactly matching some characters in the generated transcript.` },
                  suggestion: { type: Type.STRING, description: "Corrected or upgraded alternative suggestion." },
                  explanation: { type: Type.STRING, description: `Clear explanation in ${spokenLang}.` }
                },
                required: ["type", "text", "suggestion", "explanation"]
              }
            }
          },
          required: [
            "transcript", "clarity", "confidence", "grammar", "pronunciation", 
            "vocabulary", "fluency", "speakingPace", "fillerWordsCount", "fillerWordsList",
            "structure", "engagement", "overallScore", "feedback", "positives", "improvements", 
            "aiImprovedVersion", "followUpQuestions", "highlights"
          ]
        }
      }
    });

    // Safeguard parsing response text
    const textResult = response.text || "{}";
    const parsedData = JSON.parse(textResult.trim());
    return res.json(parsedData);

  } catch (error: any) {
    console.error("❌ Gemini Speech Analysis Error:", error);
    res.status(500).json({ error: "Gagal memproses speech analysis. Pastikan audio terisi penuh dan suara jelas.", details: error.message });
  }
});

// Configure Vite middleware in development or static serving inside production
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🍀 MeloTalk server spinning smoothly on http://localhost:${PORT}`);
  });
}

runServer().catch((err) => {
  console.error("Critical server failure:", err);
});
