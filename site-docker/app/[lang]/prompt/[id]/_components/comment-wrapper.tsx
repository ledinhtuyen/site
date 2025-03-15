"use client";

import { CommentSection } from "@/components/comment/comment-section";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";

export function CommentSectionWrapper({ 
    comments,
    currentUser 
}: { 
    comments: Comment[],
    currentUser: User
}) {
    return (
        <CommentSection 
            value={comments}
            currentUser={currentUser}
        />
    );
}