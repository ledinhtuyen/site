"use client";

import type { Prompt } from "@/types/prompt";
import type { Table } from "@tanstack/react-table";
import { Download, Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";

import { DeletePromptDialog } from "./prompt-delete-dialog";
import { CreatePromptSheet } from "./create-prompt-sheet";

interface PromptsTableToolbarActionsProps {
  table: Table<Prompt>;
  userEmail?: string;
}

export function PromptsTableToolbarActions({
  table,
  userEmail = "",
}: PromptsTableToolbarActionsProps) {
  const [createPromptOpen, setCreatePromptOpen] = React.useState(false);

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
      {/* <Button
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
      </Button> */}
      <Button
        variant="default"
        size="sm"
        onClick={() => setCreatePromptOpen(true)}
        className="gap-2"
      >
        <Plus className="size-4" aria-hidden="true" />
        Post Prompt
      </Button>
      <CreatePromptSheet
        userEmail={userEmail}
        open={createPromptOpen}
        onOpenChange={setCreatePromptOpen}
      />
    </div>
  );
}
