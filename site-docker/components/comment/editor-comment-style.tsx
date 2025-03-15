import React, { useState } from "react";
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
  
  // Reset the input field when value changes (e.g., when parent component clears it)
  React.useEffect(() => {
    setTempValue(value);
  }, [value]);
  return (
    <div className={`flex gap-4 w-full items-start mt-1`}>
      <Avatar className={'w-[28px] h-[28px]'}>
        <AvatarImage src={''} />
        <AvatarFallback>{getInitialsFromEmail(currentUser.email)}</AvatarFallback>
      </Avatar>

      <div className={'w-full flex-1'}>
        <Textarea
          className={'resize-vertical min-h-[60px]'}
          placeholder={`Reply as ${currentUser.email}`}
          value={tempValue}
          onChange={(v) => {
            const newValue = v.target.value;
            setTempValue(newValue);
            onChange(newValue); // Call the parent's onChange handler immediately
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) {
              if (tempValue.trim()) {
                onChange(tempValue)
                setTempValue('')
              }
            }
          }}
        />
      </div>
    </div>
  )
}
