// Nian Chat Configuration

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8063";

// Note: Supabase client is initialized in src/supabase.js

// Default character
export const DEFAULT_CHARACTER = {
  name: "Aria",
  tagline: "A quiet soul who listens without judgment",
  avatar: "A",
  color: "#8B6FBF",
  personality: "Thoughtful, calm, and deeply empathetic",
  messages: 2341,
};

// UI Configuration
export const ACCENT_COLORS = [
  "#8B6FBF", "#6F8BBF", "#BF6F8B", "#6FBF8B",
  "#BF956F", "#6FBFBF", "#BF6F6F", "#9BBF6F"
];

export const PERSONALITY_PRESETS = [
  { label: "Empathetic", desc: "Warm, listens deeply, never judges" },
  { label: "Witty", desc: "Sharp humor, playful banter" },
  { label: "Mysterious", desc: "Cryptic, poetic, speaks in riddles" },
  { label: "Mentor", desc: "Wise, encouraging, asks good questions" },
  { label: "Chaotic", desc: "Unpredictable, surprising, unhinged fun" },
  { label: "Stoic", desc: "Calm, minimal words, heavy meaning" },
];

export const SCENARIO_EXAMPLES = [
  { label: "Old friend", detail: "We haven't spoken in years. Something happened between us." },
  { label: "Late night stranger", detail: "We just met. It's 2am and neither of us can sleep." },
  { label: "Pen pal", detail: "We've been writing letters for months but never met." },
  { label: "Rival", detail: "We used to compete. Now we're stuck in the same room." },
  { label: "Mentor", detail: "You've guided me through the hardest year of my life." },
  { label: "Custom", detail: "Write your own scenario from scratch." },
];
