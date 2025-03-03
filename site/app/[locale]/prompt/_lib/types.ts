import { Row } from "@tanstack/react-table";
import { Prompt } from "@/db/schema";

export type PromptRowAction = {
  type: "like" | "bookmark" | "delete";
  row: Row<Prompt>;
};
