"use client";

import { type Prompt, AppNames, Models } from "@/types/prompt";
import type {
  DataTableAdvancedFilterField,
  DataTableFilterField,
  DataTableRowAction,
} from "@/types";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { toSentenceCase } from "@/lib/utils";

import type { getPrompts } from "../_lib/queries";
// import { useFeatureFlags } from "./feature-flags-provider";
import { getColumns } from "./prompts-table-columns";
import { PromptsTableFloatingBar } from "./prompts-table-floating-bar";
import { PromptsTableToolbarActions } from "./prompts-table-toolbar-actions";
import { DeletePromptDialog } from "./prompt-delete-dialog";

interface PromptsTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getPrompts>>]>;
  userEmail: string;
}

export function PromptsTable({ promises, userEmail }: PromptsTableProps) {
  // const { featureFlags } = useFeatureFlags();
  const [{ data, pageCount }] = React.use(promises);

  // const enableAdvancedTable = featureFlags.includes("advancedTable");
  // const enableFloatingBar = featureFlags.includes("floatingBar");
  
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Prompt> | null>(null);

  const columns = React.useMemo(
    () => getColumns({ setRowAction, userEmail }), 
    [userEmail]
  );

  const filterFields: DataTableFilterField<Prompt>[] = [
    {
      id: "promptName",
      label: "Name",
      placeholder: "Search prompts...",
    },
    {
      id: "appName",
      label: "App",
      options: Object.values(AppNames).map((app) => ({
        label: app,
        value: app,
      })),
    },
    {
      id: "model",
      label: "Model",
      options: Object.values(Models).map((model) => ({
        label: model,
        value: model,
      })),
    },
    {
      id: "userEmail",
      label: "User",
      placeholder: "Filter by user...",
    },
  ];

  const advancedFilterFields: DataTableAdvancedFilterField<Prompt>[] = [
    {
      id: "promptName",
      label: "Name",
      type: "text",
    },
    {
      id: "appName",
      label: "App",
      type: "multi-select",
      options: Object.values(AppNames).map((app) => ({
        label: app,
        value: app,
      })),
    },
    {
      id: "model",
      label: "Model",
      type: "multi-select",
      options: Object.values(Models).map((model) => ({
        label: model,
        value: model,
      })),
    },
    {
      id: "userEmail",
      label: "User Email",
      type: "text",
    },
    {
      id: "createdAt",
      label: "Created at",
      type: "date",
    },
    {
      id: "anonymous",
      label: "Anonymous",
      type: "boolean",
    },
  ];

  const { table } = useDataTable<Prompt>({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.promptId,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        floatingBar={
          // enableFloatingBar ? <PromptsTableFloatingBar table={table} /> : 
          null
        }
      >
        {/* {enableAdvancedTable ? (
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            shallow={false}
          >
            <PromptsTableToolbarActions table={table} userEmail={userEmail} />
          </DataTableAdvancedToolbar>
        ) : ( */}
          <DataTableToolbar table={table} filterFields={filterFields}>
            <PromptsTableToolbarActions table={table} userEmail={userEmail} />
          </DataTableToolbar>
        {/* )} */}
      </DataTable>

      <DeletePromptDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        prompt={rowAction?.row?.original ?? null}
        onSuccess={() => {
          rowAction?.row?.toggleSelected(false);
          setRowAction(null);
        }}
      />
    </>
  );
}

PromptsTable.displayName = "PromptsTable";
