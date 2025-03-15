"use client";

import { Loader } from "lucide-react";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { createPrompt } from "../_lib/actions";
import { AppNames, type AppName, Models, type Model } from "@/types/prompt";
import { type CreatePromptInput } from "../_lib/actions";

// Map app names to their default models
const getDefaultModelForApp = (appName: AppName): Model | undefined => {
  switch (appName) {
    case AppNames.chat:
      return Models.gpt4omini; // GPT-4o-mini for EBARA AI Chat
    case AppNames.gemini:
      return Models.gemini2Flash; // Only gemini2Flash for Gemini app
    case AppNames.copilot:
    case AppNames.notebooklm:
      return undefined; // No model selection for Copilot and NotebookLM
    default:
      return Models.gpt4; // Default fallback
  }
};

// Get available models based on selected app
const getAvailableModels = (appName: AppName): Model[] => {
  if (appName === AppNames.gemini) {
    return [Models.gemini2Flash]; // Only gemini2Flash for Gemini app
  }
  return Object.values(Models); // All models for other apps
};

// Define the schema for creating a prompt
const createPromptSchema = z.object({
  promptName: z.string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less"),
  appName: z.enum(Object.values(AppNames) as [string, ...string[]], {
    required_error: "App is required",
  }),
  model: z.union([
    z.enum(Object.values(Models) as [string, ...string[]]),
    z.literal("none")
  ]).optional(),
  content: z.string()
    .min(1, "Prompt content is required")
    .max(2000, "Prompt content must be 2000 characters or less"),
  howToUse: z.string()
    .min(1, "How to use is required")
    .max(1000, "How to use must be 1000 characters or less"),
  anonymous: z.boolean().default(false),
});

type CreatePromptSchema = z.infer<typeof createPromptSchema>;

interface CreatePromptSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  userEmail: string;
}

export function CreatePromptSheet({ userEmail, ...props }: CreatePromptSheetProps) {
  const [isCreatePending, startCreateTransition] = React.useTransition();

  const form = useForm<CreatePromptSchema>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: {
      promptName: "",
      appName: undefined as unknown as AppName,
      model: undefined as unknown as Model,
      content: "",
      howToUse: "",
      anonymous: false,
    },
  });

  // Handle app selection change
  const handleAppChange = React.useCallback(
    (value: string) => {
      const appName = value as AppName;

      // Set the app name
      form.setValue("appName", appName);

      // Handle model selection based on app
      if (appName === AppNames.copilot || appName === AppNames.notebooklm) {
        // For Copilot and NotebookLM, clear the model field
        form.setValue("model", undefined, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      } else if (appName === AppNames.gemini) {
        // For Gemini, only allow gemini2Flash
        form.setValue("model", Models.gemini2Flash, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      } else {
        // For other apps, set the default model
        form.setValue("model", getDefaultModelForApp(appName), {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    },
    [form]
  );

  function onSubmit(input: CreatePromptSchema) {
    startCreateTransition(async () => {
      try {
        // Ensure appName is correctly typed as AppName
        const appName = input.appName as AppName;
        const createPromptInput: CreatePromptInput = {
          promptName: input.promptName,
          appName: appName,
          content: input.content,
          howToUse: input.howToUse,
          anonymous: input.anonymous,
          userEmail,
        };

        // Handle model selection based on app
        if (appName === AppNames.copilot || appName === AppNames.notebooklm) {
          // No model for Copilot and NotebookLM
        } else if (appName === AppNames.gemini) {
          // Only gemini2Flash for Gemini
          createPromptInput.model = Models.gemini2Flash;
        } else if (input.model && input.model !== "none") {
          // For other apps, add model if selected and not "none"
          createPromptInput.model = input.model as Model;
        }

        const { error } = await createPrompt(createPromptInput);

        if (error) {
          toast.error(error);
          return;
        }

        form.reset();
        props.onOpenChange?.(false);
        toast.success("Prompt created successfully");
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An error occurred while creating the prompt. Please try again.");
      }
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-[50rem] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Create Prompt Post</SheetTitle>
          <SheetDescription>
            Let's share the useful prompts you created with everyone!
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="promptName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title"
                      {...field}
                      maxLength={50}
                      className="border-primary/20 focus-visible:ring-primary/30"
                    />
                  </FormControl>
                  <div className="flex justify-end items-center gap-1 text-xs text-muted-foreground mr-1 mt-0.5">
                    <span className={field.value.length >= 40 ? "text-amber-500 font-medium" : ""}>
                      {field.value.length}
                    </span>
                    <span>/</span>
                    <span className="font-medium">50</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App</FormLabel>
                  <Select
                    onValueChange={handleAppChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Which app is it?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(AppNames).map((appName) => (
                          <SelectItem
                            key={appName}
                            value={appName}
                          >
                            {appName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Only show model field if not Copilot or NotebookLM */}
            {form.watch("appName") !== AppNames.copilot && form.watch("appName") !== AppNames.notebooklm ? (
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => {
                  const appName = form.watch("appName") as AppName;
                  const availableModels = getAvailableModels(appName);

                  return (
                    <FormItem>
                      <FormLabel>Model {appName === AppNames.gemini ? "(Required)" : "(Optional)"}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose an AI model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {appName !== AppNames.gemini && <SelectItem value="none">None</SelectItem>}
                            {availableModels.map((model) => (
                              <SelectItem
                                key={model}
                                value={model}
                              >
                                {model}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ) : (
              <div className="p-3 border rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  {form.watch("appName") === AppNames.copilot ? "Microsoft Copilot" : "Google NotebookLM"} doesn't require model selection
                </p>
              </div>
            )}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your prompt content here"
                      className="min-h-[150px] resize-none border-primary/20 focus-visible:ring-primary/30 p-3"
                      maxLength={2000}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-end items-center gap-1 text-xs text-muted-foreground mr-1 mt-0.5">
                    <span className={field.value.length >= 1800 ? "text-amber-500 font-medium" : ""}>
                      {field.value.length}
                    </span>
                    <span>/</span>
                    <span className="font-medium">2000</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="howToUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How to use</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain how to use this prompt effectively"
                      className="min-h-[80px] resize-none border-primary/20 focus-visible:ring-primary/30 p-3"
                      maxLength={1000}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-end items-center gap-1 text-xs text-muted-foreground mr-1 mt-0.5">
                    <span className={field.value.length >= 900 ? "text-amber-500 font-medium" : ""}>
                      {field.value.length}
                    </span>
                    <span>/</span>
                    <span className="font-medium">1000</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Post anonymously</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <div className="flex justify-end">
                <p className="text-sm font-semibold text-primary/90">
                  By clicking "Post", you agree to{" "}
                  <Dialog>
                    <DialogTrigger className="text-blue-500 underline decoration-blue-300/30 hover:decoration-blue-500 transition-all">
                      rule of post
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rules for Posting</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4 text-sm">
                        <div>
                          <h3 className="font-medium mb-2">1. Content Guidelines</h3>
                          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                            <li>Keep prompts professional and work-appropriate</li>
                            <li>No harmful, offensive, or inappropriate content</li>
                            <li>Avoid sensitive or confidential information</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">2. Quality Standards</h3>
                          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                            <li>Ensure prompts are clear and well-written</li>
                            <li>Include helpful "How to use" instructions</li>
                            <li>Test your prompt before posting</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">3. Respectful Sharing</h3>
                          <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                            <li>Share original content or give credit</li>
                            <li>Be open to feedback from the community</li>
                            <li>Help maintain a positive environment</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {" "}acknowledge
                </p>
              </div>
              <SheetFooter className="gap-2 mt-0 sm:space-x-0">
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </SheetClose>
                <Button disabled={isCreatePending} type="submit">
                  {isCreatePending && (
                    <Loader
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Post
                </Button>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
