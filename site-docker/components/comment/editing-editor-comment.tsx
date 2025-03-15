import React, { useState } from "react";

// Maximum character limit for comments
const MAX_COMMENT_LENGTH = 500;
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CreateLink,
    headingsPlugin,
    imagePlugin,
    InsertImage,
    InsertTable,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
    Separator,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo
} from "@mdxeditor/editor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/user";
import { SendIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { getInitialsFromEmail } from "@/lib/utils";

interface EditorCommentProps {
    value?: string;
    onChange?: (val: string) => void;
    placeholder?: string,
    onUpload?: (image: File) => Promise<string>;
    currentUser: User;
}

export const EditingEditorComment = ({
    value = '', onChange = () => {
    },
    placeholder = 'Edit your comment...',
    onUpload,
    currentUser,
}: EditorCommentProps) => {
    const { theme } = useTheme()
    const [tempValue, setTempValue] = useState(value)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = 'auto';
            // Set the height to the scrollHeight to fit the content
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // Adjust height when content changes
    React.useEffect(() => {
        adjustTextareaHeight();
    }, [tempValue]);

    return (
        <div className={`flex flex-col gap-2 w-full editor-content-container`}>
            <div className={`flex gap-4 w-full`}>
                <div className={'w-full flex-1'}>
                    {/* Replace MDXEditor with a simple Textarea for better character limit control */}
                    <Textarea
                        ref={textareaRef}
                        value={tempValue}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            // Only update if within character limit
                            if (newValue.length <= MAX_COMMENT_LENGTH) {
                                setTempValue(newValue);
                            }
                        }}
                        placeholder={placeholder}
                        className="min-h-[100px] resize-vertical w-full overflow-hidden p-3 rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        maxLength={MAX_COMMENT_LENGTH}
                        style={{
                            minHeight: '100px',
                            lineHeight: '1.5',
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px'
                        }}
                        onInput={adjustTextareaHeight}
                    />
                    <div className="flex justify-end mt-2">
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                                tempValue.length >= MAX_COMMENT_LENGTH
                                ? "bg-destructive/10 text-destructive font-medium"
                                : tempValue.length > MAX_COMMENT_LENGTH * 0.8
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            {tempValue.length}/{MAX_COMMENT_LENGTH} characters
                        </span>
                    </div>
                </div>
            </div>
            <div className={'flex justify-end items-center gap-2'}>
                <Button
                    onClick={() => {
                        onChange(value)
                    }}
                    variant={'outline'}
                    className={'h-9 px-4 rounded-full font-medium transition-all hover:shadow-md'}
                >
                    Cancel
                </Button>
                <Button
                    disabled={!tempValue || tempValue.length > MAX_COMMENT_LENGTH}
                    onClick={() => {
                        // Only submit if within character limit
                        if (tempValue && tempValue.length <= MAX_COMMENT_LENGTH) {
                            onChange(tempValue)
                            setTempValue('')
                        }
                    }}
                    className={'h-9 px-4 rounded-full font-medium transition-all hover:shadow-md'}
                >
                    <span className="flex items-center gap-2">
                        Update Comment <SendIcon size={16} className="ml-1" />
                    </span>
                </Button>
            </div>
        </div>
    )
}
