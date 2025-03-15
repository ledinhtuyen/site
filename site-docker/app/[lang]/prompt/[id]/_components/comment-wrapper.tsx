"use client";

import { CommentSection } from "@/components/comment/comment-section";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import { CreateCommentInput, UpdateCommentInput } from "../_lib/actions";

interface CommentSectionWrapperProps {
    comments: Comment[];
    currentUser: User;
    promptId: string;
    createComment: (input: CreateCommentInput) => Promise<any>;
    createReply: (input: CreateCommentInput) => Promise<any>;
    updateComment: (input: UpdateCommentInput) => Promise<any>;
    deleteComment: (id: string, promptId: string) => Promise<any>;
    likeComment: (id: string, promptId: string, userId: string) => Promise<any>;
}

export function CommentSectionWrapper({
    comments,
    currentUser,
    promptId,
    createComment,
    createReply,
    updateComment,
    deleteComment,
    likeComment
}: CommentSectionWrapperProps) {
    return (
        <CommentSection
            value={comments}
            currentUser={currentUser}
            promptId={promptId}
            createComment={createComment}
            createReply={createReply}
            updateComment={updateComment}
            deleteComment={deleteComment}
            likeComment={likeComment}
        />
    );
}
