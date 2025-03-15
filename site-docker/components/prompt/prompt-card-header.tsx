"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash } from "lucide-react"
import { toast } from "sonner"

interface PromptCardHeaderProps {
  authorName: string
  authorAvatar: string
  title: string
  date: string
  isEditing: boolean
  editedTitle: string
  setEditedTitle: (title: string) => void
  setIsEditing: (isEditing: boolean) => void
  onSaveEdit: () => void
  onDelete: () => void
}

export function PromptCardHeader({
  authorName,
  authorAvatar,
  title,
  date,
  isEditing,
  editedTitle,
  setEditedTitle,
  setIsEditing,
  onSaveEdit,
  onDelete,
}: PromptCardHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <div className="p-6 flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-slate-50 to-slate-100 pb-4 pt-6 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
          <AvatarImage src={authorAvatar} alt={authorName} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
            {authorName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          {isEditing ? (
            <Input 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)} 
              className="font-semibold" 
            />
          ) : (
            <h3 className="text-xl font-semibold tracking-tight truncate max-w-[500px] cursor-pointer" title={title}>
              {title}
            </h3>
          )}
          <p className="text-sm text-muted-foreground">
            {authorName} • {date}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <Button
            variant="outline"
            onClick={onSaveEdit}
            className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            保存
          </Button>
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full transition-all duration-200 hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>編集</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>削除</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>本当に削除しますか？</DialogTitle>
                  <DialogDescription>このプロンプトを削除すると、元に戻すことはできません。</DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex justify-between sm:justify-between">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button variant="destructive" onClick={onDelete}>
                    削除
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}