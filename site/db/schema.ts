import { Firestore, DocumentData, WithFieldValue, CollectionReference, Query, FieldValue } from "@google-cloud/firestore";
import { db as firestore } from "./index";

export const db = firestore;

export const AppNames = {
  extractor: "EBARA AI Extractor",
  chat: "EBARA AI Chat",
  speechToText: "EBARA AI Speech To Text",
} as const;

export type AppName = typeof AppNames[keyof typeof AppNames] | "";

export interface Prompt extends DocumentData {
  promptId: string;
  appName: AppName | "";
  userEmail: string;
  anonymous: boolean;
  promptName: string;
  promptNameEmbedding: number[];  // Vector embedding for similarity search
  content: string;
  howToUse?: string;
  likedBy: string[];  // Array of user emails who liked this prompt
  bookmarkedBy: string[];  // Array of user emails who bookmarked this prompt
  createdAt: Date;
  updatedAt: Date;
}

export type NewPrompt = {
  appName: AppName;
  userEmail: string;
  anonymous: boolean;
  promptName: string;
  content: string;
  howToUse?: string;
  likedBy?: string[];
  bookmarkedBy?: string[];
};

export const promptsCollection = db.collection('prompts') as CollectionReference<DocumentData>;

// Create a new prompt
// import { getEmbedding } from "@/app/[locale]/prompt/_lib/embedding";

export const createPrompt = async (data: NewPrompt): Promise<Prompt> => {
  const docRef = promptsCollection.doc();
  const now = new Date();
  
  // Generate embedding for promptName
  // const promptNameEmbedding = await getEmbedding(data.promptName);
  
  const newPrompt: WithFieldValue<Prompt> = {
    promptId: docRef.id,
    appName: data.appName,
    userEmail: data.userEmail,
    anonymous: data.anonymous,
    promptName: data.promptName,
    promptNameEmbedding: [],  // promptNameEmbedding,
    content: data.content,
    howToUse: data.howToUse,
    likedBy: data.likedBy || [],
    bookmarkedBy: data.bookmarkedBy || [],
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(newPrompt);
  return newPrompt as Prompt;
};

// Get a prompt by ID
export const getPrompt = async (promptId: string): Promise<Prompt | null> => {
  const doc = await promptsCollection.doc(promptId).get();
  return doc.exists ? (doc.data() as Prompt) : null;
};

// Update a prompt
export const updatePrompt = async (promptId: string, data: Partial<NewPrompt>): Promise<void> => {
  const updateData: WithFieldValue<Partial<Prompt>> = {
    ...data,
    updatedAt: new Date()
  };
  await promptsCollection.doc(promptId).update(updateData);
};

// Delete a prompt
export const deletePrompt = async (promptId: string): Promise<void> => {
  await promptsCollection.doc(promptId).delete();
};

// Delete multiple prompts
export const deletePrompts = async (promptIds: string[]): Promise<void> => {
  const batch = db.batch();
  promptIds.forEach(id => {
    const docRef = promptsCollection.doc(id);
    batch.delete(docRef);
  });
  await batch.commit();
};

// List prompts with optional filters
export const listPrompts = async (userEmail?: string, appName?: string): Promise<Prompt[]> => {
  let query: Query<DocumentData> = promptsCollection;
  
  if (userEmail) {
    query = query.where('userEmail', '==', userEmail);
  }
  
  if (appName) {
    query = query.where('appName', '==', appName);
  }
  
  const snapshot = await query.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      promptId: doc.id,
      appName: data.appName,
      userEmail: data.userEmail,
      anonymous: data.anonymous,
      promptName: data.promptName,
      content: data.content,
      howToUse: data.howToUse,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      likedBy: data.likedBy || [],
      bookmarkedBy: data.bookmarkedBy || [],
    } as Prompt;
  });
};
