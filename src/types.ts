export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ThemeType = 'clover' | 'koi' | 'polka' | 'notebook' | 'nature' | 'minimal' | 'cute';

export interface UserProfile {
  username: string;
  email: string;
  bio: string;
  country: string;
  learningGoal: string;
  currentLevel: CEFRLevel;
  profilePic: string; // Base64 or Emoji
  usernameChangeCount: number;
  lastUsernameChangeDate: string | null;
  registrationDate: string;
  onboardingCompleted?: boolean;
  speakingGoal?: string;
  learningLanguage?: string;
  theme?: ThemeType;
  badge?: string;
}

export interface UserStats {
  totalSpeakingTime: number; // in seconds
  completedTopicsCount: number;
  completedChallengesCount: number;
  vocabularyMasteredCount: number;
  dailyStreak: number;
  lastPracticeDate: string | null;
  overallScore: number;
}

export interface SpeakingTopic {
  id: string;
  text: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  angles?: string[];
  framework?: string;
  frameworkHelper?: string[];
}

export interface HighlightItem {
  type: 'grammar' | 'repeated' | 'filler' | 'weak';
  text: string;
  suggestion: string;
  explanation: string;
}

export interface SpeechAnalysis {
  clarity: number; // 0-100
  confidence: number; // 0-100
  grammar: number; // 0-100
  pronunciation: number; // 0-100
  vocabulary: number; // 0-100
  fluency: number; // 0-100
  speakingPace: number; // words per minute
  fillerWordsCount: number;
  fillerWordsList: string[];
  structure: number; // 0-100
  engagement: number; // 0-100
  overallScore: number; // 0-100
  feedback: string;
  positives: string[];
  improvements: string[];
  aiImprovedVersion?: string;
  followUpQuestions?: string[];
  language?: string;
}

export interface SpeechHistoryItem {
  id: string;
  userId: string;
  topicId: string | null;
  topicText: string;
  category: string;
  audioBase64: string; // Permanently saved base64 audio
  duration: number; // in seconds
  timestamp: string;
  transcript: string;
  highlights: HighlightItem[];
  analysis: SpeechAnalysis;
}

export interface DailyChallenge {
  id: string;
  prompt: string;
  rewardXP: number;
  isCompleted: boolean;
  date: string; // YYYY-MM-DD
}

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  synonym: string;
  antonym: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  saved: boolean;
  learned: boolean;
  savedDate?: string;
  learnedDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string; // Emoji
  category: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  target: number;
}

export interface LeaderboardEntry {
  username: string;
  level: CEFRLevel;
  score: number;
  isCurrentUser?: boolean;
  streak: number;
  rank: number;
}
