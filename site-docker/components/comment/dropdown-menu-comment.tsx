import React, { useEffect, useRef, useState } from "react";
import { EllipsisVertical, Check } from "lucide-react";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DropdownMenu({ comment, openEditor, currentUser, deleteComment }: {
  comment: Comment,
  openEditor: () => void,
  deleteComment: () => void,
  currentUser: User
}) {
  const ref = useRef<any>(null)
  const [open, setOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const copyToClipboard = async () => {
    const textToCopy = window.location.origin + window.location.pathname + `#comment-${comment.id}`;
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy ?? '');
      toast.success("Link copied to clipboard", {
        description: "You can now share this direct link to the comment",
        icon: <Check className="h-4 w-4" />
      });
      setOpen(false)
    }
  }

  // Function to scroll to comment element
  const scrollToComment = () => {
    const commentElement = document.getElementById(`comment-${comment.id}`);
    if (commentElement) {
      // Add a small delay to ensure the element is rendered
      setTimeout(() => {
        commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the comment briefly
        commentElement.classList.add('highlight-comment');
        setTimeout(() => {
          commentElement.classList.remove('highlight-comment');
        }, 2000);
      }, 100);
    }
  }

  const del = () => {
    setOpen(false)
    setShowDeleteDialog(true)
  }

  const handleDelete = () => {
    setShowDeleteDialog(false)
    deleteComment()
    toast.success("Comment deleted")
  }

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (open) setOpen(false)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, ref]);

  // Check if URL has a fragment that matches this comment and scroll to it
  useEffect(() => {
    if (window.location.hash === `#comment-${comment.id}`) {
      scrollToComment();
    }
  }, [comment.id]);

  // Listen for hashchange events to handle navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === `#comment-${comment.id}`) {
        scrollToComment();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [comment.id]);

  return (
    <>
      <div className={'dropdown'}>
        <div onClick={() => setOpen(!open)} className={'w-8 h-8 flex justify-center items-center cursor-pointer dropbtn'}>
          <EllipsisVertical size={18} />
        </div>
        <div
          ref={ref}
          className={`dropdown-content border rounded-lg overflow-hidden cursor-pointer ${open ? '!block' : ''}`}>
          <div
            className={'px-3 py-2 text-sm hover:bg-blue-500 hover:text-white'}
            onClick={copyToClipboard}
          >
            <div>Copy link</div>
          </div>
          {currentUser.email === comment.user.email && <div
            onClick={() => {
              openEditor()
              setOpen(false)
            }}
            className={'px-3 py-2 text-sm hover:bg-blue-500 hover:text-white'}
          >
            <div>Edit</div>
          </div>}
          {currentUser.email === comment.user.email && <div
            className={'px-3 py-2 text-sm text-red-600 hover:bg-blue-500 hover:text-white'}
            onClick={del}
          >
            <div>Delete</div>
          </div>}
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
