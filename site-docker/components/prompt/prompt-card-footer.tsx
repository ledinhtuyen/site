"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromptCardFooterProps {
  isEditing: boolean
  isCopied: boolean
  onCancel: () => void
  onSave: () => void
  onCopy: () => void
}

export function PromptCardFooter({
  isEditing,
  isCopied,
  onCancel,
  onSave,
  onCopy,
}: PromptCardFooterProps) {
  return (
    <div className="flex justify-between border-t bg-gradient-to-r from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
      {isEditing ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
          >
            キャンセル
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-all duration-200 hover:from-indigo-600 hover:to-purple-600"
          >
            保存
          </Button>
        </div>
      ) : (
        <Button
          onClick={onCopy}
          className={cn(
            "flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white transition-all duration-300",
            "hover:from-indigo-600 hover:to-purple-600",
            isCopied && "bg-green-500 from-green-500 to-green-500 hover:from-green-600 hover:to-green-600",
          )}
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {isCopied ? "コピーしました" : "プロンプトをコピー"}
        </Button>
      )}
    </div>
  )
}