"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Form from "@components/Form";
import { toast } from "react-toastify";
import { useTranslation } from "@hooks/useTranslation";

const CreatePrompt = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [submitting, setIsSubmitting] = useState(false);
  const [prompt, setPrompt] = useState({ prompt: "", tag: "" });

  const notifySuccess = () =>
    toast.success(t("prompt_created_successfully"));

  const createPrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/prompt/new`, {
        prompt: prompt.prompt,
        tag: prompt.tag,
      });

      if (response.status === 201) {
        notifySuccess();
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(t("something_went_wrong"));
    } finally {
      setIsSubmitting(false);

      setPrompt({ prompt: "", tag: "" });
    }
  };

  return (
    <Form
      type="Create"
      prompt={prompt}
      setPrompt={setPrompt}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;
