"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { type Prompt, type Model, type AppName } from "@/types/prompt"

import { PromptCardHeader } from "./prompt-card-header"
import { PromptCardContent } from "./prompt-card-content"
import { PromptCardFooter } from "./prompt-card-footer"

interface PromptCardProps {
  prompt: Prompt
}

export function PromptCard({
  prompt
}: PromptCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(prompt.promptName)
  const [editedModel, setEditedModel] = useState<Model>(prompt.model)
  const [editedAppName, setEditedAppName] = useState<AppName>(prompt.appName)
  const [editedContent, setEditedContent] = useState(prompt.content)
  const [editedUsage, setEditedUsage] = useState(prompt.howToUse)
  const [isCopied, setIsCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(prompt.likedBy.length)
  const [bookmarksCount, setBookmarksCount] = useState(prompt.bookmarkedBy.length)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
    setIsCopied(true)
    toast("プロンプトがクリップボードにコピーされました")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSaveEdit = () => {
    // if (onUpdate) {
    //   onUpdate(id, {
    //     title: editedTitle,
    //     model: editedModel,
    //     content: editedContent,
    //     usage: editedUsage,
    //   })
    toast("プロンプトが正常に更新されました")
    // }
    setIsEditing(false)
  }

  const handleDelete = () => {
    // if (onDelete) {
    //   onDelete(id)
    toast("プロンプトが正常に削除されました")
    // }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    
    if (!isLiked) {
      toast.success("プロンプトをいいねしました")
    } else {
      toast.success("いいねを解除しました")
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    setBookmarksCount(prev => isBookmarked ? prev - 1 : prev + 1)
    
    if (!isBookmarked) {
      toast.success("プロンプトをブックマークしました")
    } else {
      toast.success("ブックマークを解除しました")
    }
  }

  const handleCommentClick = () => {
    const commentsSection = document.getElementById('comment-section')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const formattedDate = formatDistanceToNow(prompt.createdAt, { addSuffix: true, locale: ja })
  const authorName = prompt.anonymous ? "Anonymous" : prompt.userEmail
  const authorAvatar = "/placeholder.svg?height=40&width=40"

  return (
    <Card className="w-full max-w-3xl overflow-hidden border-none shadow-lg transition-all duration-200 hover:shadow-xl">
      <PromptCardHeader
        authorName={authorName}
        authorAvatar={authorAvatar}
        title={prompt.promptName}
        date={formattedDate}
        isEditing={isEditing}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        setIsEditing={setIsEditing}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
      />
      <PromptCardContent
        model={prompt.model}
        appName={prompt.appName}
        content={prompt.content}
        howToUse={prompt.howToUse}
        likesCount={likesCount}
        bookmarksCount={bookmarksCount}
        isEditing={isEditing}
        editedModel={editedModel}
        editedAppName={editedAppName}
        editedContent={editedContent}
        editedUsage={editedUsage}
        setEditedModel={setEditedModel}
        setEditedAppName={setEditedAppName}
        setEditedContent={setEditedContent}
        setEditedUsage={setEditedUsage}
        onCommentClick={handleCommentClick}
        onLike={handleLike}
        onBookmark={handleBookmark}
      />
      <PromptCardFooter
        isEditing={isEditing}
        isCopied={isCopied}
        onCancel={() => setIsEditing(false)}
        onSave={handleSaveEdit}
        onCopy={handleCopy}
      />
    </Card>
  )
}
