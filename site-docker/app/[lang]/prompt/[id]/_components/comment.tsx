import { headers } from "next/headers";
import { CommentSectionWrapper } from "./comment-wrapper";
import { Comment } from "@/types/comment";
import {
    createNewComment,
    createReplyComment,
    updateExistingComment,
    deleteExistingComment,
    likeComment
} from "../_lib/actions";

interface CommentBlockProps {
    comments: Comment[];
    promptId?: string;
}

export async function CommentBlock({ comments, promptId }: CommentBlockProps) {
    const headersList = await headers();
    const userEmail = headersList.get('x-goog-authenticated-user-email')?.replace("accounts.google.com:", "") || "test.user@email.com";
    const currentUser = { email: userEmail };

    // Get the promptId from the first comment if not provided
    const effectivePromptId = promptId || (comments[0]?.parentId || '');

    return (
        <div
            className="flex align-center justify-start flex-col pt-6 md:pt-8"
            id="comment-section"
        >
            <CommentSectionWrapper
                comments={comments}
                currentUser={currentUser}
                promptId={effectivePromptId}
                createComment={createNewComment}
                createReply={createReplyComment}
                updateComment={updateExistingComment}
                deleteComment={deleteExistingComment}
                likeComment={likeComment}
            />
        </div>
    );
}
