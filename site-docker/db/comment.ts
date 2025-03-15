import { db } from ".";
import { ACTIONS_TYPE, Comment } from "@/types/comment";

const COLLECTION_NAME = "comments";

export async function createComment(commentData: Omit<Comment, "id">): Promise<Comment> {
  const docRef = db.collection(COLLECTION_NAME).doc();
  const comment = {
    ...commentData,
    id: docRef.id,
    createdAt: new Date(),
  };

  await docRef.set(comment);
  return comment;
}

export async function getComment(id: string): Promise<Comment | null> {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  
  const data = doc.data() as Comment;
  return {
    ...data,
    createdAt: new Date(data.createdAt),
  };
}

export async function getCommentsByParentId(parentId: string): Promise<Comment[]> {
  const snapshot = await db
    .collection(COLLECTION_NAME)
    .where("parentId", "==", parentId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Comment;
    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  });
}

export async function updateComment(
  id: string,
  data: Partial<Comment>
): Promise<void> {
  await db.collection(COLLECTION_NAME).doc(id).update({
    ...data,
    updatedAt: new Date(),
  });
}

export async function deleteComment(id: string): Promise<void> {
  // Delete all replies first
  const replies = await getCommentsByParentId(id);
  const batch = db.batch();

  replies.forEach((reply) => {
    const replyRef = db.collection(COLLECTION_NAME).doc(reply.id);
    batch.delete(replyRef);
  });

  // Delete the comment
  const commentRef = db.collection(COLLECTION_NAME).doc(id);
  batch.delete(commentRef);

  await batch.commit();
}

export async function updateCommentActions(
  id: string,
  userId: string,
  action: keyof typeof ACTIONS_TYPE,
  add: boolean
): Promise<void> {
  const commentRef = db.collection(COLLECTION_NAME).doc(id);
  const doc = await commentRef.get();
  
  if (!doc.exists) throw new Error("Comment not found");

  const comment = doc.data() as Comment;
  const actions = comment.actions || {};
  const selectedActions = comment.selectedActions || [];

  if (add) {
    actions[action] = (actions[action] || 0) + 1;
    selectedActions.push(action as any);
  } else {
    actions[action] = Math.max((actions[action] || 0) - 1, 0);
    const index = selectedActions.indexOf(action as any);
    if (index > -1) {
      selectedActions.splice(index, 1);
    }
  }

  await commentRef.update({ actions, selectedActions });
}