import React, { useState } from "react";

// Maximum character limit for comments
const MAX_COMMENT_LENGTH = 500;
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Camera, SendIcon, SmileIcon } from "lucide-react";
import { User } from "@/types/user";
import { getInitialsFromEmail } from "@/lib/utils";

interface EditorCommentStyle2Props {
  value?: string;
  onChange?: (val: string) => void;
  currentUser: User;
}

export const EditorCommentStyle = ({
  value = '',
  onChange = () => {
  },
  currentUser,
}: EditorCommentStyle2Props) => {
  const [tempValue, setTempValue] = useState('')
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
  
  // Reset the input field when value changes (e.g., when parent component clears it)
  React.useEffect(() => {
    setTempValue(value);
  }, [value]);
  
  // Adjust height when content changes
  React.useEffect(() => {
    adjustTextareaHeight();
  }, [tempValue]);
  return (
    <div className={`flex gap-4 w-full items-start mt-1`}>
      <Avatar className={'w-[28px] h-[28px]'}>
        <AvatarImage src={''} />
        <AvatarFallback>{getInitialsFromEmail(currentUser.email)}</AvatarFallback>
      </Avatar>

      <div className={'w-full flex-1'}>
        <Textarea
          ref={textareaRef}
          className={'resize-vertical min-h-[60px] overflow-hidden p-3 rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary transition-colors'}
          placeholder={`Reply as ${currentUser.email}`}
          value={tempValue}
          maxLength={MAX_COMMENT_LENGTH}
          style={{
            minHeight: '60px',
            lineHeight: '1.5',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px'
          }}
          onInput={adjustTextareaHeight}
          onChange={(v) => {
            const newValue = v.target.value;
            // Strictly enforce the character limit
            if (newValue.length <= MAX_COMMENT_LENGTH) {
              setTempValue(newValue);
              onChange(newValue); // Call the parent's onChange handler immediately
            } else {
              // If the new value exceeds the limit, truncate it
              const truncated = newValue.substring(0, MAX_COMMENT_LENGTH);
              setTempValue(truncated);
              onChange(truncated);
              
              // Update the input value to the truncated version
              v.target.value = truncated;
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) {
              if (tempValue.trim() && tempValue.length <= MAX_COMMENT_LENGTH) {
                onChange(tempValue)
                setTempValue('')
              }
            }
          }}
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
  )
}
