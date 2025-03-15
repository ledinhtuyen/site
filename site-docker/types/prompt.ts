import { DocumentData } from "@google-cloud/firestore";

export const AppNames = {
  extractor: "EBARA AI Extractor",
  chat: "EBARA AI Chat",
  speechToText: "EBARA AI Speech To Text",
} as const;

export const Models = {
  gpt35: "GPT-3.5",
  gpt4: "GPT-4",
  gpt4turbo: "GPT-4 Turbo",
  gemini: "Gemini",
  geminiPro: "Gemini Pro",
} as const;

export type AppName = typeof AppNames[keyof typeof AppNames] | "";
export type Model = typeof Models[keyof typeof Models];

export interface Prompt extends DocumentData {
  promptId: string;
  appName: AppName | "";
  model: Model;
  userEmail: string;
  anonymous: boolean;
  promptName: string;
  promptNameEmbedding: number[];  // Vector embedding for similarity search
  content: string;
  howToUse: string;
  likedBy: string[];  // Array of user emails who liked this prompt
  bookmarkedBy: string[];  // Array of user emails who bookmarked this prompt
  createdAt: Date;
  updatedAt: Date;
}

export type NewPrompt = {
  appName: AppName;
  model: Model;
  userEmail: string;
  anonymous: boolean;
  promptName: string;
  content: string;
  howToUse: string;
  likedBy?: string[];
  bookmarkedBy?: string[];
};
