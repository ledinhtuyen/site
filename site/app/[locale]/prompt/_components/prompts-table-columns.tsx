"use client";

import { type Prompt, AppNames } from "@/db/schema";
import type { DataTableRowAction } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Bookmark, Ellipsis, Heart } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { likePrompt, bookmarkPrompt } from "../_lib/actions";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Prompt> | null>
  >;
  userEmail: string;
}

export function getColumns({
  setRowAction,
  userEmail,
}: GetColumnsProps): ColumnDef<Prompt>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "promptName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[500px] truncate font-medium">
          {row.getValue("promptName")}
        </div>
      ),
    },
    {
      accessorKey: "appName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="App" />
      ),
      cell: ({ row }) => row.getValue("appName"),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "userEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const prompt = row.original;
        return prompt.anonymous ? "Anonymous" : prompt.userEmail;
      },
    },
    {
      accessorKey: "likedBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Likes" />
      ),
      cell: ({ row }) => {
        const prompt = row.original;
        const isLiked = prompt.likedBy.includes(userEmail);
        return (
          <div className="flex items-center gap-2">
            <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} size={16} />
            <span>{prompt.likedBy.length}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "bookmarkedBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bookmarks" />
      ),
      cell: ({ row }) => {
        const prompt = row.original;
        const isBookmarked = prompt.bookmarkedBy.includes(userEmail);
        return (
          <div className="flex items-center gap-2">
            <Bookmark className={isBookmarked ? "fill-blue-500 text-blue-500" : ""} size={16} />
            <span>{prompt.bookmarkedBy.length}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isPending, startTransition] = React.useTransition();
        const prompt = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  startTransition(async () => {
                    await likePrompt(prompt.promptId, userEmail);
                    toast.success(
                      prompt.likedBy.includes(userEmail) 
                        ? "Removed from likes" 
                        : "Added to likes"
                    );
                  });
                }}
                disabled={isPending}
              >
                {prompt.likedBy.includes(userEmail) ? "Unlike" : "Like"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  startTransition(async () => {
                    await bookmarkPrompt(prompt.promptId, userEmail);
                    toast.success(
                      prompt.bookmarkedBy.includes(userEmail)
                        ? "Removed from bookmarks"
                        : "Added to bookmarks"
                    );
                  });
                }}
                disabled={isPending}
              >
                {prompt.bookmarkedBy.includes(userEmail) ? "Unbookmark" : "Bookmark"}
              </DropdownMenuItem>
              {prompt.userEmail === userEmail && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setRowAction({ row, type: "delete" })}
                  >
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
