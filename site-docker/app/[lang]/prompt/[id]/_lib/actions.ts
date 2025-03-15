"use server";

import { revalidateTag, unstable_noStore } from "next/cache";
import { getErrorMessage } from "@/lib/handle-error";
import {
//   createPrompt as create,
  updatePrompt as update,
  deletePrompt as remove,
  // deletePrompts as removeBatch,
  toggleLikePrompt,
  toggleBookmarkPrompt
} from "@/db/prompt";
import {
  createComment,
  updateComment,
  deleteComment,
  toggleLikeComment
} from "@/db/comment";
import {
//   type Prompt,
  type NewPrompt,
  type AppName,
  type Model
} from "@/types/prompt";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";

export interface CreatePromptInput extends NewPrompt {}

export interface UpdatePromptInput {
  promptId: string;
  appName?: AppName;
  promptName?: string;
  content?: string;
  howToUse?: string;
  anonymous?: boolean;
  model?: Model;
}

export interface CreateCommentInput {
  promptId: string;
  text: string;
  user: User;
  parentId?: string;
  allowUpvote?: boolean;
}

export interface UpdateCommentInput {
  id: string;
  text: string;
  promptId: string;
}

export async function updatePrompt(input: UpdatePromptInput) {
  unstable_noStore();
  try {
    const { promptId, ...updateData } = input;
    await update(promptId, updateData);
    
    // Revalidate both the general prompts tag and the specific prompt tag
    revalidateTag("prompts");
    revalidateTag(`prompt-${promptId}`);
    
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function deletePrompt(promptId: string) {
  unstable_noStore();
  try {
    await remove(promptId);
    
    // Revalidate both the general prompts tag and the specific prompt tag
    revalidateTag("prompts");
    revalidateTag(`prompt-${promptId}`);
    
    // Also revalidate comments for this prompt if they exist
    revalidateTag(`comments-${promptId}`);
    
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

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

// Comment Actions

export async function createNewComment(input: CreateCommentInput) {
  unstable_noStore();
  try {
    const { promptId, text, user } = input;
    
    // Create a new comment
    // Path: prompts/promptId/comments/randomId
    const comment = await createComment({
      text,
      user,
      promptId,
      parentId: promptId, // For top-level comments, parentId is the promptId
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Revalidate the comments tag for this prompt
    revalidateTag(`comments-${promptId}`);
    
    return { data: comment, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function createReplyComment(input: CreateCommentInput) {
  unstable_noStore();
  try {
    const { promptId, parentId, text, user } = input;
    
    if (!parentId) {
      throw new Error("Parent comment ID is required for replies");
    }
    
    // Create a reply comment
    // Path: prompts/promptId/comments/parentId/replies/randomId
    const comment = await createComment({
      text,
      user,
      promptId,
      parentId, // For replies, parentId is the ID of the parent comment
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Revalidate the comments tag for this prompt
    revalidateTag(`comments-${promptId}`);
    
    return { data: comment, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function updateExistingComment(input: UpdateCommentInput) {
  unstable_noStore();
  try {
    const { id, text, promptId } = input;
    
    // Update the comment
    await updateComment(id, promptId, { text });
    
    // Revalidate the comments tag for this prompt
    revalidateTag(`comments-${promptId}`);
    
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

export async function deleteExistingComment(id: string, promptId: string) {
  unstable_noStore();
  try {
    // Delete the comment and all its replies
    await deleteComment(id, promptId);
    
    // Revalidate the comments tag for this prompt
    revalidateTag(`comments-${promptId}`);
    
    return { data: null, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}

// Like a comment function
export async function likeComment(
  id: string,
  promptId: string,
  userId: string
) {
  unstable_noStore();
  try {
    // Toggle like on the comment
    const isLiked = await toggleLikeComment(id, promptId, userId);
    
    // Revalidate the comments tag for this prompt
    revalidateTag(`comments-${promptId}`);
    
    return { data: { isLiked }, error: null };
  } catch (err) {
    return { data: null, error: getErrorMessage(err) };
  }
}
