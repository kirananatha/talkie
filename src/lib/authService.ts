import { UserProfile, UserStats } from "../types";
import { getProfile, saveProfile, getStats, saveStats } from "./dbService";

// Local storage key for active session
const SESSION_KEY = "melotalk_auth_session";

export interface AuthState {
  currentUser: { email: string; username: string } | null;
  emailVerified: boolean;
  registrationProgress: 'form' | 'verify' | 'completed';
}

export function getSession(): AuthState | null {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveSession(state: AuthState) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Check and validate username change policy (max 3 changes in 30 days)
export async function canChangeUsername(email: string): Promise<{ allowed: boolean; remaining: number; error?: string }> {
  const profile = await getProfile(email);
  if (!profile) return { allowed: false, remaining: 0, error: "Profile tidak ditemukan." };

  const now = new Date();
  
  // Custom username changing constraints
  if (profile.usernameChangeCount >= 3) {
    if (profile.lastUsernameChangeDate) {
      const lastChange = new Date(profile.lastUsernameChangeDate);
      const diffTime = Math.abs(now.getTime() - lastChange.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 30) {
        return { 
          allowed: false, 
          remaining: 0, 
          error: `Kamu telah mencapai batas maksimal penggantian username (3 kali). Sisa hari tunggu: ${30 - diffDays} hari.` 
        };
      } else {
        // Reset count if it was more than 30 days ago
        profile.usernameChangeCount = 0;
        await saveProfile(profile);
        return { allowed: true, remaining: 3 };
      }
    }
  }

  return { allowed: true, remaining: 3 - profile.usernameChangeCount };
}

// Perform safe local register with user database
export async function registerUser(email: string, username: string, password: string): Promise<UserProfile> {
  const existing = await getProfile(email);
  if (existing) {
    throw new Error("Email ini sudah terdaftar. Silakan login.");
  }

  const defaultProfile: UserProfile = {
    email: email,
    username: username,
    bio: "Halo! Saya sedang melatih speaking Bahasa Inggris di MeloTalk 🍀",
    country: "ID",
    learningGoal: "Business & Casual Fluency",
    currentLevel: "A1",
    profilePic: "🍀",
    usernameChangeCount: 0,
    lastUsernameChangeDate: null,
    registrationDate: new Date().toISOString(),
    onboardingCompleted: false
  };

  const defaultStats: UserStats = {
    totalSpeakingTime: 0,
    completedTopicsCount: 0,
    completedChallengesCount: 0,
    vocabularyMasteredCount: 0,
    dailyStreak: 1,
    lastPracticeDate: new Date().toISOString(),
    overallScore: 0
  };

  await saveProfile(defaultProfile);
  await saveStats(defaultStats, email);
  
  // Register user credentials locally
  const credentials = JSON.parse(localStorage.getItem("melotalk_user_credentials") || "[]");
  credentials.push({ email, username, password });
  localStorage.setItem("melotalk_user_credentials", JSON.stringify(credentials));

  return defaultProfile;
}
