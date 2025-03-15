"use client";

import { type Prompt, AppNames, Models } from "@/types/prompt";
import type { DataTableRowAction } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Bookmark, Ellipsis, Heart } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import Link from "next/link";

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
    // {
    //   id: "select",
    //   header: ({ table }) => {
    //     const isAllSelected = table.getIsAllPageRowsSelected();
    //     const isSomeSelected = table.getIsSomePageRowsSelected();
    //     const state = isAllSelected ? true : isSomeSelected ? "indeterminate" : false;
        
    //     return (
    //       <Checkbox
    //         checked={state}
    //         onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
    //         aria-label="Select all"
    //         className="translate-y-0.5"
    //       />
    //     );
    //   },
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-0.5"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 40, // Set a smaller size for the checkbox column
    // },
    {
      accessorKey: "promptName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const prompt = row.original;
        const title = row.getValue("promptName") as string;
        const displayTitle = title.length > 20
          ? title.substring(0, 20) + "..."
          : title;
        
        return (
          <div className="max-w-[500px] truncate font-medium">
            <Link
              href={`/prompt/${prompt.promptId}`}
              className="hover:underline hover:text-primary cursor-pointer"
              title={title} // Show full title on hover
            >
              {displayTitle}
            </Link>
          </div>
        );
      },
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
      accessorKey: "model",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model" />
      ),
      cell: ({ row }) => row.getValue("model"),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "userEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Poster" />
      ),
      cell: ({ row }) => {
        const prompt = row.original;
        return prompt.anonymous ? "Anonymous" : prompt.userEmail;
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
      accessorKey: "likedBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Likes" />
      ),
      cell: ({ row }) => {
        const [isPending, startTransition] = React.useTransition();
        const prompt = row.original;
        const isLiked = prompt.likedBy.includes(userEmail);
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-auto w-auto p-0"
              onClick={() => {
                startTransition(async () => {
                  await likePrompt(prompt.promptId, userEmail);
                  toast.success(
                    isLiked
                      ? "Removed from likes"
                      : "Added to likes"
                  );
                });
              }}
              disabled={isPending}
            >
              <Heart
                className={`${isLiked ? "fill-red-500 text-red-500" : ""} cursor-pointer hover:text-red-500`}
                size={16}
              />
            </Button>
            <span>{prompt.likedBy.length}</span>
          </div>
        );
      },
      size: 80, // Set a smaller size for the likes column
    },
    {
      accessorKey: "bookmarkedBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bookmarks" />
      ),
      cell: ({ row }) => {
        const [isPending, startTransition] = React.useTransition();
        const prompt = row.original;
        const isBookmarked = prompt.bookmarkedBy.includes(userEmail);
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-auto w-auto p-0"
              onClick={() => {
                startTransition(async () => {
                  await bookmarkPrompt(prompt.promptId, userEmail);
                  toast.success(
                    isBookmarked
                      ? "Removed from bookmarks"
                      : "Added to bookmarks"
                  );
                });
              }}
              disabled={isPending}
            >
              <Bookmark
                className={`${isBookmarked ? "fill-blue-500 text-blue-500" : ""} cursor-pointer hover:text-blue-500`}
                size={16}
              />
            </Button>
            <span>{prompt.bookmarkedBy.length}</span>
          </div>
        );
      },
      size: 80, // Set a smaller size for the bookmarks column
    },
    // {
    //   id: "actions",
    //   cell: function Cell({ row }) {
    //     const [isPending, startTransition] = React.useTransition();
    //     const prompt = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button
    //             aria-label="Open menu"
    //             variant="ghost"
    //             className="flex size-8 p-0 data-[state=open]:bg-muted"
    //           >
    //             <Ellipsis className="size-4" aria-hidden="true" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end" className="w-40">
    //           <DropdownMenuItem
    //             onClick={() => {
    //               startTransition(async () => {
    //                 await likePrompt(prompt.promptId, userEmail);
    //                 toast.success(
    //                   prompt.likedBy.includes(userEmail) 
    //                     ? "Removed from likes" 
    //                     : "Added to likes"
    //                 );
    //               });
    //             }}
    //             disabled={isPending}
    //           >
    //             {prompt.likedBy.includes(userEmail) ? "Unlike" : "Like"}
    //           </DropdownMenuItem>
    //           <DropdownMenuItem
    //             onClick={() => {
    //               startTransition(async () => {
    //                 await bookmarkPrompt(prompt.promptId, userEmail);
    //                 toast.success(
    //                   prompt.bookmarkedBy.includes(userEmail)
    //                     ? "Removed from bookmarks"
    //                     : "Added to bookmarks"
    //                 );
    //               });
    //             }}
    //             disabled={isPending}
    //           >
    //             {prompt.bookmarkedBy.includes(userEmail) ? "Unbookmark" : "Bookmark"}
    //           </DropdownMenuItem>
    //           {prompt.userEmail === userEmail && (
    //             <>
    //               <DropdownMenuSeparator />
    //               <DropdownMenuItem
    //                 onSelect={() => setRowAction({ row, type: "delete" })}
    //               >
    //                 Delete
    //                 <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
    //               </DropdownMenuItem>
    //             </>
    //           )}
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    //   size: 40,
    // },
  ];
}
