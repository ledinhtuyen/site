"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { type Model, type AppName, Models, AppNames } from "@/types/prompt"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageSquare, Heart, Bookmark, Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Check if model selection should be disabled based on app
const isModelSelectionDisabled = (appName: AppName): boolean => {
  return appName === AppNames.copilot || appName === AppNames.notebooklm;
};

// Get available models based on selected app
const getAvailableModels = (appName: AppName): Model[] => {
  if (appName === AppNames.gemini) {
    return [Models.gemini2Flash]; // Only gemini2Flash for Gemini app
  }
  return Object.values(Models); // All models for other apps
};

// Get default model for app
const getDefaultModelForApp = (appName: AppName): Model | undefined => {
  switch (appName) {
    case AppNames.chat:
      return Models.gpt4omini; // GPT-4o-mini for EBARA AI Chat
    case AppNames.gemini:
      return Models.gemini2Flash; // Only gemini2Flash for Gemini app
    case AppNames.copilot:
    case AppNames.notebooklm:
      return undefined; // No model selection for Copilot and NotebookLM
    default:
      return Models.gpt4; // Default fallback
  }
};

interface PromptCardContentProps {
  model: Model
  appName: AppName
  content: string
  howToUse: string
  likesCount: number
  bookmarksCount: number
  isEditing: boolean
  editedModel: Model
  editedAppName: AppName
  editedContent: string
  editedUsage: string
  setEditedModel: (model: Model) => void
  setEditedAppName: (appName: AppName) => void
  setEditedContent: (content: string) => void
  setEditedUsage: (usage: string) => void
  onCommentClick: () => void
  onLike: () => void
  onBookmark: () => void
  isLiked: boolean
  isBookmarked: boolean
}

export function PromptCardContent({
  model,
  appName,
  content,
  howToUse,
  likesCount,
  bookmarksCount,
  isEditing,
  editedModel,
  editedAppName,
  editedContent,
  editedUsage,
  setEditedModel,
  setEditedAppName,
  setEditedContent,
  setEditedUsage,
  onCommentClick,
  onLike,
  onBookmark,
  isLiked,
  isBookmarked
}: PromptCardContentProps) {
  const [isCopied, setIsCopied] = useState(false)

  // Determine if model badge should be rendered
  const shouldRenderModel = isEditing
    ? !(editedAppName === AppNames.copilot || editedAppName === AppNames.notebooklm)
    : !(appName === AppNames.copilot || appName === AppNames.notebooklm)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setIsCopied(true)
    toast.success("プロンプトがクリップボードにコピーされました")
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-primary/5 px-3 py-1 text-xs font-medium">
                    {isEditing ? (
                      <Select
                        value={editedAppName}
                        onValueChange={(value) => {
                          const appName = value as AppName;
                          setEditedAppName(appName);
                          
                          // Update model based on app selection
                          if (appName === AppNames.copilot || appName === AppNames.notebooklm) {
                            // For Copilot and NotebookLM, clear the model field
                            setEditedModel(undefined as unknown as Model);
                          } else if (appName === AppNames.gemini) {
                            // For Gemini, only allow gemini2Flash
                            setEditedModel(Models.gemini2Flash);
                          } else {
                            // For other apps, set the default model
                            setEditedModel(getDefaultModelForApp(appName) as Model);
                          }
                        }}
                      >
                        <SelectTrigger className="h-6 w-30 border-none p-0 text-xs">
                          <SelectValue placeholder={editedAppName} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AppNames).map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      appName
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>アプリ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Render model badge */}
            {shouldRenderModel && model && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-primary/5 px-3 py-1 text-xs font-medium">
                      {isEditing ? (
                        <Select
                          value={editedModel}
                          onValueChange={setEditedModel}
                          disabled={isModelSelectionDisabled(editedAppName)}
                        >
                          <SelectTrigger className="h-6 w-25 border-none p-0 text-xs">
                            <SelectValue placeholder={editedModel} />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableModels(editedAppName).map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        model
                      )}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>モデル</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center space-x-1 rounded-full bg-muted px-3 py-1 transition-colors hover:bg-muted/80 cursor-pointer"
                    onClick={onCommentClick}
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-teal-500" />
                    <span className="text-xs font-medium">0</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>コメント数</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center space-x-1 rounded-full px-3 py-1 transition-colors cursor-pointer",
                      isLiked
                        ? "bg-rose-100 dark:bg-rose-900/30"
                        : "bg-muted hover:bg-muted/80"
                    )}
                    onClick={onLike}
                  >
                    <Heart
                      className={cn(
                        "h-3.5 w-3.5",
                        isLiked
                          ? "text-rose-500 fill-rose-500"
                          : "text-rose-500"
                      )}
                    />
                    <span className="text-xs font-medium">{likesCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>いいね数</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center space-x-1 rounded-full px-3 py-1 transition-colors cursor-pointer",
                      isBookmarked
                        ? "bg-indigo-100 dark:bg-indigo-900/30"
                        : "bg-muted hover:bg-muted/80"
                    )}
                    onClick={onBookmark}
                  >
                    <Bookmark
                      className={cn(
                        "h-3.5 w-3.5",
                        isBookmarked
                          ? "text-indigo-500 fill-indigo-500"
                          : "text-indigo-500"
                      )}
                    />
                    <span className="text-xs font-medium">{bookmarksCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ブックマーク数</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <h4 className="mb-3 flex items-center justify-between rounded-md bg-primary/5 px-3 py-1.5 font-medium text-primary">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="text-sm font-semibold tracking-wide">プロンプト内容</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full transition-all duration-200 hover:bg-primary/10"
              onClick={handleCopy}
            >
              {isCopied ? <Check className="h-2 w-2 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </h4>
          <div className="group">
            <div
              className={cn(
                "relative rounded-lg border border-border/50 bg-card p-3 shadow-sm transition-all duration-200",
                "hover:border-border hover:shadow-md",
              )}
            >
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[150px] resize-none border-none p-3 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                    maxLength={2000}
                  />
                  <div className="flex justify-end items-center gap-1 text-xs text-muted-foreground mr-1">
                    <span className={editedContent.length >= 1800 ? "text-amber-500 font-medium" : ""}>
                      {editedContent.length}
                    </span>
                    <span>/</span>
                    <span className="font-medium">2000</span>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed break-words m-0">{content}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="mb-3 flex items-center gap-2 rounded-md bg-primary/5 px-3 py-1.5 font-medium text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span className="text-sm font-semibold tracking-wide">使用方法</span>
          </h4>
          <div
            className={cn(
              "relative rounded-lg border border-border/50 bg-card p-3 shadow-sm transition-all duration-200",
              "hover:border-border hover:shadow-md",
            )}
          >
            {isEditing ? (
              <div className="flex flex-col gap-1">
                <Textarea
                  value={editedUsage}
                  onChange={(e) => setEditedUsage(e.target.value)}
                  className="min-h-[150px] resize-none border-none p-3 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                  maxLength={1000}
                />
                <div className="flex justify-end items-center gap-1 text-xs text-muted-foreground mr-1">
                  <span className={editedUsage.length >= 900 ? "text-amber-500 font-medium" : ""}>
                    {editedUsage.length}
                  </span>
                  <span>/</span>
                  <span className="font-medium">1000</span>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed break-words m-0">{howToUse}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
