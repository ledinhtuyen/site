import { headers } from 'next/headers';
import { ContentLayout } from "@/components/panel/content-layout";
import { CommentBlock } from "./_components/comment";
import { PromptCard } from "@/components/prompt/prompt-card";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { PlaceholderContent } from "@/components/panel/placeholder-content";
import { notFound } from "next/navigation";
import { getPromptById, getComments } from "./_lib/queries";
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from 'react'
import { AnimatedConstellation } from "@/components/ui/animated-constellation"
import { updatePrompt, deletePrompt, likePrompt, bookmarkPrompt } from "./_lib/actions"

function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export default async function PromptDetailPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const headersList = await headers();
    const userEmail = headersList.get('x-goog-authenticated-user-email')?.replace("accounts.google.com:", "") || "test.user@email.com";

    const { id } = await params;
    const prompt = await getPromptById(id);
    const comments = await getComments(id);

    if (!prompt) {
        notFound();
    }

    return (
        <ContentLayout
            title="Prompt"
            showBackButton
            backUrl="/prompt"
        >
            <AnimatedConstellation>
                <PlaceholderContent>
                    <TracingBeam>
                        <PromptCard 
                            prompt={prompt} 
                            userEmail={userEmail} 
                            updatePrompt={updatePrompt}
                            deletePrompt={deletePrompt}
                            likePrompt={likePrompt}
                            bookmarkPrompt={bookmarkPrompt}
                            />
                        <CommentBlock
                            comments={comments}
                            promptId={id}
                        />
                    </TracingBeam>
                </PlaceholderContent>
            </AnimatedConstellation>
        </ContentLayout>
    )
}
