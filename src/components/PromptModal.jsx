import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogBody } from "@material-tailwind/react";
import { useTranslation } from "@hooks/useTranslation";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';

const PromptModal = ({ open, handleClose, prompt, email, pathName, handleCopy, copied, handleEdit, handleDelete, handleTagClick, promptReactions }) => {
  const { t } = useTranslation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [selectedEmoji, setSelectedEmoji] = useState('☺');

  useEffect(() => {
    if (!promptReactions) return;
    const formattedReactions = Object.entries(promptReactions).map(([emoji, emails]) => ({
      emoji,
      count: emails.length,
      emails
    }));
    setReactions(formattedReactions);

    const userReaction = formattedReactions.find(reaction => reaction.emails.includes(email));
    if (userReaction) {
      setSelectedEmoji(userReaction.emoji);
    }
  }, [promptReactions, email]);

  const handleEmojiSelect = async (emoji) => {
    const updatedReactions = reactions.map(reaction => {
      if (reaction.emails.includes(email)) {
        return { ...reaction, count: reaction.count - 1, emails: reaction.emails.filter(e => e !== email) };
      }
      return reaction;
    }).filter(reaction => reaction.count > 0);

    const existingReaction = updatedReactions.find(r => r.emoji === emoji.native);

    if (existingReaction) {
      existingReaction.count += 1;
      existingReaction.emails.push(email);
    } else {
      updatedReactions.push({ emoji: emoji.native, count: 1, emails: [email] });
    }

    setReactions(updatedReactions);
    setSelectedEmoji(emoji.native);
    setShowEmojiPicker(false);

    const reactionsToSend = updatedReactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = reaction.emails;
      return acc;
    }, {});

    try {
      await axios.post('/api/prompt/reaction', { promptId: prompt.id, reactions: reactionsToSend });
    } catch (error) {
      console.error('Failed to send reactions to server', error);
    }
  };

  const getPickerPosition = () => {
    const picker = document.querySelector('.emoji-picker');
    if (picker) {
      const rect = picker.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        picker.style.left = `-${rect.right - window.innerWidth + 10}px`;
      }
      if (rect.bottom > window.innerHeight) {
        picker.style.top = `-${rect.bottom - window.innerHeight + 10}px`;
      }
    }
  };

  return (
    <Dialog open={open} size="xl" handler={handleClose} className="p-6 rounded-lg shadow-lg">
      <DialogBody>
        <div className='flex justify-between items-start gap-5'>
          <div className='flex-1 flex justify-start items-center gap-3'>
            <Image
              src={`/assets/images/avatar.png`}
              alt={t('user_image')}
              width={40}
              height={40}
              className='rounded-full object-cover'
            />
            <div className='flex flex-col'>
              <h3 className='font-satoshi font-semibold text-gray-900'>
                {prompt.creator}
              </h3>
            </div>
          </div>
          <div className='copy_btn p-2 bg-gray-200 rounded-full cursor-pointer' onClick={handleCopy}>
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
        <div className='my-4 font-satoshi text-sm text-gray-700 max-h-40 overflow-y-auto'>
          {prompt.prompt}
        </div>
        <p
          className='font-inter text-sm text-blue-500 cursor-pointer hover:underline'
          onClick={() => handleTagClick && handleTagClick(prompt.tag)}
        >
          #{prompt.tag}
        </p>
        {prompt.creator === email && pathName.endsWith("/profile") && (
          <div className='mt-5 flex justify-center gap-4 border-t border-gray-200 pt-3'>
            <p
              className='font-inter text-sm text-green-500 cursor-pointer hover:underline'
              onClick={handleEdit}
            >
              {t('Edit')}
            </p>
            <p
              className='font-inter text-sm text-orange-500 cursor-pointer hover:underline'
              onClick={handleDelete}
            >
              {t('Delete')}
            </p>
          </div>
        )}
        <div className='mt-5 flex justify-center gap-4 relative'>
          <span
            className='text-gray-400 text-2xl cursor-pointer'
            onMouseEnter={() => {
              setShowEmojiPicker(true);
              setTimeout(getPickerPosition, 0);
            }}
            onMouseLeave={() => setShowEmojiPicker(false)}
          >
            {selectedEmoji}
          </span>
          {showEmojiPicker && (
            <div
              className='absolute top-8 emoji-picker'
              onMouseEnter={() => {
                setShowEmojiPicker(true);
                setTimeout(getPickerPosition, 0);
              }}
              onMouseLeave={() => setShowEmojiPicker(false)}
            >
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        {reactions && reactions.length > 0 && (
          <div className='mt-5 flex justify-center gap-4'>
            {reactions.map((reaction, index) => (
              <span key={index} className='text-xl'>
                {reaction.emoji} {reaction.count}
              </span>
            ))}
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default PromptModal;
