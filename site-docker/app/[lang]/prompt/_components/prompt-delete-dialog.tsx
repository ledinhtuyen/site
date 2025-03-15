"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Prompt } from "@/types/prompt";
import { deletePrompt } from "../_lib/actions";

interface DeletePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onSuccess?: () => void;
}

export function DeletePromptDialog({
  open,
  onOpenChange,
  prompt,
  onSuccess,
}: DeletePromptDialogProps) {
  const handleDelete = async () => {
    if (!prompt) return;
    
    const result = await deletePrompt(prompt.promptId);
    
    if (!result.error && onSuccess) {
      onSuccess();
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Prompt</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this prompt? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
