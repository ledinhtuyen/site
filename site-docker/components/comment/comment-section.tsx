import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpIcon, CircleIcon, HeartIcon, SendIcon, SmileIcon } from "lucide-react";
import { EditorComment } from "@/components/comment/editor-comment";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import { EditorCommentStyle } from "@/components/comment/editor-comment-style";
import { generateId } from "@/lib/id";
import { MDXProvider } from "@mdx-js/react";
import PreviewComment from "@/components/comment/preview-comment";
import { formatDistance, format, differenceInDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import EmojiSelect from "@/components/comment/emoji-select";
import { DropdownMenu } from "@/components/comment/dropdown-menu-comment";
import { EditingEditorComment } from "@/components/comment/editing-editor-comment";
import { useTheme } from "next-themes";
import { Textarea } from "@/components/ui/textarea";
import { getInitialsFromEmail } from "@/lib/utils";
import { CommentLineConnector } from "@/components/comment/comment-line-connector";

interface CommentProps {
    className?: string;
    value: Comment[];
    currentUser: User;
    promptId?: string;
    createComment?: (input: any) => Promise<any>;
    createReply?: (input: any) => Promise<any>;
    updateComment?: (input: any) => Promise<any>;
    deleteComment?: (id: string, promptId: string) => Promise<any>;
    likeComment?: (id: string, promptId: string, userId: string) => Promise<any>;
}

interface CommentCardProps {
    comment: Comment,
    onReply: (val: string) => void,
    currentUser: User,
    onChange: (change: any) => void;
    onDelete: () => void;
    onLike: () => void;
}

// Helper function to format time based on age
const formatCommentTime = (date: Date) => {
    const daysDifference = differenceInDays(new Date(), date);
    
    if (daysDifference < 1) {
        // Less than 1 day old - show relative time
        return formatDistance(new Date(), date, { addSuffix: true });
    } else {
        // More than 1 day old - show date format
        return format(date, 'dd/MM/yyyy');
    }
};
export const CommentCard = ({
    comment,
    onReply = () => {
    },
    currentUser,
    onChange,
    onLike,
    onDelete,
}: CommentCardProps) => {
    const [replying, setReplying] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [editing, setEditing] = useState(false)
    const [isEdited, setIsEdited] = useState(false)
    const [showAllReplies, setShowAllReplies] = useState(false)

    // Check if the current user has liked this comment
    const isLiked = comment.likes?.includes(currentUser.email);
    // Count of likes
    const likeCount = comment.likes?.length || 0;

    return (
        <div className={'flex flex-col gap-1 relative'} id={`comment-${comment.id}`}>
            <div className={'flex gap-4'}>
                <Avatar className={'w-[32px] h-[32px] avatar-parent'}>
                    <AvatarImage src={''} />
                    <AvatarFallback>{getInitialsFromEmail(comment.user?.email)}</AvatarFallback>
                </Avatar>
                <div className={`flex flex-col w-full`}>
                    <div className={'min-h-[30px] rounded-lg s-comment-card border'}>
                        <div
                            className={'h-[37px] w-full user rounded-t-lg flex items-center justify-between border-b'}>
                            <div className={'flex items-center gap-2 px-3'}>
                                <span className={'font-semibold'}>{comment.user?.email}</span>
                                <CircleIcon size={3} />
                                <span className={'text-xs text-muted-foreground'}>
                                    {formatCommentTime(comment.createdAt)}
                                    {editing ? ' • editing...' : isEdited ? ' • edited' : ''}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span
                                    className={'cursor-pointer text-primary text-sm font-semibold comment-reply-btn'}
                                    onClick={() => setReplying(true)}
                                >
                                    Reply
                                </span>
                                <DropdownMenu
                                    comment={comment}
                                    currentUser={currentUser}
                                    openEditor={() => {
                                        setEditing(true)
                                    }}
                                    deleteComment={onDelete}
                                />
                            </div>
                        </div>
                        <div className={'p-3'}>
                            {editing ?
                                <EditingEditorComment
                                    currentUser={currentUser}
                                    value={comment.text}
                                    onChange={(val) => {
                                        onChange({
                                            text: val
                                        })
                                        setEditing(false)
                                        setIsEdited(true)
                                    }} />
                                : <PreviewComment source={comment.text} />}
                        </div>
                        {!editing &&
                            <div className={'flex flex-wrap items-center gap-2 md:gap-3 text-sm px-3 pb-2'}>
                                {/* Like button */}
                                <div
                                    onClick={() => {
                                        onLike();
                                    }}
                                    className={`border ${isLiked ? `border-[#4493f8] text-[#4493f8]` : ''} rounded-xl px-2 py-0.5 inline-flex gap-1 items-center cursor-pointer`}>
                                    {isLiked ? <span>❤️</span> : <HeartIcon size={16} />}
                                    <span>{likeCount}</span>
                                </div>
                            </div>}
                    </div>
                    {/* Reply button moved to header */}
                </div>
            </div>
            {replying ?
                <div className={'ml-[48px]'}>
                    <div className="flex flex-col gap-2">
                        <EditorCommentStyle
                            value={replyText}
                            onChange={(text) => {
                                setReplyText(text);
                            }}
                            currentUser={currentUser}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    if (replyText.trim() && replyText.length <= 500) {
                                        onReply(replyText);
                                        setReplyText('');
                                        setReplying(false);
                                    }
                                }}
                                disabled={!replyText.trim() || replyText.length > 500}
                                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 border font-medium text-sm transition-colors"
                            >
                                Send Reply
                            </button>
                            <button
                                onClick={() => {
                                    setReplyText('');
                                    setReplying(false);
                                }}
                                className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 border font-medium text-sm transition-colors"
                            >
                                Cancel Reply
                            </button>
                        </div>
                    </div>
                </div>
                : null}
            {comment.replies && comment.replies.length > 0 ?
                <div className={'ml-[48px] flex flex-col gap-2 mt-1 replies-container'}>
                    {/* Show only first 3 replies or all replies based on state */}
                    {(showAllReplies ? comment.replies : comment.replies.slice(0, 2)).map(rep => (
                        <div className={'flex gap-4 reply-comment'} key={rep.id} id={`reply-${rep.id}`}>
                            <Avatar className={'w-[28px] h-[28px] avatar-reply'}>
                                <AvatarImage src={''} />
                                <AvatarFallback>{getInitialsFromEmail(rep.user?.email)}</AvatarFallback>
                            </Avatar>
                            <div className={`flex flex-col w-full`}>
                                <div className={'min-h-[30px] rounded-lg s-comment-card border'}>
                                    <div
                                        className={'h-[37px] w-full user rounded-t-lg flex items-center justify-between border-b'}>
                                        <div className={'flex items-center gap-2 px-3'}>
                                            <span className={'font-semibold'}>{rep.user?.email}</span>
                                            <CircleIcon size={3} />
                                            <span className={'text-xs text-muted-foreground'}>
                                                {formatCommentTime(rep.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={'p-3'}>
                                        <PreviewComment source={rep.text} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Show "Show more" button if there are more than 3 replies */}
                    {comment.replies.length > 2 && (
                        <div>
                            <button
                                onClick={() => setShowAllReplies(!showAllReplies)}
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                {showAllReplies
                                    ? "Show less"
                                    : `Show more (${comment.replies.length - 2} more ${comment.replies.length - 2 === 1 ? 'reply' : 'replies'})`}
                            </button>
                        </div>
                    )}
                </div>
                : null}
        </div>
    )
}

export const CommentSection = ({
    className = '',
    value,
    currentUser,
    promptId = '',
    createComment,
    createReply,
    updateComment,
    deleteComment,
    likeComment,
}: CommentProps) => {
    const { theme = "system" } = useTheme()
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Calculate total pages
    const totalPages = Math.ceil(value.length / commentsPerPage);
    
    // Get current comments
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = value.slice(indexOfFirstComment, indexOfLastComment);
    
    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    // Go to previous page
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    // Go to next page
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    // Reset to page 1 when a new comment is added
    const handleNewComment = async (val: string) => {
        if (!createComment || !promptId) {
            // No fallback for local state in this version
            console.warn('createComment or promptId is missing');
            setCurrentPage(1);
            return;
        }
        
        try {
            setIsSubmitting(true);
            await createComment({
                promptId,
                text: val,
                user: currentUser
            });
            setCurrentPage(1); // Reset to first page to show the new comment
        } catch (error) {
            console.error("Failed to create comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MDXProvider
            components={{
                wrapper(props) {
                    return <div style={{ backgroundColor: 'lightblue' }} {...props} />;
                },
            }}
        >
            <div className={`max-w-screen-md flex flex-col gap-2 w-full ${className} relative`} ref={containerRef}>
                <CommentLineConnector containerRef={containerRef} />
                <EditorComment
                    currentUser={currentUser}
                    onChange={handleNewComment}
                    disabled={isSubmitting} />
                
                {currentComments.map(e => (
                    <CommentCard
                        currentUser={currentUser}
                        onReply={async (rep) => {
                            if (createReply && promptId) {
                                try {
                                    await createReply({
                                        promptId,
                                        parentId: e.id,
                                        text: rep,
                                        user: currentUser
                                    });
                                } catch (error) {
                                    console.error("Failed to create reply:", error);
                                }
                            } else {
                                // No fallback for local state in this version
                                console.warn('createReply or promptId is missing');
                            }
                        }}
                        onChange={async (change: any) => {
                            if (updateComment && e.id) {
                                try {
                                    await updateComment({
                                        id: e.id,
                                        text: change.text,
                                        promptId
                                    });
                                } catch (error) {
                                    console.error("Failed to update comment:", error);
                                }
                            } else {
                                // No fallback for local state in this version
                                console.warn('updateComment or id is missing');
                            }
                        }}
                        onDelete={async () => {
                            if (deleteComment && promptId && e.id) {
                                try {
                                    await deleteComment(e.id, promptId);
                                } catch (error) {
                                    console.error("Failed to delete comment:", error);
                                }
                            } else {
                                // No fallback for local state in this version
                                console.warn('deleteComment or promptId or id is missing');
                            }
                        }}
                        comment={e}
                        key={e.id}
                        onLike={async () => {
                            if (likeComment && promptId && e.id) {
                                try {
                                    await likeComment(
                                        e.id,
                                        promptId,
                                        currentUser.email
                                    );
                                } catch (error) {
                                    console.error("Failed to like comment:", error);
                                }
                            }
                        }}
                    />
                ))}
                
                {/* Pagination controls - only show if there are more than 5 comments */}
                {value.length > commentsPerPage && (
                    <div className="flex items-center justify-center mt-4 gap-2">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 rounded-md border font-medium text-sm transition-colors ${
                                currentPage === 1
                                ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                            }`}
                        >
                            Previous
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${
                                        currentPage === i + 1
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 rounded-md border font-medium text-sm transition-colors ${
                                currentPage === totalPages
                                ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </MDXProvider>
    )
}
