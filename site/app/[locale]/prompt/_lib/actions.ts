"use server";

import { revalidateTag, unstable_noStore } from "next/cache";
import { getErrorMessage } from "@/lib/handle-error";
import { type Prompt, type NewPrompt, type AppName, createPrompt as create, updatePrompt as update, deletePrompt as remove, deletePrompts as removeBatch, promptsCollection } from "@/db/schema";
import { FieldValue } from "@google-cloud/firestore";

export interface CreatePromptInput extends NewPrompt {}

export interface UpdatePromptInput {
  promptId: string;
  appName?: AppName;
  promptName?: string;
  content?: string;
  howToUse?: string;
  anonymous?: boolean;
}

export async function createPrompt(input: CreatePromptInput) {
  unstable_noStore();
  try {
    await create(input);
    revalidateTag("prompts");
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function updatePrompt(input: UpdatePromptInput) {
  unstable_noStore();
  try {
    const { promptId, ...updateData } = input;
    await update(promptId, updateData);
    revalidateTag("prompts");
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function deletePrompt(promptId: string) {
  unstable_noStore();
  try {
    await remove(promptId);
    revalidateTag("prompts");
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function deletePrompts(promptIds: string[]) {
  unstable_noStore();
  try {
    await removeBatch(promptIds);
    revalidateTag("prompts");
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function likePrompt(promptId: string, userEmail: string) {
  unstable_noStore();
  try {
    const promptRef = promptsCollection.doc(promptId);
    const doc = await promptRef.get();
    
    if (!doc.exists) {
      throw new Error("Prompt not found");
    }

    const prompt = doc.data() as Prompt;
    const isLiked = prompt.likedBy.includes(userEmail);

    await promptRef.update({
      likedBy: isLiked 
        ? FieldValue.arrayRemove(userEmail) 
        : FieldValue.arrayUnion(userEmail)
    });

    revalidateTag("prompts");
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function bookmarkPrompt(promptId: string, userEmail: string) {
  unstable_noStore();
  try {
    const promptRef = promptsCollection.doc(promptId);
    const doc = await promptRef.get();
    
    if (!doc.exists) {
      throw new Error("Prompt not found");
    }

    const prompt = doc.data() as Prompt;
    const isBookmarked = prompt.bookmarkedBy.includes(userEmail);

    await promptRef.update({
      bookmarkedBy: isBookmarked 
        ? FieldValue.arrayRemove(userEmail) 
        : FieldValue.arrayUnion(userEmail)
    });

    revalidateTag("prompts");
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}
