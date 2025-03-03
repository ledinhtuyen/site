"use client";

import type { Prompt } from "@/db/schema";
import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";

import { DeletePromptDialog } from "./prompt-delete-dialog";

interface PromptsTableToolbarActionsProps {
  table: Table<Prompt>;
}

export function PromptsTableToolbarActions({
  table,
}: PromptsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeletePromptDialog
          prompt={table.getFilteredSelectedRowModel().rows[0].original}
          open={false}
          onOpenChange={() => {}}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "prompts",
            excludeColumns: ["select", "actions"],
          })
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, create new prompt, etc.
       */}
    </div>
  );
}
