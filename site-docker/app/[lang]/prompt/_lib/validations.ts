import { type Prompt, AppNames } from "@/types/prompt";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault([]),
  searchTerm: parseAsString.withDefault(""),
  promptName: parseAsString.withDefault(""),
  appName: parseAsStringEnum([...Object.values(AppNames), ""]).withDefault(""),
  userEmail: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Prompt>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  anonymous: parseAsStringEnum(["true", "false"]).withDefault("false"),
});

export const createPromptSchema = z.object({
  appName: z.enum(Object.values(AppNames) as [string, ...string[]], {
    required_error: "App name is required",
    invalid_type_error: "Invalid app name",
  }),
  userEmail: z.string().email("Invalid email address"),
  anonymous: z.boolean().default(false),
  promptName: z.string().min(1, "Prompt name is required").max(50, "Prompt name must be 50 characters or less"),
  content: z.string().min(1, "Content is required").max(2000, "Content must be 2000 characters or less"),
  howToUse: z.string().max(1000, "How to use must be 1000 characters or less").optional(),
});

export const updatePromptSchema = z.object({
  promptId: z.string().min(1, "Prompt ID is required"),
  appName: z.enum(Object.values(AppNames) as [string, ...string[]]).optional(),
  promptName: z.string().min(1, "Prompt name is required").max(50, "Prompt name must be 50 characters or less").optional(),
  content: z.string().min(1, "Content is required").max(2000, "Content must be 2000 characters or less").optional(),
  howToUse: z.string().max(1000, "How to use must be 1000 characters or less").optional(),
  anonymous: z.boolean().optional(),
});

export type GetPromptsSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
export type CreatePromptSchema = z.infer<typeof createPromptSchema>;
export type UpdatePromptSchema = z.infer<typeof updatePromptSchema>;
