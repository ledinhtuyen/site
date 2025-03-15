"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { type Prompt, type Model, type AppName, AppNames, Models } from "@/types/prompt"
import { useRouter } from "next/navigation"

import { PromptCardHeader } from "./prompt-card-header"
import { PromptCardContent } from "./prompt-card-content"
import { PromptCardFooter } from "./prompt-card-footer"

interface UpdatePromptInput {
  promptId: string;
  appName?: AppName;
  promptName?: string;
  content?: string;
  howToUse?: string;
  anonymous?: boolean;
  model?: Model;
}
export function PromptCard({
  prompt,
  userEmail,
  updatePrompt,
  deletePrompt,
  likePrompt,
  bookmarkPrompt
}: {
  prompt: Prompt,
  userEmail: string,
  updatePrompt: (input: UpdatePromptInput) => Promise<{ data: any, error: string | null }>,
  deletePrompt: (promptId: string) => Promise<{ data: any, error: string | null }>,
  likePrompt: (promptId: string, userEmail: string) => Promise<{ data: { isLiked: boolean }, error: string | null }>,
  bookmarkPrompt: (promptId: string, userEmail: string) => Promise<{ data: { isBookmarked: boolean }, error: string | null }>
}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(prompt.promptName)
  const [editedModel, setEditedModel] = useState<Model | undefined>(prompt.model)
  const [editedAppName, setEditedAppName] = useState<AppName>(prompt.appName)
  const [editedContent, setEditedContent] = useState(prompt.content)
  const [editedUsage, setEditedUsage] = useState(prompt.howToUse)
  const [isCopied, setIsCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(prompt.likedBy.includes(userEmail))
  const [isBookmarked, setIsBookmarked] = useState(prompt.bookmarkedBy.includes(userEmail))
  const [likesCount, setLikesCount] = useState(prompt.likedBy.length)
  const [bookmarksCount, setBookmarksCount] = useState(prompt.bookmarkedBy.length)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content)
    setIsCopied(true)
    toast("プロンプトがクリップボードにコピーされました")
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSaveEdit = async () => {
    try {
      setIsSubmitting(true)
      
      // Prepare update input
      const updateInput: UpdatePromptInput = {
        promptId: prompt.promptId,
        promptName: editedTitle,
        appName: editedAppName,
        content: editedContent,
        howToUse: editedUsage,
      }
      
      // Only include model if it's applicable for the selected app
      if (editedAppName !== AppNames.copilot && editedAppName !== AppNames.notebooklm) {
        // For Gemini, always use gemini2Flash
        if (editedAppName === AppNames.gemini) {
          updateInput.model = Models.gemini2Flash;
        } else if (editedModel) {
          // For other apps, use the selected model
          updateInput.model = editedModel;
        }
      }
      
      const result = await updatePrompt(updateInput)
      
      if (result.error) {
        toast.error(`更新エラー: ${result.error}`)
        return
      }
      
      toast.success("プロンプトが正常に更新されました")
      setIsEditing(false)
      router.refresh() // Refresh the page to show updated data
    } catch (error) {
      toast.error("プロンプトの更新中にエラーが発生しました")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }
  
  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      const result = await deletePrompt(prompt.promptId)
      
      if (result.error) {
        toast.error(`削除エラー: ${result.error}`)
        return
      }
      
      toast.success("プロンプトが正常に削除されました")
      router.push("/prompt") // Redirect to prompts list
    } catch (error) {
      toast.error("プロンプトの削除中にエラーが発生しました")
      console.error(error)
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleLike = async () => {
    try {
      const result = await likePrompt(prompt.promptId, userEmail)
      
      if (result.error) {
        toast.error(`いいねエラー: ${result.error}`)
        return
      }
      
      const newIsLiked = result.data?.isLiked ?? !isLiked
      setIsLiked(newIsLiked)
      setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1)
      
      if (newIsLiked) {
        toast.success("プロンプトをいいねしました")
      } else {
        toast.success("いいねを解除しました")
      }
    } catch (error) {
      toast.error("いいね処理中にエラーが発生しました")
      console.error(error)
    }
  }

  const handleBookmark = async () => {
    try {
      const result = await bookmarkPrompt(prompt.promptId, userEmail)
      
      if (result.error) {
        toast.error(`ブックマークエラー: ${result.error}`)
        return
      }
      
      const newIsBookmarked = result.data?.isBookmarked ?? !isBookmarked
      setIsBookmarked(newIsBookmarked)
      setBookmarksCount(prev => newIsBookmarked ? prev + 1 : prev - 1)
      
      if (newIsBookmarked) {
        toast.success("プロンプトをブックマークしました")
      } else {
        toast.success("ブックマークを解除しました")
      }
    } catch (error) {
      toast.error("ブックマーク処理中にエラーが発生しました")
      console.error(error)
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

  return (
    <Card className="w-full max-w-3xl overflow-hidden border-none shadow-lg transition-all duration-200 hover:shadow-xl">
      <PromptCardHeader
        authorName={authorName}
        title={prompt.promptName}
        date={formattedDate}
        isEditing={isEditing}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        setIsEditing={setIsEditing}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        onDeleteClick={handleDeleteClick}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        showEditDelete={prompt.userEmail === userEmail}
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
        isLiked={isLiked}
        isBookmarked={isBookmarked}
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
