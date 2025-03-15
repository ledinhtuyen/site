import { DocumentData, WithFieldValue, Query } from "@google-cloud/firestore";
import { getEmbedding } from "@/lib/embedding";
import { type Prompt, NewPrompt } from "@/types/prompt";
import { db } from "./index";

export async function createPrompt(data: NewPrompt) {
  try {
    // Create document reference with error checking
    const docRef = db.collection('prompts').doc();

    const now = new Date();

    // Generate embedding for promptName, content, and howToUse
    const embedding = await getEmbedding([data.promptName, data.content, data.howToUse]);

    const newPrompt: WithFieldValue<Prompt> = {
      promptId: docRef.id,
      appName: data.appName,
      userEmail: data.userEmail,
      anonymous: data.anonymous,
      promptName: data.promptName,
      embedding: embedding,
      content: data.content,
      howToUse: data.howToUse,
      likedBy: data.likedBy || [],
      bookmarkedBy: data.bookmarkedBy || [],
      createdAt: now,
      updatedAt: now,
    };

    // Only add model if it's provided
    if (data.model) {
      newPrompt.model = data.model;
    }

    await docRef.set(newPrompt);
    return newPrompt as Prompt;
  } catch (error) {
    console.error("Error in createPrompt:", error);
    throw error;
  }
};

// Get a prompt by ID
export async function getPrompt(promptId: string) {
  const doc = await db.collection('prompts').doc(promptId).get();
  if (doc.exists) {
    const data = doc.data();
    const prompt: Partial<Prompt> = {
      promptId: doc.id,
      appName: data.appName,
      userEmail: data.userEmail,
      anonymous: data.anonymous,
      promptName: data.promptName,
      embedding: data.embedding,
      content: data.content,
      howToUse: data.howToUse,
      likedBy: data.likedBy,
      bookmarkedBy: data.bookmarkedBy,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
    
    // Only add model if it exists in the data
    if (data.model) {
      prompt.model = data.model;
    }
    
    return prompt as Prompt;
  } else {
    return null;
  }
};

// Update a prompt
export async function updatePrompt(promptId: string, data: Partial<NewPrompt>): Promise<void> {
  const updateData: WithFieldValue<Partial<Prompt>> = {
    ...data,
    updatedAt: new Date()
  };
  await db.collection('prompts').doc(promptId).update(updateData);
};

// Delete a prompt
export async function deletePrompt(promptId: string) {
  await db.collection('prompts').doc(promptId).delete();
};

// Delete multiple prompts
// export async function deletePrompts(promptIds: string[]) {
//   const batch = db.batch();
//   promptIds.forEach(id => {
//     const docRef = db.collection('prompts').doc(id);
//     batch.delete(docRef);
//   });
//   await batch.commit();
// };

// List prompts with optional filters
// export async function listPrompts(userEmail?: string, appName?: string){
//   let query: Query<DocumentData> = db.collection('prompts');

//   if (userEmail) {
//     query = query.where('userEmail', '==', userEmail);
//   }

//   if (appName) {
//     query = query.where('appName', '==', appName);
//   }

//   const snapshot = await query.orderBy('createdAt', 'desc').get();
//   return snapshot.docs.map(doc => {
//     const data = doc.data();
//     return {
//       promptId: doc.id,
//       appName: data.appName,
//       userEmail: data.userEmail,
//       anonymous: data.anonymous,
//       promptName: data.promptName,
//       content: data.content,
//       howToUse: data.howToUse,
//       createdAt: data.createdAt?.toDate() || new Date(),
//       updatedAt: data.updatedAt?.toDate() || new Date(),
//       likedBy: data.likedBy || [],
//       bookmarkedBy: data.bookmarkedBy || [],
//     } as Prompt;
//   });
// };

// Toggle like status for a prompt (like if not liked, unlike if already liked)
export async function toggleLikePrompt(promptId: string, userEmail: string): Promise<boolean> {
  const docRef = db.collection('prompts').doc(promptId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Prompt not found");
  }

  const { likedBy } = doc.data() as Prompt;
  const isCurrentlyLiked = likedBy.includes(userEmail);

  if (isCurrentlyLiked) {
    // Unlike: Remove user from likedBy array
    await docRef.update({ likedBy: likedBy.filter(email => email !== userEmail) });
    return false; // Return false to indicate the prompt is now unliked
  } else {
    // Like: Add user to likedBy array
    likedBy.push(userEmail);
    await docRef.update({ likedBy });
    return true; // Return true to indicate the prompt is now liked
  }
}

// Toggle bookmark status for a prompt (bookmark if not bookmarked, unbookmark if already bookmarked)
export async function toggleBookmarkPrompt(promptId: string, userEmail: string): Promise<boolean> {
  const docRef = db.collection('prompts').doc(promptId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Prompt not found");
  }

  const { bookmarkedBy } = doc.data() as Prompt;
  const isCurrentlyBookmarked = bookmarkedBy.includes(userEmail);

  if (isCurrentlyBookmarked) {
    // Unbookmark: Remove user from bookmarkedBy array
    await docRef.update({ bookmarkedBy: bookmarkedBy.filter(email => email !== userEmail) });
    return false; // Return false to indicate the prompt is now unbookmarked
  } else {
    // Bookmark: Add user to bookmarkedBy array
    bookmarkedBy.push(userEmail);
    await docRef.update({ bookmarkedBy });
    return true; // Return true to indicate the prompt is now bookmarked
  }
}
