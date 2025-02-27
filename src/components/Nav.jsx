"use client";

import Image from "next/image";
import { useState } from "react";
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '@hooks/useTranslation';
import { useRouter } from 'next/navigation';

const Nav = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [toggleDropdown, setToggleDropdown] = useState(false);

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <div onClick={() => router.push('/')} className='flex gap-2 flex-center cursor-pointer'>
        <Image
          src={`/assets/images/logo.svg`}
          alt='logo'
          width={30}
          height={30}
          className='object-contain'
        />
        <p className='logo_text'>PromptHub</p>
      </div>

      {/* Desktop Navigation */}
      <div className='sm:flex hidden'>
        <div className='flex gap-3 md:gap-5'>
          <button onClick={() => router.push('/create-prompt')} className='black_btn'>
            {t('nav.create_prompt')}
          </button>

          <div onClick={() => router.push('/profile')}>
            <Image
              src={`/assets/images/avatar.png`}
              width={37}
              height={37}
              className='rounded-full cursor-pointer'
              alt='profile'
            />
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
          <div className='flex'>
            <Image
              src={`/assets/images/avatar.png`}
              width={37}
              height={37}
              className='rounded-full'
              alt='profile'
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />
            <LanguageSwitcher />
            {toggleDropdown && (
              <div className='dropdown'>
                <button
                  onClick={() => {
                    router.push('/profile');
                    setToggleDropdown(false);
                  }}
                  className='dropdown_link'
                >
                  {t('nav.my_profile')}
                </button>
                <button
                  onClick={() => {
                    router.push('/create-prompt');
                    setToggleDropdown(false);
                  }}
                  className='dropdown_link'
                >
                  {t('nav.create_prompt')}
                </button>
              </div>
            )}
          </div>
      </div>
    </nav>
  );
};

export default Nav;
