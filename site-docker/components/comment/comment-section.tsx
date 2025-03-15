import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpIcon, CircleIcon, HeartIcon, SendIcon, SmileIcon } from "lucide-react";
import { EditorComment } from "@/components/comment/editor-comment";
import { ACTIONS, ACTIONS_TYPE, Comment } from "@/types/comment";
import { User } from "@/types/user";
import { EditorCommentStyle } from "@/components/comment/editor-comment-style";
import { generateId } from "@/lib/id";
import { MDXProvider } from "@mdx-js/react";
import PreviewComment from "@/components/comment/preview-comment";
import { formatDistance, format, differenceInDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiSelect from "@/components/comment/emoji-select";
import { DropdownMenu } from "@/components/comment/dropdown-menu-comment";
import { EditingEditorComment } from "@/components/comment/editing-editor-comment";
import { useTheme } from "next-themes";
import { Textarea } from "@/components/ui/textarea";
import { getInitialsFromEmail } from "@/lib/utils";
import { CommentLineConnector } from "@/components/comment/comment-line-connector";

interface CommentProps {
    className?: string;
    isMdxEditor?: boolean;
    formatDate?: string;
    value: Comment[];
    currentUser: User,
    onChange?: (value: Comment[]) => void,
    allowUpVote?: boolean;
    onVoteChange?: (checked: boolean) => void
}

interface CommentCardProps {
    comment: Comment,
    onReply: (val: string) => void,
    currentUser: User,
    allowUpVote?: boolean;
    onChange: (change: any) => void;
    onDelete: () => void;
    onVoteChange: (change: boolean) => void;
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
    allowUpVote,
    onChange,
    onVoteChange,
    onDelete,
}: CommentCardProps) => {
    const [replying, setReplying] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [editing, setEditing] = useState(false)
    const [isEdited, setIsEdited] = useState(false)
    const [showAllReplies, setShowAllReplies] = useState(false)

    const actions = ACTIONS.filter(e => comment.actions && comment.actions[e.id] && comment.selectedActions?.includes(e.id))

    const upvote = (comment.actions ?? {})[ACTIONS_TYPE.UPVOTE];

    const upvoted = comment.selectedActions?.includes(ACTIONS_TYPE.UPVOTE);

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
                        {(allowUpVote && !editing) &&
                            <div className={'flex flex-wrap items-center gap-2 md:gap-3 text-sm px-3 pb-2'}>
                                <div
                                    onClick={() => {
                                        onVoteChange(!upvoted)
                                        const currentAmount = (comment.actions || {})[ACTIONS_TYPE.UPVOTE];
                                        if (upvoted) {
                                            if (currentAmount)
                                                onChange({
                                                    selectedActions: comment.selectedActions?.filter(e => e !== ACTIONS_TYPE.UPVOTE),
                                                    actions: {
                                                        ...(comment.actions || {}),
                                                        [ACTIONS_TYPE.UPVOTE]: currentAmount - 1,
                                                    }
                                                })
                                        } else {
                                            onChange({
                                                selectedActions: [...(comment.selectedActions ?? []), ACTIONS_TYPE.UPVOTE],
                                                actions: {
                                                    ...(comment.actions || {}),
                                                    [ACTIONS_TYPE.UPVOTE]: currentAmount ? currentAmount + 1 : 1,
                                                }
                                            })
                                        }
                                    }}
                                    className={`border ${upvoted ? `border-[#4493f8] text-[#4493f8]` : ''} rounded-xl px-2 py-0.5 inline-flex gap-1 items-center cursor-pointer`}>
                                    {upvoted ? <span>❤️</span> : <HeartIcon size={16} />}
                                    <span>{upvote ?? 0}</span>
                                </div>
                                {/* {actions?.map(e => (
                                    <div
                                        key={e.id}
                                        className={`border border-[#4493f8] text-[#4493f8] rounded-xl px-2 py-0.5 inline-flex gap-1 items-center cursor-pointer`}
                                    >
                                        <span>{e.emoji}</span>
                                        <span>{(comment.actions ?? {})[e.id]}</span>
                                    </div>
                                ))} */}
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
                                    if (replyText.trim()) {
                                        onReply(replyText);
                                        setReplyText('');
                                        setReplying(false);
                                    }
                                }}
                                disabled={!replyText.trim()}
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
    formatDate,
    isMdxEditor,
    value,
    onChange = () => {
    },
    currentUser,
    allowUpVote = false,
    onVoteChange = (change: boolean) => {
    }
}: CommentProps) => {
    const { theme = "system" } = useTheme()
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;
    
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
    const handleNewComment = (val: string) => {
        onChange([{
            id: generateId(),
            user: currentUser,
            createdAt: new Date(),
            replies: [],
            text: val,
        }, ...(value ?? [])]);
        setCurrentPage(1); // Reset to first page to show the new comment
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
                    onChange={handleNewComment} />
                
                {currentComments.map(e => (
                    <CommentCard
                        currentUser={currentUser}
                        onReply={(rep) => {
                            if (value) {
                                onChange(value.map(f => f.id === e.id ? {
                                    ...f,
                                    replies: [{
                                        id: generateId(),
                                        parentId: e.id,
                                        user: currentUser,
                                        createdAt: new Date(),
                                        replies: [],
                                        text: rep,
                                    }, ...(f.replies ?? [])]
                                } : f))
                            }
                        }}
                        onChange={(change: any) => {
                            if (value)
                                onChange(value.map(f => f.id === e.id ? {
                                    ...f,
                                    ...change,
                                } : f))
                        }}
                        onDelete={() => {
                            onChange(value.filter(f => f.id !== e.id))
                        }}
                        comment={e}
                        key={e.id}
                        allowUpVote={allowUpVote}
                        onVoteChange={onVoteChange}
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
