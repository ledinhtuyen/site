"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Form from "@components/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from '@hooks/useTranslation';

const UpdatePromptPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [prompt, setPrompt] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getPromptDetails = async () => {
      const { data } = await axios.get(`/api/prompt/${promptId}`);

      setPrompt({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) {
      toast.error(t("toast.missing_prompt_id"));
      return;
    }

    try {
      const response = await axios.patch(`/api/prompt/${promptId}`, {
        prompt: prompt.prompt,
        tag: prompt.tag,
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(t("toast.update_error"));
    } finally {
      setIsSubmitting(false);

      toast.success(t("toast.update_success"));
    }
  };

  return (
    <Form
      type='Edit'
      prompt={prompt}
      setPrompt={setPrompt}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default function UpdatePrompt (){
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePromptPage />
    </Suspense>
  )
};
