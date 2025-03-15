"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  title: string
  date: string
  isEditing: boolean
  editedTitle: string
  setEditedTitle: (title: string) => void
  setIsEditing: (isEditing: boolean) => void
  onSaveEdit: () => void
  onDelete: () => void
  onDeleteClick: () => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (isOpen: boolean) => void
  showEditDelete?: boolean
}

export function PromptCardHeader({
  authorName,
  title,
  date,
  isEditing,
  editedTitle,
  setEditedTitle,
  setIsEditing,
  onSaveEdit,
  onDelete,
  onDeleteClick,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  showEditDelete = true,
}: PromptCardHeaderProps) {

  return (
    <div className="p-6 flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-slate-50 to-slate-100 pb-4 pt-6 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
          <AvatarImage src="" alt={authorName} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
            {authorName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <div className="relative inline-block min-w-[200px]">
                <Textarea
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSaveEdit();
                    } else if (e.key === 'Escape') {
                      setIsEditing(false);
                    }
                  }}
                  className="font-semibold border-primary/20 focus-visible:ring-primary/30 min-w-[580px] resize-none overflow-y-scroll min-h-[2.5rem]"
                  maxLength={50}
                  autoFocus
                  placeholder="Enter title..."
                  aria-label="Edit prompt title"
                  rows={1}
                />
              </div>
              <div className="flex justify-end text-xs text-muted-foreground mr-1" aria-live="polite">
                <span
                  className={
                    editedTitle.length >= 45
                      ? "text-red-500 font-medium"
                      : editedTitle.length >= 40
                        ? "text-amber-500 font-medium"
                        : ""
                  }
                >
                  {editedTitle.length}
                </span>
                <span>/</span>
                <span className="font-medium">50</span>
              </div>
            </div>
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
            {showEditDelete && (
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
                            onClick={onDeleteClick}
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
          </>
        )}
      </div>
    </div>
  )
}
