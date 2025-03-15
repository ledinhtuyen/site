"use server";

import { revalidateTag, unstable_noStore } from "next/cache";
import { getErrorMessage } from "@/lib/handle-error";
import {
  createPrompt as create,
  updatePrompt as update,
  deletePrompt as remove,
  // deletePrompts as removeBatch,
  toggleLikePrompt,
  toggleBookmarkPrompt
} from "@/db/prompt";
import {
  type Prompt,
  type NewPrompt,
  type AppName
} from "@/types/prompt";

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

// export async function deletePrompts(promptIds: string[]) {
//   unstable_noStore();
//   try {
//     await removeBatch(promptIds);
//     revalidateTag("prompts");
//     return { data: null, error: null };
//   } catch (err) {
//     return { data: null, error: getErrorMessage(err) };
//   }
// }

export async function likePrompt(promptId: string, userEmail: string) {
  unstable_noStore();
  try {
    // Use the toggleLikePrompt function from db/index.ts
    const isLiked = await toggleLikePrompt(promptId, userEmail);
    
    revalidateTag("prompts");
    revalidateTag(`prompt-${promptId}`);
    return { data: { isLiked }, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function bookmarkPrompt(promptId: string, userEmail: string) {
  unstable_noStore();
  try {
    // Use the toggleBookmarkPrompt function from db/index.ts
    const isBookmarked = await toggleBookmarkPrompt(promptId, userEmail);
    
    revalidateTag("prompts");
    revalidateTag(`prompt-${promptId}`);
    return { data: { isBookmarked }, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}
