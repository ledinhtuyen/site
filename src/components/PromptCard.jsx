"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@hooks/useTranslation";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import PromptModal from './PromptModal';

const PromptCard = ({ email, prompt, handleEdit, handleDelete, handleTagClick }) => {
  const { t } = useTranslation();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {

    if (prompt.creator === email) return router.push("/profile");

    router.push(`/profile/${prompt.creator}`);
  };

  const handleCopy = () => {
    setCopied(prompt.prompt);
    navigator.clipboard.writeText(prompt.prompt);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className='prompt_card' onClick={handleOpen}>
        <div className='flex justify-between items-start gap-5'>
          <div
            className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
            onClick={handleProfileClick}
          >
            <Image
              src={`/assets/images/avatar.png`}
              alt={t('user_image')}
              width={40}
              height={40}
              className='rounded-full object-contain'
            />

            <div className='flex flex-col'>
              <h3 className='font-satoshi font-semibold text-gray-900'>
                {prompt.creator}
              </h3>
              {/* <p className='font-inter text-sm text-gray-500'>
                {post.creator}
              </p> */}
            </div>
          </div>

          <div className='copy_btn' onClick={handleCopy}>
            <Image
              src={
                copied === prompt.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt={copied === prompt.prompt ? t('tick_icon') : t('copy_icon')}
              width={12}
              height={12}
            />
          </div>
        </div>

        <p className='my-4 font-satoshi text-sm text-gray-700 line-clamp-4'>{prompt.prompt}</p>
        <p
          className='font-inter text-sm blue_gradient cursor-pointer line-clamp-4'
          onClick={() => handleTagClick && handleTagClick(prompt.tag)}
        >
          #{prompt.tag}
        </p>
        {prompt.totalReactions > 0 && (
          <div className='mt-2 flex items-center'>
            <Image
              src="/assets/icons/reaction.png"
              alt={t('reaction_icon')}
              width={24}
              height={24}
              className='mr-1'
            />

              <p className='font-inter text-sm'>
                {prompt.totalReactions}
              </p>
          </div>
        )}
        {prompt.creator === email && pathName.endsWith("/profile") && (
          <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
            <p
              className='font-inter text-sm green_gradient cursor-pointer'
              onClick={handleEdit}
            >
              {t('Edit')}
            </p>
            <p
              className='font-inter text-sm orange_gradient cursor-pointer'
              onClick={handleDelete}
            >
              {t('Delete')}
            </p>
          </div>
        )}
      </div>

      <PromptModal
        open={open}
        handleClose={handleClose}
        prompt={prompt}
        email={email}
        pathName={pathName}
        handleCopy={handleCopy}
        copied={copied}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleTagClick={handleTagClick}
        promptReactions={prompt.reactions}
      />
    </>
  );
};

export default PromptCard;
