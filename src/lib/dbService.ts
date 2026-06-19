import { generateAllTopics } from "./topicsSeed";
import { 
  UserProfile, UserStats, SpeakingTopic, SpeechHistoryItem, 
  VocabularyWord, Achievement, DailyChallenge, LeaderboardEntry
} from "../types";
import { supabase } from "./supabase";

const DB_NAME = "MeloTalkDB";
const DB_VERSION = 2;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 🧱 Create Object Stores
      if (!db.objectStoreNames.contains("profile")) {
        db.createObjectStore("profile", { keyPath: "email" });
      }
      if (!db.objectStoreNames.contains("stats")) {
        db.createObjectStore("stats", { keyPath: "email" });
      }
      if (!db.objectStoreNames.contains("topics")) {
        db.createObjectStore("topics", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("history")) {
        db.createObjectStore("history", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("vocabulary")) {
        db.createObjectStore("vocabulary", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("achievements")) {
        db.createObjectStore("achievements", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("challenges")) {
        db.createObjectStore("challenges", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };
  });
}

// 📦 Read Operation Helper
function readStore<T>(storeName: string, key: string | IDBValidKey): Promise<T | null> {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(transaction.objectStoreNames[0]);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  });
}

// 📝 Write Operation Helper
function writeStore<T>(storeName: string, value: T): Promise<void> {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(transaction.objectStoreNames[0]);
      const request = store.put(value);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

// 📑 Read All Operations Helper
function readAllStore<T>(storeName: string): Promise<T[]> {
  return initDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(transaction.objectStoreNames[0]);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error("Failed to get all records."));
    });
  });
}

// 🎲 SEED INITAL APP DATA
export function seedInitialData(): Promise<void> {
  return initDB().then((db) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["topics", "vocabulary", "achievements", "challenges"], "readwrite");

      transaction.oncomplete = () => {
        console.log("🍀 IndexedDB seeding completed successfully!");
        resolve();
      };

      transaction.onerror = (e) => {
        console.error("❌ IndexedDB seeding transaction failed:", transaction.error || e);
        reject(transaction.error || e);
      };

      // 1. Seed & Upgrade Topics (100 per category)
      const topicStore = transaction.objectStore("topics");
      topicStore.openCursor().onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result;
        if (!cursor) {
          const topics = generateAllTopics();
          topics.forEach((t) => topicStore.put(t));
          console.log(`🍀 Seeded ${topics.length} rich topics into IndexedDB`);
        } else {
          const firstTopic = cursor.value;
          if (!firstTopic || !firstTopic.angles || firstTopic.angles.length === 0) {
            console.log("⚠️ Detecting old topic format without angles, re-seeding rich topics...");
            const topics = generateAllTopics();
            topics.forEach((t) => topicStore.put(t));
          }
        }
      };

      // 2. Seed Vocabulary
    const vocabStore = transaction.objectStore("vocabulary");
    vocabStore.count().onsuccess = (e) => {
      const count = (e.target as IDBRequest).result;
      if (count === 0) {
        const defaultWords: VocabularyWord[] = [
          {
            id: "vocab_1",
            word: "Serendipity",
            pronunciation: "/ˌserənˈdipədē/",
            meaning: "Penemuan keberuntungan atau hal menyenangkan secara tidak sengaja.",
            example: "Meeting my favorite teacher in another country was pure serendipity.",
            synonym: "Chance, fluke, luck",
            antonym: "Misfortune, design",
            difficulty: "Hard",
            category: "General",
            saved: false,
            learned: false
          },
          {
            id: "vocab_2",
            word: "Fluency",
            pronunciation: "/ˈflo͞oənsē/",
            meaning: "Kemampuan berbicara atau menulis bahasa asing secara lancar, santai, dan tanpa hambatan.",
            example: "Consistent practice on MeloTalk will skyrocket your English speaking fluency.",
            synonym: "Articulation, smoothness",
            antonym: "Hesitation, stutter",
            difficulty: "Easy",
            category: "Speaking",
            saved: false,
            learned: false
          },
          {
            id: "vocab_3",
            word: "Resilient",
            pronunciation: "/rəˈzilyənt/",
            meaning: "Tangguh; mampu pulih kembali dengan cepat dari kesulitan atau rintangan.",
            example: "To master a new language, one must remain resilient despite small errors.",
            synonym: "Tough, strong, flexible",
            antonym: "Fragile, weak",
            difficulty: "Medium",
            category: "Lifestyle",
            saved: false,
            learned: false
          },
          {
            id: "vocab_4",
            word: "Candid",
            pronunciation: "/ˈkandəd/",
            meaning: "Jujur, tulus, apa adanya, tanpa direkayasa.",
            example: "Her candid feedback helped me improve my interview behavior completely.",
            synonym: "Frank, honest, direct",
            antonym: "Insincere, devious",
            difficulty: "Easy",
            category: "Business",
            saved: false,
            learned: false
          },
          {
            id: "vocab_5",
            word: "Eloquence",
            pronunciation: "/ˈeləkwəns/",
            meaning: "Kefasihan dan keindahan ekspresi dalam berbicara atau merangkai argumen.",
            example: "The speaker's eloquence captivated the entire audience in the room.",
            synonym: "Poise, fluency, rhetoric",
            antonym: "Dullness, inarticulacy",
            difficulty: "Hard",
            category: "General",
            saved: false,
            learned: false
          },
          {
            id: "vocab_6",
            word: "Perspicacious",
            pronunciation: "/ˌpərspəˈkāSHəs/",
            meaning: "Memiliki pemahaman atau wawasan yang sangat tajam dan mendalam.",
            example: "His perspicacious analysis of the market trends saved the startup millions.",
            synonym: "Sharp, insightful, clever",
            antonym: "Unobservant, slow",
            difficulty: "Hard",
            category: "Business",
            saved: false,
            learned: false
          },
          {
            id: "vocab_7",
            word: "Solitude",
            pronunciation: "/ˈsäləˌt(y)o͞od/",
            meaning: "Keadaan menyendiri yang menenangkan dan nyaman, biasanya untuk refleksi diri.",
            example: "She found peace in the solitude of the mountain cabin.",
            synonym: "Privacy, loneliness",
            antonym: "Companionship, crowd",
            difficulty: "Medium",
            category: "Lifestyle",
            saved: false,
            learned: false
          },
          {
            id: "vocab_8",
            word: "Ephemeral",
            pronunciation: "/əˈfemərəl/",
            meaning: "Bersifat sementara atau hanya berlangsung sangat singkat.",
            example: "The colorful sunset over the ocean was beautiful but ephemeral.",
            synonym: "Fleeting, brief",
            antonym: "Permanent, eternal",
            difficulty: "Hard",
            category: "Travel",
            saved: false,
            learned: false
          }
        ];
        defaultWords.forEach((word) => vocabStore.put(word));
        console.log("🥬 Seeded default vocabulary words");
      }
    };

    // 3. Seed Achievements
    const achStore = transaction.objectStore("achievements");
    achStore.count().onsuccess = (e) => {
      const count = (e.target as IDBRequest).result;
      if (count === 0) {
        const defaultAchievements: Achievement[] = [
          {
            id: "ach_first_rec",
            title: "First Recording",
            description: "Selesaikan rekaman speaking pertamamu di MeloTalk!",
            badge: "🎤",
            category: "Speaking",
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            target: 1
          },
          {
            id: "ach_streak_7",
            title: "7 Day Streak",
            description: "Latihan speaking 7 hari berturut-turut.",
            badge: "🔥",
            category: "Consistency",
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            target: 7
          },
          {
            id: "ach_streak_30",
            title: "30 Day Streak",
            description: "Latihan speaking 30 hari berturut-turut.",
            badge: "🏆",
            category: "Consistency",
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            target: 30
          },
          {
            id: "ach_vocab_master",
            title: "Vocabulary Master",
            description: "Pelajari dan tandai sebagai 'Learned' sebanyak 5 kosakata baru.",
            badge: "📚",
            category: "Vocabulary",
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            target: 5
          },
          {
            id: "ach_interview_expert",
            title: "Interview Expert",
            description: "Lakukan 3 sesi latihan simulasi Interview Prep.",
            badge: "💼",
            category: "Speaking",
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            target: 3
          },
          {
            id: "ach_topics_100",
            title: "100 Topics Completed",
            description: "Selesaikan total 10 rekaman speaking di berbagai topik.",
            badge: "🍀",
            category: "Speaking",
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            target: 10
          },
          {
            id: "ach_c1_speaker",
            title: "Explorer Confidence",
            description: "Capai skor rata-rata di atas 80 dalam satu rekaman.",
            badge: "🌟",
            category: "Competence",
            unlocked: false,
            unlockedAt: null,
            progress: 0,
            target: 1
          }
        ];
        defaultAchievements.forEach((ach) => achStore.put(ach));
        console.log("🏆 Seeded default achievements list");
      }
    };

    // 4. Seed Daily Challenges
    const challengeStore = transaction.objectStore("challenges");
    challengeStore.count().onsuccess = (e) => {
      const count = (e.target as IDBRequest).result;
      if (count === 0) {
        const todayStr = new Date().toISOString().split("T")[0];
        const defaultChallenges: DailyChallenge[] = [
          {
            id: "challenge_1",
            prompt: "🎤 Jelaskan cita-cita atau 'dream career' kamu dalam 60 detik secara percaya diri!",
            rewardXP: 150,
            isCompleted: false,
            date: todayStr
          },
          {
            id: "challenge_2",
            prompt: "🎤 Yakinkan seseorang untuk membaca buku favoritmu dalam 1 menit penuh!",
            rewardXP: 150,
            isCompleted: false,
            date: todayStr
          },
          {
            id: "challenge_3",
            prompt: "🎤 Deskripsikan bagaimana akhir pekan ideal (perfect weekend) yang cozy menurutmu!",
            rewardXP: 150,
            isCompleted: false,
            date: todayStr
          }
        ];
        defaultChallenges.forEach((chal) => challengeStore.put(chal));
        console.log("🎯 Seeded daily challenges for today");
      }
    };
    });
  });
}

// 👤 Profile DB methods
export async function getProfile(email: string): Promise<UserProfile | null> {
  const local = await readStore<UserProfile>("profile", email);
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.warn("Supabase load profile warning/error:", error.message);
      } else if (data) {
        const syncedProfile: UserProfile = {
          username: data.username,
          email: data.email,
          bio: data.bio || "",
          country: data.country || "ID",
          learningGoal: data.learning_goal || "",
          currentLevel: data.current_level || "A1",
          profilePic: data.profile_pic || "🍀",
          usernameChangeCount: data.username_change_count || 0,
          lastUsernameChangeDate: data.last_username_change_date || null,
          registrationDate: data.registration_date || new Date().toISOString(),
          onboardingCompleted: data.onboarding_completed ?? true,
          theme: data.theme || "clover",
          badge: data.badge || "Book Worm"
        };
        await writeStore<UserProfile>("profile", syncedProfile);
        return syncedProfile;
      }
    } catch (err) {
      console.warn("Supabase is connected but table 'user_profiles' might not exist yet. Relying on local data.", err);
    }
  }
  return local;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await writeStore<UserProfile>("profile", profile);
  if (supabase) {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          email: profile.email,
          username: profile.username,
          bio: profile.bio || "",
          country: profile.country || "ID",
          learning_goal: profile.learningGoal || "",
          current_level: profile.currentLevel || "A1",
          profile_pic: profile.profilePic || "🍀",
          username_change_count: profile.usernameChangeCount || 0,
          last_username_change_date: profile.lastUsernameChangeDate || null,
          registration_date: profile.registrationDate || new Date().toISOString(),
          onboarding_completed: profile.onboardingCompleted ?? true,
          theme: profile.theme || "clover",
          badge: profile.badge || "Book Worm"
        }, { onConflict: "email" });
      if (error) {
        console.warn("Supabase save profile error:", error.message);
      } else {
        console.log("🌲 Profile successfully synchronized with Supabase cloud database");
      }
    } catch (err) {
      console.warn("Could not sync profile to Supabase. Check user_profiles table schema.", err);
    }
  }
}

// 📈 Stats DB methods
export async function getStats(email?: string): Promise<UserStats | null> {
  const key = email || "user_stats";
  const local = await readStore<any>("stats", key);
  
  if (supabase && email) {
    try {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.warn("Supabase stats load warning:", error.message);
      } else if (data) {
        const syncedStats: UserStats = {
          totalSpeakingTime: data.total_speaking_time || 0,
          completedTopicsCount: data.completed_topics_count || 0,
          completedChallengesCount: data.completed_challenges_count || 0,
          vocabularyMasteredCount: data.vocabulary_mastered_count || 0,
          dailyStreak: data.daily_streak || 0,
          lastPracticeDate: data.last_practice_date || null,
          overallScore: data.overall_score || 0
        };
        await writeStore<any>("stats", { ...syncedStats, email: key });
        return syncedStats;
      }
    } catch (err) {
      console.warn("Could not load stats from Supabase 'user_stats' table.", err);
    }
  }
  return local;
}

export async function saveStats(stats: UserStats, email?: string): Promise<void> {
  const key = email || "user_stats";
  const objWithKey = { ...stats, email: key };
  await writeStore<any>("stats", objWithKey);
  
  if (supabase && email) {
    try {
      const { error } = await supabase
        .from("user_stats")
        .upsert({
          email: email,
          total_speaking_time: stats.totalSpeakingTime || 0,
          completed_topics_count: stats.completedTopicsCount || 0,
          completed_challenges_count: stats.completedChallengesCount || 0,
          vocabulary_mastered_count: stats.vocabularyMasteredCount || 0,
          daily_streak: stats.dailyStreak || 0,
          last_practice_date: stats.lastPracticeDate || null,
          overall_score: stats.overallScore || 0
        }, { onConflict: "email" });
      if (error) {
        console.warn("Supabase save stats error:", error.message);
      } else {
        console.log("📊 Stats successfully synchronized with Supabase cloud database");
      }
    } catch (err) {
      console.warn("Could not sync stats to Supabase. Check user_stats table schema.", err);
    }
  }
}

// 🎲 Retrieve Speaking Topics by Category or difficulty
export function getTopics(category?: string, difficulty?: string): Promise<SpeakingTopic[]> {
  return readAllStore<SpeakingTopic>("topics").then((topics) => {
    let filtered = topics;
    if (category && category !== "Random") {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (difficulty && difficulty !== "Random") {
      filtered = filtered.filter((t) => t.difficulty === difficulty);
    }
    return filtered;
  });
}

// 🎤 History DB Methods
export async function getSpeechHistory(userId: string): Promise<SpeechHistoryItem[]> {
  const localList = await readAllStore<SpeechHistoryItem>("history").then((list) => {
    return list
      .filter((item) => item.userId === userId)
      .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("speech_history")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (error) {
        console.warn("Supabase speech history load warning:", error.message);
      } else if (data && data.length > 0) {
        const syncedList: SpeechHistoryItem[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          topicId: item.topic_id || null,
          topicText: item.topic_text || "",
          category: item.category || "General",
          audioBase64: item.audio_base_64 || "",
          duration: item.duration || 0,
          timestamp: item.timestamp,
          transcript: item.transcript || "",
          highlights: typeof item.highlights === "string" ? JSON.parse(item.highlights) : (item.highlights || []),
          analysis: typeof item.analysis === "string" ? JSON.parse(item.analysis) : (item.analysis || {
            clarity: 0, confidence: 0, grammar: 0, pronunciation: 0, vocabulary: 0, fluency: 0,
            speakingPace: 0, fillerWordsCount: 0, fillerWordsList: [], structure: 0, engagement: 0,
            overallScore: 0, feedback: "", positives: [], improvements: []
          })
        }));

        for (const item of syncedList) {
          await writeStore<SpeechHistoryItem>("history", item);
        }
        return syncedList;
      }
    } catch (err) {
      console.warn("Could not fetch speech history from Supabase. Table 'speech_history' might not exist.", err);
    }
  }

  return localList;
}

export function getSpeechHistoryItem(id: string): Promise<SpeechHistoryItem | null> {
  return readStore<SpeechHistoryItem>("history", id);
}

export async function saveSpeechHistory(item: SpeechHistoryItem): Promise<void> {
  await writeStore<SpeechHistoryItem>("history", item);
  
  if (supabase) {
    try {
      const { error } = await supabase
        .from("speech_history")
        .upsert({
          id: item.id,
          user_id: item.userId,
          topic_id: item.topicId || null,
          topic_text: item.topicText,
          category: item.category,
          audio_base_64: item.audioBase64,
          duration: item.duration,
          timestamp: item.timestamp,
          transcript: item.transcript,
          highlights: item.highlights,
          analysis: item.analysis
        }, { onConflict: "id" });
      if (error) {
        console.warn("Supabase save speech history error:", error.message);
      } else {
        console.log("🎙️ Speech analysis successfully uploaded to Supabase!");
      }
    } catch (err) {
      console.warn("Could not upload speech history to Supabase 'speech_history' table.", err);
    }
  }
}

export function appendSpeechHistory(item: SpeechHistoryItem): Promise<void> {
  return saveSpeechHistory(item);
}


export function initDatabase(): Promise<void> {
  return initDB().then(() => seedInitialData());
}

// 📚 Vocabulary Methods
export async function getVocabulary(email: string): Promise<VocabularyWord[]> {
  const all = await readAllStore<VocabularyWord>("vocabulary");
  // Filter for this user
  const userWords = all.filter(w => w.id.startsWith(`${email}_`));
  if (userWords.length > 0) {
    // Return them with base id
    return userWords.map(w => ({ ...w, id: w.id.slice(email.length + 1) }));
  }
  
  // Seed for this user from default list
  const defaultWords: VocabularyWord[] = [
    {
      id: "vocab_1",
      word: "Serendipity",
      pronunciation: "/ˌserənˈdipədē/",
      meaning: "Penemuan keberuntungan atau hal menyenangkan secara tidak sengaja.",
      example: "Meeting my favorite teacher in another country was pure serendipity.",
      synonym: "Chance, fluke, luck",
      antonym: "Misfortune, design",
      difficulty: "Hard",
      category: "General",
      saved: false,
      learned: false
    },
    {
      id: "vocab_2",
      word: "Fluency",
      pronunciation: "/ˈflo͞oənsē/",
      meaning: "Kemampuan berbicara atau menulis bahasa asing secara lancar, santai, dan tanpa hambatan.",
      example: "Consistent practice on MeloTalk will skyrocket your English speaking fluency.",
      synonym: "Articulation, smoothness",
      antonym: "Hesitation, stutter",
      difficulty: "Easy",
      category: "Speaking",
      saved: false,
      learned: false
    },
    {
      id: "vocab_3",
      word: "Resilient",
      pronunciation: "/rəˈzilyənt/",
      meaning: "Tangguh; mampu pulih kembali dengan cepat dari kesulitan atau rintangan.",
      example: "To master a new language, one must remain resilient despite small errors.",
      synonym: "Tough, strong, flexible",
      antonym: "Fragile, weak",
      difficulty: "Medium",
      category: "Lifestyle",
      saved: false,
      learned: false
    },
    {
      id: "vocab_4",
      word: "Candid",
      pronunciation: "/ˈkandəd/",
      meaning: "Jujur, tulus, apa adanya, tanpa direkayasa.",
      example: "Her candid feedback helped me improve my interview behavior completely.",
      synonym: "Frank, honest, direct",
      antonym: "Insincere, devious",
      difficulty: "Easy",
      category: "Business",
      saved: false,
      learned: false
    },
    {
      id: "vocab_5",
      word: "Eloquence",
      pronunciation: "/ˈeləkwəns/",
      meaning: "Kefasihan dan keindahan ekspresi dalam berbicara atau merangkai argumen.",
      example: "The speaker's eloquence captivated the entire audience in the room.",
      synonym: "Poise, fluency, rhetoric",
      antonym: "Dullness, inarticulacy",
      difficulty: "Hard",
      category: "General",
      saved: false,
      learned: false
    },
    {
      id: "vocab_6",
      word: "Perspicacious",
      pronunciation: "/ˌpərspəˈkāSHəs/",
      meaning: "Memiliki pemahaman atau wawasan yang sangat tajam dan mendalam.",
      example: "His perspicacious analysis of the market trends saved the startup millions.",
      synonym: "Sharp, insightful, clever",
      antonym: "Unobservant, slow",
      difficulty: "Hard",
      category: "Business",
      saved: false,
      learned: false
    },
    {
      id: "vocab_7",
      word: "Solitude",
      pronunciation: "/ˈsäləˌt(y)o͞od/",
      meaning: "Keadaan menyendiri yang menenangkan dan nyaman, biasanya untuk refleksi diri.",
      example: "She found peace in the solitude of the mountain cabin.",
      synonym: "Privacy, loneliness",
      antonym: "Companionship, crowd",
      difficulty: "Medium",
      category: "Lifestyle",
      saved: false,
      learned: false
    },
    {
      id: "vocab_8",
      word: "Ephemeral",
      pronunciation: "/əˈfemərəl/",
      meaning: "Bersifat sementara atau hanya berlangsung sangat singkat.",
      example: "The colorful sunset over the ocean was beautiful but ephemeral.",
      synonym: "Fleeting, brief",
      antonym: "Permanent, eternal",
      difficulty: "Hard",
      category: "Travel",
      saved: false,
      learned: false
    }
  ];

  // Save with prefix to IndexedDB
  for (const item of defaultWords) {
    const userItem = { ...item, id: `${email}_${item.id}` };
    await writeStore<VocabularyWord>("vocabulary", userItem);
  }

  return defaultWords;
}

export function saveVocabularyWord(word: VocabularyWord, email: string): Promise<void> {
  const userWord = { ...word, id: `${email}_${word.id}` };
  return writeStore<VocabularyWord>("vocabulary", userWord);
}

// 🏆 Achievement Methods
export function getAchievements(): Promise<Achievement[]> {
  return readAllStore<Achievement>("achievements");
}

export function saveAchievement(ach: Achievement): Promise<void> {
  return writeStore<Achievement>("achievements", ach);
}

// 🎯 Daily Challenges Methods
export async function getChallenges(email: string): Promise<DailyChallenge[]> {
  const all = await readAllStore<DailyChallenge>("challenges");
  // Filter for this user
  const userChallenges = all.filter(c => c.id.startsWith(`${email}_`));
  if (userChallenges.length > 0) {
    // Return them with base id
    return userChallenges.map(c => ({ ...c, id: c.id.slice(email.length + 1) }));
  }
  
  // Seed for this user from default list
  const defaultChallenges: DailyChallenge[] = [
    {
      id: "challenge_1",
      date: new Date().toISOString().split('T')[0],
      prompt: "🎤 Bicarakan tentang makanan tradisional favoritmu dari daerah asalmu dan mengapa kamu menyukainya selama 30 detik!",
      rewardXP: 150,
      isCompleted: false
    },
    {
      id: "challenge_2",
      date: new Date().toISOString().split('T')[0],
      prompt: "🎤 Jelaskan hobi barumu atau aktivitas santai yang paling ingin kamu geluti tahun ini dan dampaknya bagi pikiranmu!",
      rewardXP: 150,
      isCompleted: false
    },
    {
      id: "challenge_3",
      date: new Date().toISOString().split('T')[0],
      prompt: "🎤 Bayangkan dirimu sedang bercerita tentang tempat wisata impian di luar negeri yang paling dingin memakai ekspresi antusias!",
      rewardXP: 150,
      isCompleted: false
    }
  ];

  // Save with prefix to IndexedDB
  for (const item of defaultChallenges) {
    const userItem = { ...item, id: `${email}_${item.id}` };
    await writeStore<DailyChallenge>("challenges", userItem);
  }

  return defaultChallenges;
}

export function saveChallenge(chal: DailyChallenge, email: string): Promise<void> {
  const userChal = { ...chal, id: `${email}_${chal.id}` };
  return writeStore<DailyChallenge>("challenges", userChal);
}

// 🎨 Theme & Setting Storage
export function getTheme(email: string): Promise<string> {
  return readStore<{ key: string, value: string }>("settings", `theme_${email}`)
    .then((result) => result ? result.value : "clover");
}

export function saveTheme(email: string, theme: string): Promise<void> {
  return writeStore<{ key: string, value: string }>("settings", { key: `theme_${email}`, value: theme });
}
