import { Row } from "@tanstack/react-table";
import { Prompt } from "@/types/prompt";

export type PromptRowAction = {
  type: "like" | "bookmark" | "delete";
  row: Row<Prompt>;
};
