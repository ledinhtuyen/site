import { db } from ".";
import { Comment } from "@/types/comment";

const COLLECTION_NAME = "prompts";
const COMMENTS_COLLECTION_NAME = "comments";
const REPLY_COLLECTION_NAME = "replies";

export async function createComment(commentData: Omit<Comment, "id">): Promise<Comment> {
  if (!commentData.promptId) {
    throw new Error("promptId is required for all comments");
  }

  // If it's a reply comment, add it to the replies subcollection under the parent comment
  if (commentData.parentId && commentData.parentId !== commentData.promptId) {
    // Path: prompts/promptId/comments/parentId/replies/replyId
    const promptRef = db.collection(COLLECTION_NAME).doc(commentData.promptId);
    const parentRef = promptRef.collection(COMMENTS_COLLECTION_NAME).doc(commentData.parentId);
    const replyRef = parentRef.collection(REPLY_COLLECTION_NAME).doc();
    
    const comment = {
      ...commentData,
      id: replyRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await replyRef.set(comment);
    return comment;
  } else {
    // For top-level comments, create a new document in the comments collection under the prompt
    // Path: prompts/promptId/comments/
    const promptRef = db.collection(COLLECTION_NAME).doc(commentData.promptId);
    const commentRef = promptRef.collection(COMMENTS_COLLECTION_NAME).doc();
    
    const comment = {
      ...commentData,
      id: commentRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await commentRef.set(comment);
    return comment;
  }
}

export async function getCommentsByPromptId(promptId: string): Promise<Comment[]> {
  if (!promptId) {
    throw new Error("promptId is required to get comments");
  }

  // Get all top-level comments for this prompt
  const promptRef = db.collection(COLLECTION_NAME).doc(promptId);
  const snapshot = await promptRef
    .collection(COMMENTS_COLLECTION_NAME)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as Comment;
  });
}

export async function getCommentReplies(promptId: string, parentId: string): Promise<Comment[]> {
  if (!promptId || !parentId) {
    throw new Error("promptId and parentId are required to get replies");
  }

  // Get all replies for a specific parent comment
  // Path: prompts/promptId/comments/parentId/replies/*
  const promptRef = db.collection(COLLECTION_NAME).doc(promptId);
  const parentRef = promptRef.collection(COMMENTS_COLLECTION_NAME).doc(parentId);
  const snapshot = await parentRef
    .collection(REPLY_COLLECTION_NAME)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as Comment;
  });
}

export async function updateComment(
  id: string,
  promptId: string,
  data: Partial<Comment>
): Promise<void> {
  if (!promptId) {
    throw new Error("promptId is required to update a comment");
  }

  // First try to update as a top-level comment
  const promptRef = db.collection(COLLECTION_NAME).doc(promptId);
  const commentRef = promptRef.collection(COMMENTS_COLLECTION_NAME).doc(id);
  const commentDoc = await commentRef.get();
  
  if (commentDoc.exists) {
    await commentRef.update({
      ...data,
      updatedAt: new Date(),
    });
    return;
  }
  
  // If not found, search in reply subcollections
  const commentsSnapshot = await promptRef.collection(COMMENTS_COLLECTION_NAME).get();
  
  for (const parentDoc of commentsSnapshot.docs) {
    const replyRef = parentDoc.ref.collection(REPLY_COLLECTION_NAME).doc(id);
    const replyDoc = await replyRef.get();
    
    if (replyDoc.exists) {
      await replyRef.update({
        ...data,
        updatedAt: new Date(),
      });
      return;
    }
  }
  
  throw new Error("Comment not found");
}

export async function deleteComment(id: string, promptId: string): Promise<void> {
  if (!promptId) {
    throw new Error("promptId is required to delete a comment");
  }

  // First check if it's a top-level comment
  const promptRef = db.collection(COLLECTION_NAME).doc(promptId);
  const commentRef = promptRef.collection(COMMENTS_COLLECTION_NAME).doc(id);
  const commentDoc = await commentRef.get();
  
  if (commentDoc.exists) {
    // Delete all replies in the subcollection
    const repliesSnapshot = await commentRef.collection(REPLY_COLLECTION_NAME).get();
    const batch = db.batch();
    
    repliesSnapshot.docs.forEach((replyDoc) => {
      batch.delete(replyDoc.ref);
    });
    
    // Delete the comment
    batch.delete(commentRef);
    await batch.commit();
    return;
  }
  
  // If not found, search in reply subcollections
  const commentsSnapshot = await promptRef.collection(COMMENTS_COLLECTION_NAME).get();
  
  for (const parentDoc of commentsSnapshot.docs) {
    const replyRef = parentDoc.ref.collection(REPLY_COLLECTION_NAME).doc(id);
    const replyDoc = await replyRef.get();
    
    if (replyDoc.exists) {
      await replyRef.delete();
      return;
    }
  }
  
  throw new Error("Comment not found");
}


// Toggle like on a comment
export async function toggleLikeComment(
  id: string,
  promptId: string,
  userId: string
): Promise<boolean> {
  if (!promptId) {
    throw new Error("promptId is required to toggle like on a comment");
  }

  // First try to find it as a top-level comment
  const promptRef = db.collection(COLLECTION_NAME).doc(promptId);
  const commentRef = promptRef.collection(COMMENTS_COLLECTION_NAME).doc(id);
  const commentDoc = await commentRef.get();
  
  if (commentDoc.exists) {
    const comment = commentDoc.data() as Comment;
    const likes = comment.likes || [];
    
    // Check if user already liked the comment
    const alreadyLiked = likes.includes(userId);
    
    if (alreadyLiked) {
      // Remove like if already liked
      const updatedLikes = likes.filter(id => id !== userId);
      await commentRef.update({ likes: updatedLikes });
      return false; // Indicate like was removed
    } else {
      // Add like if not already liked
      likes.push(userId);
      await commentRef.update({ likes });
      return true; // Indicate like was added
    }
  }
  
  // If not found, search in reply subcollections
  const commentsSnapshot = await promptRef.collection(COMMENTS_COLLECTION_NAME).get();
  
  for (const parentDoc of commentsSnapshot.docs) {
    const replyRef = parentDoc.ref.collection(REPLY_COLLECTION_NAME).doc(id);
    const replyDoc = await replyRef.get();
    
    if (replyDoc.exists) {
      const reply = replyDoc.data() as Comment;
      const likes = reply.likes || [];
      
      // Check if user already liked the reply
      const alreadyLiked = likes.includes(userId);
      
      if (alreadyLiked) {
        // Remove like if already liked
        const updatedLikes = likes.filter(id => id !== userId);
        await replyRef.update({ likes: updatedLikes });
        return false; // Indicate like was removed
      } else {
        // Add like if not already liked
        likes.push(userId);
        await replyRef.update({ likes });
        return true; // Indicate like was added
      }
    }
  }
  
  throw new Error("Comment not found");
}
