"use client";

import { Loader } from "lucide-react";
import * as React from "react";
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

// Define the schema for creating a prompt
const createPromptSchema = z.object({
  promptName: z.string().min(1, "Title is required"),
  appName: z.enum(Object.values(AppNames) as [string, ...string[]], {
    required_error: "App is required",
  }),
  model: z.enum(Object.values(Models) as [string, ...string[]], {
    required_error: "Model is required",
  }),
  content: z.string().min(1, "Prompt content is required"),
  howToUse: z.string().min(1, "How to use is required"),
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

  function onSubmit(input: CreatePromptSchema) {
    startCreateTransition(async () => {
      // Ensure appName is correctly typed as AppName
      const createPromptInput: CreatePromptInput = {
        promptName: input.promptName,
        appName: input.appName as AppName,
        model: input.model as Model,
        content: input.content,
        howToUse: input.howToUse,
        anonymous: input.anonymous,
        userEmail,
      };

      const { error } = await createPrompt(createPromptInput);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success("Prompt created successfully");
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-[50rem]">
        <SheetHeader className="text-left">
          <SheetTitle>Create Prompt Post</SheetTitle>
          <SheetDescription>
            Let's share the useful prompts you created with everyone!
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="promptName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
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
                    onValueChange={field.onChange}
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
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an AI model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(Models).map((model) => (
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
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your prompt content here"
                      className="min-h-[150px] resize-none"
                      {...field}
                    />
                  </FormControl>
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
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
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
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
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
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
