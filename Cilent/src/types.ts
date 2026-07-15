export type ScreenState = "setup" | "debate" | "score";

export type VerdictType = "good" | "mixed" | "needs work";

export interface ScoreResponse {
  score: number;
  advice: string;
  improvement: string;
  verdict?: VerdictType;
  rating_label?: string;
  emoji?: string;
  reason?: string;
}

export interface ExampleOpinion {
  id: string;
  text: string;
  category: string;
  icon?: string;
}

export interface Message {
  role: "user" | "ai";
  text: string;
  timestamp: number;
}

export interface DebateChat {
  id: string;
  opinion: string;
  totalRounds: number;
  history: Message[];
  score: ScoreResponse | null;
  screen: ScreenState;
  timestamp: number;
}
