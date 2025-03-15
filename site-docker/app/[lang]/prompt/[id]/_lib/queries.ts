import { getCommentsByPromptId, getCommentReplies } from "@/db/comment";
import { unstable_cache } from "@/lib/unstable-cache";
import { getPrompt } from "@/db/prompt";

export async function getPromptById(promptId: string){
    return await unstable_cache(
        async () => {
            return await getPrompt(promptId)

        },
        [`prompt-${promptId}`],
        {
            revalidate: 3600,
            tags: [`prompt-${promptId}`],
        }
    )();
};

export async function getComments(promptId: string) {
    return await unstable_cache(
        async () => {
            const rootComments = await getCommentsByPromptId(promptId);

            // Fetch replies for each comment
            const commentsWithReplies = await Promise.all(
                rootComments.map(async (comment) => {
                    const replies = await getCommentReplies(promptId, comment.id);
                    return { ...comment, replies };
                })
            );
            return commentsWithReplies;
        },
        [`comments-${promptId}`],
        {
            revalidate: 3600,
            tags: [`comments-${promptId}`],
        }
    )();
}
