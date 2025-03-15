import { headers } from "next/headers";
import { CommentSectionWrapper } from "./comment-wrapper";
import { Comment } from "@/types/comment";

export async function CommentBlock({ comments }: { comments: Comment[] }) {
    const headersList = await headers();
    const userEmail = headersList.get('x-goog-authenticated-user-email')?.replace("accounts.google.com:", "") || "test.user@email.com";
    const currentUser = { email: userEmail };

    return (
        <div
            className="flex align-center justify-start flex-col pt-6 md:pt-8"
            id="comment-section"
        >
            <CommentSectionWrapper 
                comments={comments}
                currentUser={currentUser}
            />
        </div>
    );
}
